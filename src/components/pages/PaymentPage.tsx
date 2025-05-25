import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { CreditCard, Calendar, Lock } from 'lucide-react';
import { createOrder } from '../../services/api';

const PaymentPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }
      
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic validation
    if (!paymentData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) 
      newErrors.cardNumber = 'Card number must be 16 digits';
    
    if (!paymentData.cardName.trim()) newErrors.cardName = 'Name on card is required';
    
    if (!paymentData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) 
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    
    if (!paymentData.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(paymentData.cvv)) 
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      // Create order data
      const orderData = {
        items: state.items,
        totalAmount: state.totalPrice + (state.totalPrice > 100 ? 0 : 5.99) + (state.totalPrice * 0.08),
        paymentMethod: 'Credit Card',
        paymentDetails: {
          // In a real app, you would use a payment gateway and not send card details directly
          // This is just for demonstration
          lastFourDigits: paymentData.cardNumber.slice(-4)
        }
      };
      
      // Send order to API
      const response = await createOrder(orderData);
      
      // Clear cart and redirect to confirmation
      dispatch({ type: 'CLEAR_CART' });
      navigate('/order-confirmation', { 
        state: { 
          orderId: response.id,
          paymentMethod: 'Credit Card'
        } 
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentError('There was an error processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (state.items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Payment</h1>
      
      {paymentError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {paymentError}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Card Details</h2>
              <div className="flex space-x-2">
                <img src="/visa.svg" alt="Visa" className="h-8" />
                <img src="/mastercard.svg" alt="Mastercard" className="h-8" />
                <img src="/amex.svg" alt="American Express" className="h-8" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full pl-10 px-3 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black/20`}
                  />
                </div>
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={paymentData.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-3 py-2 border ${errors.cardName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black/20`}
                />
                {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full pl-10 px-3 py-2 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black/20`}
                    />
                  </div>
                  {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full pl-10 px-3 py-2 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black/20`}
                    />
                  </div>
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>${state.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>${(state.totalPrice > 100 ? 0 : 5.99).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax</span>
                <span>${(state.totalPrice * 0.08).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <span className="font-medium">Total</span>
              <span className="font-bold text-lg">
                ${(
                  state.totalPrice + 
                  (state.totalPrice > 100 ? 0 : 5.99) + 
                  (state.totalPrice * 0.08)
                ).toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="mt-8">
            <Button
              type="submit"
              className="w-full py-3 bg-black hover:bg-gray-800"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </Button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Your payment information is secure. We use encryption to protect your data.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;