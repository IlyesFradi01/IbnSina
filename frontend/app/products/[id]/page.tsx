"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = String(params?.id || '');
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const apiBase = '';
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(`${res.status} ${t || 'Failed to load product'}`);
        }
        const json = await res.json();
        setProduct(json || null);
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        setError(e?.message || 'Failed to load product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [id]);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const uploadsBase = apiBase || '/api';
  const resolvedImages = useMemo(() => {
    const images: string[] = typeof product?.images === 'string'
      ? product.images.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
    return images.map((raw) => {
      if (!raw) return raw;
      if (!/^https?:\/\//i.test(raw)) {
        return raw.startsWith('/uploads') ? `${uploadsBase}${raw}` : `${uploadsBase}/uploads/${encodeURIComponent(raw)}`;
      }
      try {
        const u = new URL(raw);
        if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
          const rel = u.pathname.startsWith('/uploads') ? u.pathname : `/uploads/${encodeURIComponent(u.pathname.replace(/^\/+/, ''))}`;
          return `${uploadsBase}${rel}`;
        }
      } catch {}
      return raw;
    });
  }, [product, apiBase]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link href="/products" className="text-sm text-green-700 hover:underline">← Back to products</Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h1 className="text-xl font-semibold text-gray-900">Loading product...</h1>
          </div>
        ) : error || !product ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
            <p className="text-gray-600 mb-6">The product you are looking for may have been removed.</p>
            <Link href="/products" className="text-green-700 hover:underline">Back to products</Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg flex items-center justify-center overflow-hidden">
                {resolvedImages[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resolvedImages[0]} alt={String(product?.name || 'Product')}
                    className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">🌿</span>
                )}
              </div>
              {resolvedImages.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {resolvedImages.slice(1, 5).map((src, idx) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={idx} src={src} alt="thumb" className="h-20 w-full object-cover rounded-md" />
                  ))}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{String(product?.name || 'Product')}</h1>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">{`TND ${Number(product?.price || 0)}`}</span>
                {product?.originalPrice != null && Number(product.originalPrice) > 0 && (
                  <span className="text-sm text-gray-500 line-through">{`TND ${Number(product.originalPrice)}`}</span>
                )}
              </div>
              {!(Number(product?.stock) > 0) && (
                <div className="mt-2 inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Out of Stock</div>
              )}
              <div className="mt-6 prose prose-sm max-w-none text-gray-700">
                <p>{String(product?.description || 'No description provided.')}</p>
              </div>
          
              <div className="mt-8">
                <button
                  type="button"
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${Number(product?.stock) > 0 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  disabled={!(Number(product?.stock) > 0)}
                  onClick={() => {
                    try {
                      const pid = String(product?._id || product?.id || id);
                      const name = String(product?.name || 'Product');
                      const price = Number(product?.price || 0);
                      const image = resolvedImages[0] || '';
                      const raw = localStorage.getItem('cart') || '[]';
                      const cart = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
                      const idx = cart.findIndex((it: any) => String(it.id) === pid);
                      if (idx >= 0) {
                        cart[idx].quantity = (Number(cart[idx].quantity) || 0) + 1;
                      } else {
                        cart.push({ id: pid, name, price, quantity: 1, image });
                      }
                      localStorage.setItem('cart', JSON.stringify(cart));
                      window.dispatchEvent(new Event('cartUpdated'));
                    } catch {}
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

