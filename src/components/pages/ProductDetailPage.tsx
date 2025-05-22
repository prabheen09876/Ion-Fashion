import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { ShoppingBag, Heart } from 'lucide-react';

// Import your product database or API
// import { productDatabase } from '../data/products'; // Adjust this path as needed

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useCart();
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = () => {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        // Find the product by ID
        const foundProduct = productDatabase.find(p => p.id === parseInt(productId || '0'));
        setProduct(foundProduct);
        setIsLoading(false);
      }, 500);
    };
    
    fetchProduct();
  }, [productId]);
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: quantity
        }
      });
      
      // Optional: Show a confirmation message
      alert('Product added to cart!');
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-md bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="py-16 px-4 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8 text-center">
          We couldn't find the product you're looking for.
        </p>
        <Link to="/category/all" className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold mb-6">₹{product.price.toFixed(2)}</p>
          
          <div className="mb-6">
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 border-t border-b border-gray-300 text-center w-12">
                {quantity}
              </span>
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              variant="primary" 
              size="lg" 
              className="flex-1"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            <Button variant="outline" size="lg" className="px-4">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-2">Product Details</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>Category: {product.category}</li>
              <li>Type: {product.productType}</li>
              {/* Add more details as needed */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
