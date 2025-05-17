import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';

// Define the Product interface
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description?: string;
  features?: string[];
  sizes?: string[];
  colors?: string[];
}

// Mock product database - in a real app, this would come from an API
const productDatabase: Product[] = [
  {
    id: 1,
    name: 'Classic Cotton Hoodie',
    category: 'Men',
    price: 120,
    imageUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Our signature cotton hoodie offers both comfort and style for everyday wear. Made from premium cotton with a soft brushed interior for extra warmth.',
    features: ['100% Premium Cotton', 'Adjustable hood with drawstrings', 'Kangaroo pocket', 'Ribbed cuffs and hem'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Gray', 'Olive']
  },
  {
    id: 2,
    name: 'Slim Fit Leggings',
    category: 'Women',
    price: 90,
    imageUrl: 'https://images.pexels.com/photos/7998296/pexels-photo-7998296.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'These modern slim fit leggings feature a high waist and subtle contouring to flatter your silhouette while providing all-day comfort.',
    features: ['High-rise waistband', 'Four-way stretch fabric', 'Moisture-wicking technology', 'Hidden waistband pocket'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy', 'Burgundy']
  },
  {
    id: 3,
    name: 'Designer Vest',
    category: 'Men',
    price: 150,
    imageUrl: 'https://images.pexels.com/photos/1589818/pexels-photo-1589818.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'A versatile layering piece crafted from premium materials. This designer vest adds sophistication to any outfit while providing just the right amount of warmth.',
    features: ['Premium quilted design', 'Lightweight insulation', 'Brushed metal hardware', 'Interior pockets'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Olive', 'Burgundy']
  },
  {
    id: 4,
    name: 'Modern Track Jacket',
    category: 'Women',
    price: 135,
    imageUrl: 'https://images.pexels.com/photos/4380970/pexels-photo-4380970.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Our modern track jacket combines classic athletic styling with contemporary design elements for a versatile piece that works for both active and casual wear.',
    features: ['Breathable fabric blend', 'Full zip front', 'Ribbed collar and cuffs', 'Side pockets with hidden zippers'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black/White', 'Navy/Red', 'Gray/Black']
  },
  {
    id: 5,
    name: 'Elegant Leather Gloves',
    category: 'Accessories',
    price: 45,
    imageUrl: 'https://images.pexels.com/photos/46239/pexels-photo-46239.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Crafted from premium leather, these elegant gloves offer both style and practicality for cooler weather, with a soft lining for additional comfort.',
    features: ['Genuine premium leather', 'Soft interior lining', 'Classic design', 'Touch-screen compatible fingertips'],
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Brown', 'Tan']
  },
  {
    id: 6,
    name: 'Basic Signature T-shirt',
    category: 'Men',
    price: 75,
    imageUrl: 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    description: 'Our signature t-shirt is crafted from premium cotton for exceptional softness and durability, with a modern cut that flatters your frame.',
    features: ['Premium cotton fabric', 'Reinforced stitching', 'Pre-shrunk', 'Tagless collar for comfort'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Gray', 'Navy', 'Olive']
  }
];

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = () => {
      setIsLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const foundProduct = productDatabase.find(p => p.id === Number(productId));
        setProduct(foundProduct || null);
        
        // Set default selections if product found
        if (foundProduct) {
          setSelectedSize(foundProduct.sizes?.[0] || '');
          setSelectedColor(foundProduct.colors?.[0] || '');
        }
        
        setIsLoading(false);
      }, 500);
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-lg bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or may have been removed.</p>
        <Button variant="primary" size="lg" onClick={() => window.location.href='/'}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div className="mb-8 lg:mb-0">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <div className="mb-6">
            <span className="text-sm text-gray-500">{product.category}</span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1 mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold">₹{product.price}</p>
          </div>
          
          <div className="mb-8">
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md text-sm ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`px-4 py-2 border rounded-md text-sm ${
                      selectedColor === color 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity */}
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex border border-gray-300 rounded-md w-36">
              <button 
                className="w-10 h-10 flex items-center justify-center border-r border-gray-300"
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                -
              </button>
              <div className="flex-1 h-10 flex items-center justify-center">
                {quantity}
              </div>
              <button 
                className="w-10 h-10 flex items-center justify-center border-l border-gray-300"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div className="mb-8">
            <Button variant="primary" size="lg" className="w-full md:w-auto">
              Add to Cart
            </Button>
          </div>
          
          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">Features</h3>
              <ul className="list-disc pl-5 space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-600">{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
