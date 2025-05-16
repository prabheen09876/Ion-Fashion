import React from 'react';
import { Navbar, NavBody, NavItems, NavbarLogo } from './resizable-navbar';
import Footer from './Footer';
// import BackgroundText from '../ui/BackgroundText';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navItems = [
    { name: "Home", link: "#" },
    { name: "Products", link: "#" },
    { name: "About", link: "#" },
    { name: "Contact", link: "#" }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0 pointer-events-none">
        {/* <BackgroundText className="opacity-50" /> */}
      </div>
      <Navbar className="fixed top-0 left-0 right-0">
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
        </NavBody>
      </Navbar>
      <main className="flex-grow relative ">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;