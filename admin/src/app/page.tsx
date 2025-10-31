import { 
  ShoppingBagIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const stats = [
    {
      name: 'Total Revenue',
      value: '$45,231',
      change: '+12.5%',
      changeType: 'increase',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      changeType: 'increase',
      icon: ShoppingBagIcon,
    },
    {
      name: 'Total Customers',
      value: '2,456',
      change: '+15.3%',
      changeType: 'increase',
      icon: UsersIcon,
    },
    {
      name: 'Conversion Rate',
      value: '3.2%',
      change: '-2.1%',
      changeType: 'decrease',
      icon: ChartBarIcon,
    },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Ahmed Hassan', amount: '$89.99', status: 'Completed', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Fatima Al-Zahra', amount: '$124.50', status: 'Processing', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Mohammed Ali', amount: '$67.25', status: 'Pending', date: '2024-01-14' },
    { id: 'ORD-004', customer: 'Sarah Ahmed', amount: '$156.75', status: 'Shipped', date: '2024-01-14' },
    { id: 'ORD-005', customer: 'Omar Khalil', amount: '$98.00', status: 'Completed', date: '2024-01-13' },
  ];

  const topProducts = [
    { name: 'Premium Turmeric Root', sales: 45, revenue: '$1,125' },
    { name: 'Lavender Essential Oil', sales: 38, revenue: '$1,254' },
    { name: 'Organic Ginger Powder', sales: 32, revenue: '$608' },
    { name: 'Eucalyptus Leaves', sales: 28, revenue: '$448' },
    { name: 'Chamomile Tea Blend', sales: 25, revenue: '$325' },
  ];

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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
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

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </div>
    </div>
  );
}
