import { NextRequest } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || '';
const PATH_PREFIX = (process.env.BACKEND_PATH_PREFIX || '').replace(/\/+$/, '');

function buildTargetUrl(req: NextRequest, segments: string[]): string {
  const path = segments.join('/');
  const query = req.nextUrl.search;
  const base = BACKEND_URL?.replace(/\/+$/, '') || '';
  const prefix = PATH_PREFIX ? `${PATH_PREFIX.replace(/^\/?/, '/')}` : '';
  return `${base}${prefix}/${path}${query}`;
}

async function forward(req: NextRequest, segments: string[]) {
  if (!BACKEND_URL) {
    return new Response('Backend URL not configured', { status: 500 });
  }
  const target = buildTargetUrl(req, segments);
  const headers = new Headers();
  // Forward user-defined headers except host-related
  req.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === 'host' || k === 'x-forwarded-host' || k === 'x-vercel-proxied-for') return;
    headers.set(key, value);
  });
  // Ensure proper content-type for JSON passthrough if body exists
  const init: RequestInit = {
    method: req.method,
    headers,
    // Only pass body for methods that can have a body
    body: ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
      ? await req.arrayBuffer()
      : undefined,
    // Disable Next fetch caching for proxy
    cache: 'no-store',
  };
  try {
    let res = await fetch(target, init);
    // Fallback: if backend uses an extra '/api' prefix, retry once
    if (res.status === 404 && segments.length && segments[0] !== 'api') {
      const prefixed = buildTargetUrl(req, ['api', ...segments]);
      res = await fetch(prefixed, init);
    }
    const resHeaders = new Headers(res.headers);
    // Remove hop-by-hop headers
    resHeaders.delete('transfer-encoding');
    resHeaders.delete('connection');
    // Remove encoding/length to avoid double-decoding issues in browsers
    resHeaders.delete('content-encoding');
    resHeaders.delete('content-length');
    // Add diagnostics header for visibility
    try {
      resHeaders.set('x-proxy-backend-url', BACKEND_URL || '');
      resHeaders.set('x-proxy-request-path', `/${segments.join('/')}${req.nextUrl.search}`);
    } catch {}
    // Send a clean body buffer
    const body = await res.arrayBuffer();
    return new Response(body, {
      status: res.status,
      statusText: res.statusText,
      headers: resHeaders,
    });
  } catch (err: any) {
    const message = err?.message || 'Upstream fetch failed';
    return new Response(message, { status: 502 });
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forward(req, path || []);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forward(req, path || []);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forward(req, path || []);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forward(req, path || []);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forward(req, path || []);
}

export async function OPTIONS(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forward(req, path || []);
}


