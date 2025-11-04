'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type OrderItem = {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
};

type Address = {
  country?: string;
  firstName?: string;
  lastName: string;
  address: string;
  apartment?: string;
  postalCode?: string;
  city: string;
  phone: string;
};

type Order = {
  _id: string;
  email?: string;
  emailOptIn?: boolean;
  shipping: Address;
  billingSameAsShipping?: boolean;
  billing?: Address;
  shippingMethod?: string;
  paymentMethod?: string;
  status?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt?: string;
};

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const id = params?.id;
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const res = await fetch(`${apiUrl}/orders/${id}`, { cache: 'no-store' });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || 'Failed to load order');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err?.message || 'Could not load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params]);

  const formattedDate = useMemo(() => {
    if (!order?.createdAt) return '';
    try { return new Date(order.createdAt).toLocaleString(); } catch { return ''; }
  }, [order?.createdAt]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-700">Loading order…</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-red-600 mb-4">{error || 'Order not found.'}</div>
            <Link href="/" className="text-green-700 hover:underline">Go back home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-2xl font-semibold text-gray-900">Thank you for your order</div>
          <Link href="/" className="text-sm text-green-700 hover:underline">Continue shopping</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order information</h2>
              <div className="text-sm text-gray-700 space-y-1">
             
                {formattedDate ? (<div><span className="font-medium text-gray-900">Placed:</span> {formattedDate}</div>) : null}
                <div><span className="font-medium text-gray-900">Status:</span> {order.status || 'pending'}</div>
                {order.email ? (<div><span className="font-medium text-gray-900">Email:</span> {order.email}</div>) : null}
                <div><span className="font-medium text-gray-900">Payment:</span> {' Cash on delivery'}</div>
                <div><span className="font-medium text-gray-900">Shipping:</span> { 'Delivery'}</div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping address</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <div className="text-gray-900">{[order.shipping.firstName, order.shipping.lastName].filter(Boolean).join(' ')}</div>
                <div>{order.shipping.address}</div>
                {order.shipping.apartment ? (<div>{order.shipping.apartment}</div>) : null}
                <div>{[order.shipping.postalCode, order.shipping.city].filter(Boolean).join(' ')}</div>
                <div>{order.shipping.country || 'Tunisia'}</div>
                <div>Phone: {order.shipping.phone}</div>
              </div>
            </section>

            {!order.billingSameAsShipping && order.billing ? (
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing address</h2>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="text-gray-900">{[order.billing.firstName, order.billing.lastName].filter(Boolean).join(' ')}</div>
                  <div>{order.billing.address}</div>
                  {order.billing.apartment ? (<div>{order.billing.apartment}</div>) : null}
                  <div>{[order.billing.postalCode, order.billing.city].filter(Boolean).join(' ')}</div>
                </div>
              </section>
            ) : null}
          </div>

          <aside className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>
            {order.items.length === 0 ? (
              <div className="text-sm text-gray-600">No items.</div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-black rounded overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-xl">🌿</span>}
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.size ? item.size : ''}</div>
                        <div className="text-sm text-gray-600">Quantity {item.quantity}</div>
                      </div>
                      <div className="text-gray-900">TND {(item.price * item.quantity).toFixed(3)}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-200 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-gray-900">TND {order.subtotal.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Shipping</span>
                    <span className="text-gray-900">TND {order.shippingCost.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-gray-900 pt-2">
                    <span>Total</span>
                    <span>TND {order.total.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>

        <div className="sr-only">Opens external website in a new window.Opens in a new window.Opens external website.</div>
      </div>
    </div>
  );
}


