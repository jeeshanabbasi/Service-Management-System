import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ServicesList from './pages/ServicesList';
import ServiceDetail from './pages/ServiceDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderRegister from './pages/ProviderRegister';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

// Set up base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/services" element={<PageWrapper><ServicesList /></PageWrapper>} />
        <Route path="/services/:id" element={<PageWrapper><ServiceDetail /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
        <Route path="/provider-dashboard" element={<PageWrapper><ProviderDashboard /></PageWrapper>} />
        <Route path="/partner" element={<PageWrapper><ProviderRegister /></PageWrapper>} />
        <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  // Set auth header on load
  useEffect(() => {
      const user = localStorage.getItem('user');
      if (user) {
          const parsed = JSON.parse(user);
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
      }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 overflow-x-hidden">
            <Navbar />
            <main className="flex-grow pt-24">
              <AnimatedRoutes />
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}


export default App;

