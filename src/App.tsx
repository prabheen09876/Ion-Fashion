import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './components/pages/HomePage';
import ProductDetailPage from './components/pages/ProductDetailPage';
import CategoryProductsPage from './components/pages/CategoryProductsPage';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import PaymentPage from './components/pages/PaymentPage';
import OrderConfirmationPage from './components/pages/OrderConfirmationPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import AuthTest from './components/debug/AuthTest';
import Dashboard from './components/pages/admin/Dashboard';
import ProductList from './components/pages/admin/ProductList';
import ProductForm from './components/pages/admin/ProductForm';
import OrderList from './components/pages/admin/OrderList';
import CustomerList from './components/pages/admin/CustomerList';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { SetupAdmin } from './components/SetupAdmin';

const App: React.FC = () => {
  useLenis();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add a timeout to detect if the app is stuck in loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('Application still loading after 10 seconds, might be stuck');
        setAuthError('Loading timeout - please refresh the page');
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Handle when the app is done loading
  const handleAuthReady = () => {
    setIsLoading(false);
  };

  return (
    <>
      {authError && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center z-50">
          {authError} - <button onClick={() => window.location.reload()} className="underline">Refresh</button>
        </div>
      )}
      
      <AuthProvider onReady={handleAuthReady}>
        {/* Only render SetupAdmin in development */}
        {import.meta.env.DEV && <SetupAdmin />}
        
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Admin Routes - Protected with admin access required */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin={true} />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/add" element={<ProductForm />} />
                  <Route path="products/edit/:productId" element={<ProductForm />} />
                  <Route path="orders" element={<OrderList />} />
                  <Route path="orders/:id" element={<div>Order Detail</div>} />
                  <Route path="customers" element={<CustomerList />} />
                  <Route path="customers/:id" element={<div>Customer Detail</div>} />
                </Route>
              </Route>
              
              {/* Customer Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="product/:productId" element={<ProductDetailPage />} />
                <Route path="category/:category/:productType" element={<CategoryProductsPage />} />
                <Route path="category/:category" element={<CategoryProductsPage />} />
                {/* Protected customer routes - require authentication */}
                <Route element={<ProtectedRoute />}>
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="payment" element={<PaymentPage />} />
                  <Route path="order-confirmation" element={<OrderConfirmationPage />} />
                </Route>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                {/* Debug route - remove in production */}
                <Route path="debug/auth" element={<AuthTest />} />
                <Route path="*" element={<div>Not Found</div>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  );
};

export default App;