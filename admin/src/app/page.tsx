"use client";

import { 
  ShoppingBagIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';

type Order = {
  _id: string;
  total: number;
  status?: string;
  createdAt?: string;
  shipping: { firstName?: string; lastName: string };
};

type Product = { _id: string; name: string };

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${apiUrl}/orders`, { cache: 'no-store' }),
          fetch(`${apiUrl}/products/open`, { cache: 'no-store' }).catch(() => null),
        ]);
        if (!ordersRes.ok) throw new Error(await ordersRes.text());
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        if (productsRes && productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(Array.isArray(productsData) ? productsData : []);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  }, [orders]);

  const totalOrders = orders.length;
  const totalCustomers = useMemo(() => {
    const setNames = new Set<string>();
    orders.forEach(o => setNames.add([o.shipping?.firstName, o.shipping?.lastName].filter(Boolean).join(' ').trim() || 'Unknown'));
    return setNames.size;
  }, [orders]);

  const stats = [
    { name: 'Total Revenue', value: `TND ${totalRevenue.toFixed(3)}`, change: '', changeType: 'increase', icon: CurrencyDollarIcon },
    { name: 'Total Orders', value: String(totalOrders), change: '', changeType: 'increase', icon: ShoppingBagIcon },
    { name: 'Total Customers', value: String(totalCustomers), change: '', changeType: 'increase', icon: UsersIcon },
    { name: 'Shipped/Delivered', value: String(orders.filter(o => ['shipped','delivered','confirmed'].includes(o.status || '')).length), change: '', changeType: 'increase', icon: ChartBarIcon },
  ];

  const recentOrders = useMemo(() => {
    return orders.slice(0, 5).map(o => ({
      id: o._id,
      customer: [o.shipping?.firstName, o.shipping?.lastName].filter(Boolean).join(' ') || 'Unknown',
      amount: `TND ${(o.total ?? 0).toFixed(3)}`,
      status: o.status || 'pending',
      date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '',
    }));
  }, [orders]);

  const topProducts = products.slice(0, 5).map(p => ({ name: p.name, sales: '-', revenue: '-' }));

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-1">
                  {stat.changeType === 'increase' ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          {/* Mobile: card list */}
          <div className="p-4 space-y-3 md:hidden">
            {recentOrders.length === 0 ? (
              <div className="text-sm text-gray-600">No recent orders.</div>
            ) : recentOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900 truncate break-all max-w-[70%]">{order.id}</div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">{order.customer}</div>
                <div className="mt-1 text-sm text-gray-900">{order.amount}</div>
                {order.date ? (<div className="mt-1 text-xs text-gray-500">{order.date}</div>) : null}
                <div className="mt-3">
                  <a href="/orders" className="text-xs text-green-700 hover:underline">View all orders</a>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: table */}
          <div className="overflow-x-auto hidden md:block no-scrollbar" style={{ scrollbarWidth: 'none' as any, msOverflowStyle: 'none' as any }}>
            <table className="w-full table-fixed md:table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions (moved here) */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/products/new"
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <ShoppingBagIcon className="h-8 w-8 text-green-600 mr-4" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Add New Product</h4>
                    <p className="text-gray-600">Create a new product listing</p>
                  </div>
                </div>
              </a>
              <a
                href="/categories/new"
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-blue-600 mr-4" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Manage Categories</h4>
                    <p className="text-gray-600">Organize your product categories</p>
                  </div>
                </div>
              </a>
              <a
                href="/orders"
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <UsersIcon className="h-8 w-8 text-purple-600 mr-4" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">View All Orders</h4>
                    <p className="text-gray-600">Manage customer orders</p>
                  </div>
                </div>
              </a>
              <a
                href="/messages"
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-amber-600 mr-4" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">View Messages</h4>
                    <p className="text-gray-600">Review and respond to contacts</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

/* Hide scrollbar for elements with .no-scrollbar */
<style jsx global>{`
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`}</style>


