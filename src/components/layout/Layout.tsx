import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import AdminNav from '../ui/AdminNav';
// import AuthDebug from '../ui/AuthDebug';
// import BackgroundText from '../ui/BackgroundText';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0 pointer-events-none">
        {/* <BackgroundText className="opacity-50" /> */}
      </div>
      <Navbar />
      <main className="flex-grow relative pt-20 sm:pt-16">
        <Outlet />
      </main>
      <Footer />
      <AdminNav />
      {/* <AuthDebug /> */}
    </div>
  );
};

export default Layout;
