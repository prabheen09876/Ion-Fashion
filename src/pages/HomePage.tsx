import React from 'react';
import Hero from '../components/home/Hero';
import ProductHighlights from '../components/home/ProductHighlights';
import FeaturedCollection from '../components/home/FeaturedCollection';
import CategorySection from '../components/home/CategorySection';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedCollection />
      <ProductHighlights />
    </>
  );
};

export default HomePage;
