import React from 'react';
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
import Dashboard from './components/pages/admin/Dashboard';
import ProductList from './components/pages/admin/ProductList';
import ProductForm from './components/pages/admin/ProductForm';
import OrderList from './components/pages/admin/OrderList';
import CustomerList from './components/pages/admin/CustomerList';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  useLenis();

  return (
    <AuthProvider>
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
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;