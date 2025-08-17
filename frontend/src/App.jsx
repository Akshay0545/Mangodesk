import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ToastProvider from './components/Toast';
import './index.css';

export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex-1">
          <Home />
        </div>
        <Footer />
      </div>
    </ToastProvider>
  );
}
