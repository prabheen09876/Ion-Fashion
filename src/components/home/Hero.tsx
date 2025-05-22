import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import BackgroundText from '../ui/BackgroundText';
import { ThreeDCardDemo } from '../ui/CardEffect';
import { SimpleCarousel } from './Carousel';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const slides = [
    {
      title: "Men's Collection",
      button: "Shop Now",
      src: "https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      title: "Seasonal Trends",
      button: "Explore",
      src: "https://images.pexels.com/photos/848573/pexels-photo-848573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      title: "Women's Essentials",
      button: "View Collection",
      src: "https://images.pexels.com/photos/1308885/pexels-photo-1308885.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Use lg breakpoint (1024px)
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative min-h-[80vh] sm:min-h-screen flex items-center bg-tech-gray overflow-hidden">
      <BackgroundText />

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 transition-all duration-1000 transform ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 items-center">
          <div className="max-w-2xl py-4 sm:py-8 lg:py-0 order-2 lg:order-1">
            <h1 className="text-3xl sm:text-6xl md:text-6xl lg:text-7xl font-bold leading-tight sm:leading-none tracking-tighter mb-3 sm:mb-6">
              <span className="glitch-text" data-text="ELEVATE">ELEVATE</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                YOUR STYLE
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-8 font-light tracking-wide">
              Discover fashion that speaks to your unique personality.
              Our curated collections bring the latest trends to your everyday wardrobe.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-4 sm:px-8 py-2 sm:py-4 text-xs sm:text-sm tracking-wider">
                SHOP NOW
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-4 sm:px-8 py-2 sm:py-4 text-xs sm:text-sm tracking-wider">
                EXPLORE ALL
              </Button>
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-300 transform order-1 lg:order-2 mx-auto w-full ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="relative w-full">
              {isMobile ? (
                <SimpleCarousel slides={slides} />
              ) : (
                <ThreeDCardDemo />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;