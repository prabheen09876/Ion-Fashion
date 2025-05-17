import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
// import BackgroundText from '../ui/BackgroundText';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0 pointer-events-none">
        {/* <BackgroundText className="opacity-50" /> */}
      </div>
      <Navbar />
      <main className="flex-grow relative sm:pt-0 pt-[10vh]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;