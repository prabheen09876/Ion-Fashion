import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  className?: string;
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ className = '', children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full fixed top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav 
        className={`w-full transition-all duration-300 rounded-full border border-gray-200/50 ${
          isScrolled 
            ? 'py-3 bg-white/15 backdrop-blur-lg shadow-md' 
            : 'py-4 bg-white/60 backdrop-blur-lg'
        } ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold tracking-tighter">ION</Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/category/men" className="text-sm font-medium hover:text-black/70 transition-colors">Men</Link>
              <Link to="/category/women" className="text-sm font-medium hover:text-black/70 transition-colors">Women</Link>
              <Link to="/#categories" className="text-sm font-medium hover:text-black/70 transition-colors">Categories</Link>
              <Link to="/category/all" className="text-sm font-medium hover:text-black/70 transition-colors">New Arrivals</Link>
            </div>

            {/* Search, Cart, and Login - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="py-2 pl-10 pr-4 w-48 lg:w-64 rounded-full text-sm bg-gray-100/80 focus:bg-white border border-gray-200/50 focus:border-gray-300 focus:outline-none transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative border border-gray-200/50 hover:border-gray-300/70">
                <User size={20} />
              </button>
              
              <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative border border-gray-200/50 hover:border-gray-300/70 inline-flex items-center justify-center">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                  {state?.items?.length || 0}
                </span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative border border-gray-200/50">
                <Search size={20} />
              </button>
              
              <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 transition-colors relative border border-gray-200/50 inline-flex items-center justify-center">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                  {state?.items?.length || 0}
                </span>
              </Link>
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-200/50"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-lg shadow-lg rounded-b-2xl overflow-hidden border border-gray-200/50 mt-1 mx-2">
            <div className="px-4 py-6 space-y-6">
              <div className="space-y-4">
                <Link to="/category/men" className="block text-lg font-medium">Men</Link>
                <Link to="/category/women" className="block text-lg font-medium">Women</Link>
                <Link to="/#categories" className="block text-lg font-medium">Categories</Link>
                <Link to="/category/all" className="block text-lg font-medium">New Arrivals</Link>
              </div>
              
              <div className="pt-4 border-t border-gray-200/50">
                <div className="relative mb-4">
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="py-3 pl-10 pr-4 w-full rounded-xl text-sm bg-gray-100/80 focus:bg-white border border-gray-200/50 focus:border-gray-300 focus:outline-none transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                
                <Button variant="primary" size="md" className="w-full mb-2 rounded-xl border border-transparent hover:border-gray-800/10">
                  <User size={16} className="mr-2" />
                  Login / Register
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;