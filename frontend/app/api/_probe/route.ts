import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest) {
  const backend = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || '';
  const base = backend.replace(/\/+$/, '');
  const results: Record<string, any> = {
    backendUrl: backend || null,
    checks: [],
  };
  if (!backend) {
    return Response.json({ ok: false, ...results, message: 'BACKEND_URL is not set in env' }, { status: 500 });
  }
  async function check(path: string) {
    const url = `${base}${path}`;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      const contentType = res.headers.get('content-type') || '';
      let bodySample = '';
      try {
        if (contentType.includes('application/json')) {
          bodySample = JSON.stringify(await res.json()).slice(0, 200);
        } else {
          bodySample = (await res.text()).slice(0, 200);
        }
      } catch {}
      results.checks.push({ url, status: res.status, ok: res.ok, contentType, bodySample });
    } catch (e: any) {
      results.checks.push({ url, error: e?.message || 'fetch failed' });
    }
  }
  await check('/products');
  await check('/api/products');
  await check('/categories');
  await check('/api/categories');
  return Response.json({ ok: true, ...results });
}


