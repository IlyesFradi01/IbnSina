'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart') || '[]';
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {}
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
  }, [items]);

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => {
      const next = prev
        .map(it => it.id === id ? { ...it, quantity: Math.max(1, (it.quantity || 1) + delta) } : it)
        .filter(it => it.quantity > 0);
      localStorage.setItem('cart', JSON.stringify(next));
      try { window.dispatchEvent(new Event('cartUpdated')); } catch {}
      return next;
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => {
      const next = prev.filter(it => it.id !== id);
      localStorage.setItem('cart', JSON.stringify(next));
      try { window.dispatchEvent(new Event('cartUpdated')); } catch {}
      return next;
    });
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setItems([]);
    try { window.dispatchEvent(new Event('cartUpdated')); } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">Your cart is empty.</p>
            <Link href="/products" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-black rounded overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-2xl">🌿</span>}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-black">{`TND ${(Number(item.price) || 0).toFixed(3)}`}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 bg-black text-white rounded">-</button>
                    <span className="w-8 text-center text-black">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 bg-black text-white rounded">+</button>
                  </div>
                  <div className="w-24 text-right font-semibold text-black">{`TND ${(item.price * item.quantity).toFixed(3)}`}</div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-red-600 hover:text-red-700"
                    aria-label="Remove item"
                    title="Remove"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6l1-2h6l1 2" />
                      <path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2L18 6" />
                      <path d="M10 10v8" />
                      <path d="M14 10v8" />
                    </svg>
                  </button>
                </div>
              ))}
              <button onClick={clearCart} className="text-sm text-black hover:underline">Clear cart</button>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <span className="text-black">Estimated total</span>
                <span className="font-semibold text-black">{`TND ${total.toFixed(3)}`}</span>
              </div>
              <Link href="/checkout" className="block w-full">
                <span className="inline-flex w-full justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">Checkout</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


