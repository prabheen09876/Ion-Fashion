import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProducts } from '../../services/api';

// Define product data structure
interface Product {
  id: number;
  name: string;
  category: string;
  productType: string;
  price: number;
  imageUrl: string;
  description?: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="overflow-hidden rounded-lg mb-4">
        <div className="relative aspect-[3/4]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-center">
            View Details
          </div>
        </div>
      </div>
      <div className="text-left">
        <span className="text-sm text-gray-500">{product.category} - {product.productType}</span>
        <h3 className="font-medium mb-1">{product.name}</h3>
        <p className="font-semibold">₹{product.price}</p>
      </div>
    </Link>
  );
};

const CategoryProductsPage: React.FC = () => {
  const { category, productType } = useParams<{ category: string; productType: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getProducts(category, productType);
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, productType]);

  const handleCategoryFilter = (cat: string | null) => {
    if (cat === selectedCategory) {
      // If clicking the already selected category, clear the filter
      window.location.href = productType ? `/category/all/${productType}` : '/category/all';
    } else {
      // Apply the new category filter
      window.location.href = productType ? `/category/${cat}/${productType}` : `/category/${cat}`;
    }
  };

  const handleProductTypeFilter = (type: string | null) => {
    if (type === selectedProductType) {
      // If clicking the already selected product type, clear the filter
      window.location.href = category ? `/category/${category}` : '/category/all';
    } else {
      // Apply the new product type filter
      window.location.href = category && category !== 'all' ? `/category/${category}/${type}` : `/category/all/${type}`;
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 px-4 min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded aspect-[3/4] mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-16 px-4 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-gray-600 mb-8 text-center">{error}</p>
        <Link to="/" className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 px-4 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">No Products Found</h2>
        <p className="text-gray-600 mb-8 text-center">
          We couldn't find any products matching your criteria. Please try a different category or check back later.
        </p>
        <Link to="/" className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          {productType || category === 'all' ? 'All Products' : category || 'All Products'}
        </h1>
        <p className="text-gray-600 mb-6">
          {products.length} {products.length === 1 ? 'product' : 'products'} available
        </p>
        
        {/* Filter Section */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div>
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 text-sm rounded-full border ${
                  !selectedCategory ? 'bg-black text-white' : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleCategoryFilter(null)}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    selectedCategory?.toLowerCase() === cat.toLowerCase() 
                      ? 'bg-black text-white' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => handleCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Product Types</h3>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 text-sm rounded-full border ${
                  !selectedProductType ? 'bg-black text-white' : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleProductTypeFilter(null)}
              >
                All
              </button>
              {productTypes.map(type => (
                <button
                  key={type}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    selectedProductType?.toLowerCase() === type.toLowerCase() 
                      ? 'bg-black text-white' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => handleProductTypeFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
