import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryProductsPage from './pages/CategoryProductsPage';

const App: React.FC = () => {
  useLenis();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/category/:category/:productType" element={<CategoryProductsPage />} />
          <Route path="/category/:category" element={<CategoryProductsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;