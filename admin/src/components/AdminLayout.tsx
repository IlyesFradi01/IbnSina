'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  HomeIcon,
  ShoppingBagIcon,
  TagIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const bellRef = useRef<HTMLButtonElement | null>(null);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Products', href: '/products', icon: ShoppingBagIcon },
    { name: 'Categories', href: '/categories', icon: TagIcon },
    { name: 'Orders', href: '/orders', icon: ChartBarIcon },

    { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Logout', href: '/login', icon: ArrowRightOnRectangleIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Require login for all admin pages (except /login)
  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token && pathname !== '/login') {
        router.replace('/login');
        setAuthChecked(true);
        return;
      }
      if (token && pathname === '/login') {
        router.replace('/');
        setAuthChecked(true);
        return;
      }
    } catch {}
    setAuthChecked(true);
  }, [pathname, router]);

  // Load unread messages and pending orders counts
  const refreshCounts = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const [messagesRes, ordersRes] = await Promise.all([
        fetch(`${apiUrl}/messages`, { cache: 'no-store' }),
        fetch(`${apiUrl}/orders`, { cache: 'no-store' }),
      ]);
      if (messagesRes.ok) {
        const messages = await messagesRes.json();
        const unread = Array.isArray(messages) ? messages.filter((m: any) => !m.read).length : 0;
        setUnreadCount(unread);
        setRecentMessages(Array.isArray(messages) ? messages.slice(0, 5) : []);
      }
      if (ordersRes.ok) {
        const orders = await ordersRes.json();
        const pending = Array.isArray(orders) ? orders.filter((o: any) => (o.status || 'pending') === 'pending').length : 0;
        setPendingOrdersCount(pending);
        setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    refreshCounts();
    const id = setInterval(refreshCounts, 30000);
    return () => clearInterval(id);
  }, [refreshCounts]);

  if (!authChecked) {
    return null;
  }

  // Do not render nav/sidebar on the login page
  if (pathname === '/login') {
    return (
      <div className="min-h-screen bg-gray-100">
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md p-1.5">
                <img 
                  src="/logo.jpg" 
                  alt="IBN SINA Logo" 
                  className="h-7 w-auto object-contain"
                />
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">IBN SINA</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.name === 'Logout') {
                    e.preventDefault();
                    try {
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('adminToken');
                      }
                    } catch {}
                    router.replace('/login');
                  }
                  setSidebarOpen(false);
                }}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.name === 'Logout'
                    ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                    : (isActive(item.href)
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md p-1.5">
                <img 
                  src="/logo.jpg" 
                  alt="IBN SINA Logo" 
                  className="h-7 w-auto object-contain"
                />
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">IBN SINA</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.name === 'Logout') {
                    e.preventDefault();
                    try {
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('adminToken');
                      }
                    } catch {}
                    router.replace('/login');
                  }
                }}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.name === 'Logout'
                    ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                    : (isActive(item.href)
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8" onClick={(e) => {
          // close dropdown when clicking elsewhere in top bar (except inside dropdown or bell)
          const target = e.target as HTMLElement;
          if (!bellRef.current) return;
          if (bellRef.current.contains(target)) return;
          setDropdownOpen(false);
        }}>
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-600"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-900 lg:ml-0">
              Admin Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button ref={bellRef} onClick={() => { setDropdownOpen(v => !v); }} className="text-gray-500 hover:text-gray-600 relative" title={`Notifications: ${unreadCount} unread messages, ${pendingOrdersCount} pending orders`}>
                <BellIcon className="h-6 w-6" />
              {unreadCount + pendingOrdersCount > 0 ? (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center">
                  {unreadCount + pendingOrdersCount}
                </span>
              ) : null}
              </button>
              {dropdownOpen ? (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-2 border-b border-gray-100 text-sm font-semibold text-gray-900">Notifications</div>
                  <div className="max-h-96 overflow-auto">
                    <div className="px-4 py-2 text-xs uppercase text-gray-500">Messages</div>
                    {recentMessages.length === 0 ? (
                      <div className="px-4 pb-2 text-sm text-gray-600">No messages</div>
                    ) : recentMessages.map((m) => (
                      <a key={m._id} href="/messages" className="flex items-start gap-3 px-4 py-2 hover:bg-gray-50">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-semibold">MSG</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900 truncate">{m.subject || 'New message'}</div>
                          <div className="text-xs text-gray-600 truncate">{m.name} • {m.email || 'No email'}</div>
                          <div className="text-[11px] text-gray-500">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</div>
                        </div>
                        {!m.read ? (<span className="ml-2 h-2 w-2 bg-green-500 rounded-full" />) : null}
                      </a>
                    ))}
                    <div className="px-4 py-2 text-xs uppercase text-gray-500 border-t border-gray-100">Orders</div>
                    {recentOrders.length === 0 ? (
                      <div className="px-4 pb-2 text-sm text-gray-600">No orders</div>
                    ) : recentOrders.map((o: any) => (
                      <a key={o._id} href="/orders" className="flex items-start gap-3 px-4 py-2 hover:bg-gray-50">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-semibold">ORD</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-900 truncate">Order {o._id}</div>
                          <div className="text-xs text-gray-600 truncate">Status: {o.status || 'pending'} • Total: TND {(Number(o.total)||0).toFixed(3)}</div>
                          <div className="text-[11px] text-gray-500">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</div>
                        </div>
                        {(o.status || 'pending') === 'pending' ? (<span className="ml-2 h-2 w-2 bg-red-500 rounded-full" />) : null}
                      </a>
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
                    <a href="/messages" className="text-xs text-green-700 hover:underline">View all messages</a>
                    <a href="/orders" className="text-xs text-green-700 hover:underline">View all orders</a>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@ibnsina.com</p>
              </div>
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
