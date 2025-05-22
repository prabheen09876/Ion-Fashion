import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  
  // Calculate shipping cost
  const shippingCost = state.totalAmount > 100 ? 0 : 5.99;
  
  // Calculate tax (assuming 8%)
  const taxAmount = state.totalAmount * 0.08;
  
  // Calculate order total
  const orderTotal = state.totalAmount + shippingCost + taxAmount;
  
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
    }
  };
  
  const handleRemoveItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  if (state.items.length === 0) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/">
            <Button className="px-6 py-2">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {state.items.map(item => (
                <li key={item.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 flex-shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 sm:ml-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              type="button"
                              className="p-2 text-gray-600 hover:text-gray-900"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 text-center w-12">{item.quantity}</span>
                            <button
                              type="button"
                              className="p-2 text-gray-600 hover:text-gray-900"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <button
                              type="button"
                              className="text-sm text-red-600 hover:text-red-800 flex items-center"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-4 flex justify-between">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="text-sm font-medium text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Link to="/">
              <Button variant="outline" className="px-4 py-2">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({state.totalItems} items)</span>
                <span>₹{state.totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-4 flex justify-between font-medium">
                <span>Total</span>
                <span>₹{orderTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                className="w-full py-3"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>Shipping is free for orders over ₹100.</p>
              <p className="mt-2">Taxes calculated at checkout.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;