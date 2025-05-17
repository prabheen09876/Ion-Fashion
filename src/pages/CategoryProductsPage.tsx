import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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

// Mock product database - in a real app, this would come from an API
const productDatabase: Product[] = [
  // Men's T-shirts
  {
    id: 101,
    name: 'Basic Signature T-shirt',
    category: 'Men',
    productType: 'T-shirts',
    price: 75,
    imageUrl: 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Our signature t-shirt is crafted from premium cotton for exceptional softness and durability, with a modern cut that flatters your frame.'
  },
  {
    id: 102,
    name: 'Organic Cotton Pocket Tee',
    category: 'Men',
    productType: 'T-shirts',
    price: 85,
    imageUrl: 'https://images.pexels.com/photos/2834009/pexels-photo-2834009.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'This organic cotton tee features a convenient chest pocket and a relaxed fit for everyday style and comfort.'
  },
  {
    id: 103,
    name: 'Slim Fit Crew Neck',
    category: 'Men',
    productType: 'T-shirts',
    price: 65,
    imageUrl: 'https://images.pexels.com/photos/3785983/pexels-photo-3785983.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Our slim fit crew neck t-shirt offers a modern silhouette with just the right amount of stretch for comfortable movement.'
  },
  {
    id: 104,
    name: 'Vintage Wash Graphic Tee',
    category: 'Men',
    productType: 'T-shirts',
    price: 95,
    imageUrl: 'https://images.pexels.com/photos/5082238/pexels-photo-5082238.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'This graphic tee features a vintage wash treatment for that perfectly broken-in look and feel from day one.'
  },
  
  // Men's Hoodies
  {
    id: 201,
    name: 'Classic Cotton Hoodie',
    category: 'Men',
    productType: 'Hoodies',
    price: 120,
    imageUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Our signature cotton hoodie offers both comfort and style for everyday wear. Made from premium cotton with a soft brushed interior for extra warmth.'
  },
  {
    id: 202,
    name: 'Urban Zip-Up Hoodie',
    category: 'Men',
    productType: 'Hoodies',
    price: 135,
    imageUrl: 'https://images.pexels.com/photos/307008/pexels-photo-307008.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'This versatile zip-up hoodie features a modern cut with subtle design details, perfect for layering in any season.'
  },
  
  // Women's Dresses
  {
    id: 301,
    name: 'Floral Summer Dress',
    category: 'Women',
    productType: 'Dresses',
    price: 145,
    imageUrl: 'https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'This lightweight summer dress features a stunning floral print, perfect for warm weather occasions.'
  },
  {
    id: 302,
    name: 'Elegant Evening Gown',
    category: 'Women',
    productType: 'Dresses',
    price: 250,
    imageUrl: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Make a statement with this elegant evening gown featuring sophisticated detailing and a flattering silhouette.'
  },
  {
    id: 303,
    name: 'Casual Maxi Dress',
    category: 'Women',
    productType: 'Dresses',
    price: 120,
    imageUrl: 'https://images.pexels.com/photos/6570456/pexels-photo-6570456.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'This versatile maxi dress transitions effortlessly from day to night with its classic cut and comfortable fabric.'
  },
  
  // Women's Leggings
  {
    id: 401,
    name: 'Slim Fit Leggings',
    category: 'Women',
    productType: 'Leggings',
    price: 90,
    imageUrl: 'https://images.pexels.com/photos/7998296/pexels-photo-7998296.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'These modern slim fit leggings feature a high waist and subtle contouring to flatter your silhouette while providing all-day comfort.'
  },
  {
    id: 402,
    name: 'Textured Yoga Leggings',
    category: 'Women',
    productType: 'Leggings',
    price: 105,
    imageUrl: 'https://images.pexels.com/photos/6311271/pexels-photo-6311271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Our textured yoga leggings provide both style and performance with moisture-wicking fabric and a supportive fit.'
  }
];

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, this would be an API call with proper filtering
    const fetchProducts = () => {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        let filteredProducts = [...productDatabase];
        
        if (category) {
          filteredProducts = filteredProducts.filter(p => 
            p.category.toLowerCase() === category.toLowerCase()
          );
        }
        
        if (productType) {
          filteredProducts = filteredProducts.filter(p => 
            p.productType.toLowerCase() === productType.toLowerCase()
          );
        }
        
        setProducts(filteredProducts);
        setIsLoading(false);
      }, 500);
    };

    fetchProducts();
  }, [category, productType]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg aspect-[3/4]"></div>
          ))}
        </div>
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
          {productType || category || 'All Products'}
        </h1>
        <p className="text-gray-600">
          {products.length} {products.length === 1 ? 'product' : 'products'} available
        </p>
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
