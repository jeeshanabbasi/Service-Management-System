import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Menu, X, LogOut, Search, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/services?q=${searchQuery}`);
            setIsMenuOpen(false);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center ${
            scrolled ? 'bg-[#151515] border-b border-white/5 shadow-xl' : 'bg-[#151515]'
        }`}>
            <div className={`w-full max-w-[1600px] px-6 py-4 flex justify-between items-center gap-8`}>
                {/* Left: Hamburger & Logo */}
                <div className="flex items-center gap-6 shrink-0">
                    <button 
                        className="text-amber-500 hover:text-amber-400 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : (
                            <div className="flex flex-col gap-1.5 w-6">
                                <span className="w-full h-0.5 bg-amber-500 rounded-full"></span>
                                <span className="w-4 h-0.5 bg-amber-500 rounded-full"></span>
                                <span className="w-full h-0.5 bg-amber-500 rounded-full"></span>
                            </div>
                        )}
                    </button>
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center border border-[#f3a953]/50 overflow-hidden shadow-sm">
                            <img src="/logo.png" alt="Servicio Logo" className="w-full h-full object-cover scale-110" />
                        </div>
                        <span className="text-2xl font-bold tracking-wide text-amber-500 hidden sm:block">
                            Servicio
                        </span>
                    </Link>
                </div>

                {/* Center: Global Search Bar */}
                <div className="hidden md:flex flex-grow max-w-2xl">
                    <div className="relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search for high-performance services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full bg-[#1c1c1c] border border-white/5 hover:border-white/10 focus:border-amber-500/50 text-white placeholder:text-slate-500 text-sm rounded-full pl-11 pr-4 py-2.5 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Right: Links & Profile */}
                <div className="hidden md:flex items-center gap-8 shrink-0">
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors ${
                                    location.pathname === link.path ? 'text-amber-500' : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/checkout" className="relative p-2 text-slate-300 hover:text-amber-500 transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                            {cart?.length > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-slate-900 text-[10px] font-black rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-4">
                                {user?.role === 'admin' && (
                                    <Link to="/admin" className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-amber-500 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center shadow-lg shadow-amber-500/10">
                                        Admin
                                    </Link>
                                )}
                                {user?.role === 'provider' && (
                                    <Link to="/provider-dashboard" className="text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors uppercase tracking-widest">
                                        Provider
                                    </Link>
                                )}
                                
                                <Link to="/dashboard" className="group relative">
                                    <div className="w-9 h-9 rounded-full border border-slate-700 bg-slate-800 overflow-hidden flex items-center justify-center hover:border-amber-500 transition-colors">
                                        <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1a1a1a&color=f59e0b`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-[#151515] shadow-2xl z-[50] p-8 md:hidden flex flex-col border-r border-white/5"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center border border-[#f3a953]/50 overflow-hidden">
                                        <img src="/logo.png" alt="Servicio Logo" className="w-full h-full object-cover scale-110" />
                                    </div>
                                    <span className="text-xl font-bold tracking-wide text-amber-500">
                                        Servicio
                                    </span>
                                </div>
                                <button 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="relative w-full mb-8">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="text" 
                                    placeholder="Search services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="w-full bg-[#1c1c1c] border border-white/5 text-white placeholder:text-slate-500 text-sm rounded-full pl-11 pr-4 py-2.5 outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`text-lg font-medium ${
                                            location.pathname === link.path ? 'text-amber-500' : 'text-slate-300 hover:text-white'
                                        } transition-colors`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                
                                <hr className="border-white/10 my-4" />
                                
                                <Link 
                                    to="/checkout"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 text-slate-300 hover:text-amber-500 text-lg font-medium transition-colors"
                                >
                                    <ShoppingBag className="w-5 h-5" /> 
                                    Cart {cart?.length > 0 && <span className="bg-amber-500 text-slate-900 text-xs font-black px-2 py-0.5 rounded-full">{cart.length}</span>}
                                </Link>
                                
                                {user ? (
                                    <div className="space-y-6">
                                        <Link 
                                            to="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block w-full text-slate-300 hover:text-amber-500 text-lg font-medium transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-lg font-medium transition-colors"
                                        >
                                            <LogOut className="w-5 h-5" /> Logout
                                        </button>
                                    </div>
                                ) : (
                                    <Link 
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-slate-300 hover:text-amber-500 text-lg font-medium transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

