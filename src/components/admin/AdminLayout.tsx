import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutGrid, Package, Users, Settings, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">ION Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin/dashboard" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin/dashboard') ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                <LayoutGrid className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/products" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin/products') ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                <Package className="mr-3 h-5 w-5" />
                Products
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/users" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin/users') ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                <Users className="mr-3 h-5 w-5" />
                Users
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/settings" 
                className={`flex items-center p-2 rounded-md ${isActive('/admin/settings') ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </li>
            <li className="pt-6">
              <Link 
                to="/" 
                className="flex items-center p-2 text-red-500 hover:bg-red-50 rounded-md"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Exit Admin
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Admin User</span>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;