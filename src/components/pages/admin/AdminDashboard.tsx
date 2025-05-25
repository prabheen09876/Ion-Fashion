import React from 'react';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ 
  title, value, icon, color 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Products" 
          value="124" 
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard 
          title="Total Orders" 
          value="56" 
          icon={<ShoppingCart className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard 
          title="Total Users" 
          value="2,345" 
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard 
          title="Revenue" 
          value="₹45,678" 
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">#ORD-123456</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">John Doe</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">₹1,234</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Delivered</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">#ORD-123455</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">Jane Smith</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">₹2,345</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Processing</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">#ORD-123454</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">Robert Johnson</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">₹3,456</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Shipped</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Popular Products</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                <img src="https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg" alt="Product" className="w-full h-full object-cover" />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-sm font-medium">Classic Cotton Hoodie</h3>
                <p className="text-xs text-gray-500">120 sales</p>
              </div>
              <div className="text-sm font-semibold">₹120</div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                <img src="https://images.pexels.com/photos/7998296/pexels-photo-7998296.jpeg" alt="Product" className="w-full h-full object-cover" />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-sm font-medium">Slim Fit Leggings</h3>
                <p className="text-xs text-gray-500">98 sales</p>
              </div>
              <div className="text-sm font-semibold">₹90</div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                <img src="https://images.pexels.com/photos/1589818/pexels-photo-1589818.jpeg" alt="Product" className="w-full h-full object-cover" />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-sm font-medium">Designer Vest</h3>
                <p className="text-xs text-gray-500">76 sales</p>
              </div>
              <div className="text-sm font-semibold">₹150</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;