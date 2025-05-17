import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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

  // Using a numeric productId for linking to product detail pages
  // This would normally be derived from real data or props
  const productId = index + 1;

  return (
    <Link to={`/product/${productId}`} className="block">
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
            <span
              className="inline-block text-white font-medium border-b border-white pb-1 transition-all duration-300 hover:border-opacity-0"
            >
              View Collection
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProductHighlights: React.FC = () => {
  // Create slide data for the carousel based on the previous product highlights
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

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">STYLE FOR EVERYONE</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Curated collections for every occasion, from everyday essentials to statement pieces that define your unique style
          </p>
        </div>

        <div className="hidden md:block">
          <SimpleCarousel slides={slides} />
        </div>
      </div>
    </section>
  );
};

export default ProductHighlights;