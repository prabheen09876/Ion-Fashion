import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black text-gray-300 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 sm:-top-20 -left-10 sm:-left-0 text-[40vw] sm:text-[20vw] font-extrabold text-white/[0.9] tracking-tighter leading-none">
          ION
        </div>
        <div className="absolute bottom-10 sm:bottom-20 -right-10 sm:-right-10 text-[30vw] sm:text-[15vw] font-extrabold text-white/[0.9] tracking-tighter leading-none">
          GEAR
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tighter">ION</h2>
            <p className="mb-8 text-gray-400 leading-relaxed max-w-md">
              Performance-driven apparel engineered for the modern athlete. 
              Designed for those who push boundaries in every workout.
            </p>
            <div className="flex space-x-5">
              <SocialIcon icon={<Facebook size={20} />} />
              <SocialIcon icon={<Instagram size={20} />} />
              <SocialIcon icon={<Twitter size={20} />} />
              <SocialIcon icon={<Youtube size={20} />} />
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wider">SHOP</h3>
            <FooterLinks 
              links={[
                { label: 'Men', href: '#' },
                { label: 'Women', href: '#' },
                { label: 'Accessories', href: '#' },
                { label: 'New Arrivals', href: '#' }
              ]} 
            />
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wider">COMPANY</h3>
            <FooterLinks 
              links={[
                { label: 'About Us', href: '#' },
                { label: 'Sustainability', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Press', href: '#' }
              ]} 
            />
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wider">HELP</h3>
            <FooterLinks 
              links={[
                { label: 'Contact Us', href: '#' },
                { label: 'Shipping & Returns', href: '#' },
                { label: 'FAQs', href: '#' },
                { label: 'Size Guide', href: '#' }
              ]} 
            />
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} ION. All rights reserved.</p>
          <div className="flex flex-wrap gap-8 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialIconProps {
  icon: React.ReactNode;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon }) => {
  return (
    <a 
      href="#" 
      className="h-12 w-12 rounded-full bg-gray-800/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110"
    >
      {icon}
    </a>
  );
};

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinksProps {
  links: FooterLink[];
}

const FooterLinks: React.FC<FooterLinksProps> = ({ links }) => {
  return (
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.href} className="hover:text-white transition">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Footer;