import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { CheckCircle, Package, Truck, Calendar } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const { orderId, paymentMethod } = location.state || {};
  
  // If no order data is present, redirect to home
  if (!orderId) {
    return <Navigate to="/" />;
  }
  
  // Generate a random delivery date (7-10 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 4) + 7);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-medium">Order #{orderId}</h2>
            <p className="text-gray-500 text-sm">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium">
            Processing
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full mr-4">
              <Package className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium">Payment Method</h3>
              <p className="text-gray-600">{paymentMethod}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full mr-4">
              <Truck className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium">Shipping Information</h3>
              <p className="text-gray-600">Standard Shipping</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium">Estimated Delivery</h3>
              <p className="text-gray-600">{formattedDeliveryDate}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">What's Next?</h2>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-black text-white rounded-full text-sm mr-3 flex-shrink-0">1</span>
            <span>You'll receive an order confirmation email with details of your purchase.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-black text-white rounded-full text-sm mr-3 flex-shrink-0">2</span>
            <span>Once your order ships, we'll send you tracking information.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-black text-white rounded-full text-sm mr-3 flex-shrink-0">3</span>
            <span>Prepare to enjoy your new items!</span>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link to="/" className="flex-1">
          <Button variant="primary" className="w-full">
            Continue Shopping
          </Button>
        </Link>
        <Link to="/account/orders" className="flex-1">
          <Button variant="outline" className="w-full">
            View All Orders
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;