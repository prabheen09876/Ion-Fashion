import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import BackgroundText from '../ui/BackgroundText';
import { ThreeDCardDemo } from '../ui/CardEffect';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center bg-tech-gray overflow-hidden">
    <BackgroundText />

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 transition-all duration-1000 transform ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="max-w-2xl py-8 lg:py-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tighter mb-4 sm:mb-6 sm:mt-[10vh]">
              <span className="glitch-text" data-text="GEAR UP">GEAR UP</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                EVERY WORKOUT!
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 font-light tracking-wide">
              Stay cozy without compromising your range of motion. 
              Our winter range is perfect for those chilly outdoor workouts.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wider">
                SHOP NOW
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wider">
                EXPLORE ALL
              </Button>
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-300 transform ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <ThreeDCardDemo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;