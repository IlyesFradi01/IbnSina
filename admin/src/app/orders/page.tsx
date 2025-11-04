'use client';

import { useEffect, useMemo, useState } from 'react';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002', []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/orders`, { cache: 'no-store' });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const prev = orders;
    setOrders(prev => prev.map(o => (String(o._id) === String(id) ? { ...o, status } : o)));
    try {
      const res = await fetch(`${apiUrl}/orders/${id}/status/${status}`, { method: 'PATCH' });
      if (!res.ok) throw new Error(await res.text());
    } catch (e) {
      // revert on failure
      setOrders(prev);
      alert('Failed to update status');
    }
  };

  const badgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-black">Orders</h1>
        <button onClick={load} className="px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50 text-black">Refresh</button>
      </div>
      {loading ? (
        <div className="text-black" >Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Order</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Contact</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Total</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Items</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o: any) => (
                <tr key={String(o._id)} className="hover:bg-gray-50">
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium text-black">#{String(o._id).slice(-6).toUpperCase()}</div>
                    <div className="text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-gray-900">{o?.shipping?.lastName || ''} {o?.shipping?.firstName || ''}</div>
                    <div className="text-gray-500 truncate max-w-[220px]" title={o?.shipping?.address}>{o?.shipping?.address}</div>
                    <div className="text-gray-500">{o?.shipping?.city}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-gray-900">{o?.shipping?.phone}</div>
                    <div className="text-gray-500">{o?.email || '-'}</div>
                  </td>
                  <td className="px-4 py-3 align-top text-black">TND {Number(o?.total || 0).toFixed(3)}</td>
                  <td className="px-4 py-3 align-top text-black">{Array.isArray(o?.items) ? o.items.length : 0}</td>
                  <td className="px-4 py-3 align-top">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass(o?.status)}`}>{o?.status}</span>
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <select
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={o?.status}
                      onChange={(e) => updateStatus(String(o._id), e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


