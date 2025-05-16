import React, { useEffect, useRef, useState } from 'react';
import { SimpleCarousel } from './Carousel';

interface HighlightCardProps {
  title: string;
  description: string;
  imageUrl: string;
  index: number;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ title, description, imageUrl, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, index * 150); // Staggered delay based on index
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.disconnect();
      }
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`group rounded-2xl overflow-hidden transition-all duration-700 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-200 mb-4">{description}</p>
          <a
            href="#"
            className="inline-block text-white font-medium border-b border-white pb-1 transition-all duration-300 hover:border-opacity-0"
          >
            Shop Collection
          </a>
        </div>
      </div>
    </div>
  );
};

const ProductHighlights: React.FC = () => {
  // Create slide data for the carousel based on the previous product highlights
  const slides = [
    {
      title: "Men's Performance",
      button: "Shop Now",
      src: "https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      title: "Winter Collection",
      button: "Explore",
      src: "https://images.pexels.com/photos/848573/pexels-photo-848573.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      title: "Women's Tech Series",
      button: "View Collection",
      src: "https://images.pexels.com/photos/1308885/pexels-photo-1308885.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">PERFORMANCE REDEFINED</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Engineered fabrics, cutting-edge designs, and unmatched durability for your toughest workouts
          </p>
        </div>

        <SimpleCarousel slides={slides} />
      </div>
    </section>
  );
};

export default ProductHighlights;