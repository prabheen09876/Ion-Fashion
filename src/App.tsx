import React from 'react';
import { useLenis } from './hooks/useLenis';
import Layout from './components/layout/Layout';
import Hero from './components/home/Hero';
import ProductHighlights from './components/home/ProductHighlights';
import FeaturedCollection from './components/home/FeaturedCollection';


const App: React.FC = () => {
  useLenis();

  return (
    <Layout>
      <Hero />
      <ProductHighlights />
      <FeaturedCollection />
     
    </Layout>
    
  );
};

export default App;