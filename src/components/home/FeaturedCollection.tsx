import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getFeaturedProducts, Product } from '../../services/productService';

const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, index * 100);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.disconnect();
      }
    };
  }, [index]);

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div
        ref={cardRef}
        className={`group transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
      >

        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            View Details
          </div>
        </div>
        <div className="text-left">
          <span className="text-sm text-gray-500">{product.category}</span>
          <h3 className="font-medium mb-1">{product.name}</h3>
          <p className="font-semibold">₹{product.price}</p>
        </div>
      </div>
    </Link>
  );
};

const FeaturedCollection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getFeaturedProducts();
        // Take first 6 featured products
        setProducts(data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">TRENDING NOW</h2>
            <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
              The latest fashion must-haves and bestsellers from our collections
            </p>
          </div>
          <div className="hidden md:flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={scrollLeft}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-6 sm:pb-8 hide-scrollbar snap-x"
        >
          {products.map((product, index) => (
            <div key={product.id} className="min-w-[240px] sm:min-w-[280px] snap-start">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Link to="/products">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;