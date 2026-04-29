import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Menu, X, LogOut, User, Search, Sparkles, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/services?q=${searchQuery}`);
            setSearchQuery('');
            setIsMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4`}>
            <div className={`w-full px-4 md:px-8 transition-all duration-500 ${
                scrolled ? 'translate-y-0' : 'translate-y-2'
            }`}>
                <div className={`bg-white/80 backdrop-blur-xl border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[2rem] px-8 py-4 flex justify-between items-center transition-all duration-500 ${
                    scrolled ? 'shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] border-stone-200' : 'shadow-none'
                }`}>
                    {/* Logo */}
                    <Link to="/" className="group flex items-center gap-3 shrink-0">
                        <div className="w-11 h-11 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:rotate-12 transition-all duration-500">
                            <Sparkles className="text-slate-900 w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-900">
                            Servicio<span className="text-amber-500">.</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 flex-grow justify-end">
                        {/* Search Bar */}
                        <div className="relative group max-w-xs w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors text-slate-500 group-focus-within:text-amber-400" />
                            <input 
                                type="text" 
                                placeholder="Find a service..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-full pl-11 pr-4 py-3 rounded-full text-sm font-bold transition-all outline-none border border-stone-200 bg-white focus:bg-[#20202e] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/10 text-slate-900 placeholder:text-slate-500"
                            />
                        </div>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-8 px-8 border-r border-stone-200">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-5 py-2 rounded-[1rem] text-sm font-black transition-all ${
                                        location.pathname === link.path ? 'bg-amber-600 text-slate-900 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)]' : 'bg-transparent text-slate-700 hover:bg-white hover:text-slate-900'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-4">
                            {/* Cart Icon */}
                            <Link to="/cart" className="relative p-2 text-slate-700 hover:text-amber-400 transition-colors">
                                <ShoppingBag className="w-6 h-6" />
                                {cart?.length > 0 && (
                                    <span className="absolute top-0 right-0 w-5 h-5 bg-amber-500 text-slate-900 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-[#0f0f13]">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-[1rem] border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-600 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest">
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link to="/dashboard" className="flex items-center gap-3 px-5 py-2.5 rounded-[1rem] border border-stone-200 bg-white hover:border-amber-500/50 hover:text-amber-400 transition-all group shadow-sm">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-stone-200 shadow-sm group-hover:border-amber-500/50 transition-colors">
                                            <User className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                                        </div>
                                        <span className="text-sm font-black text-slate-800 flex items-center gap-2">
                                            {user?.name?.split(' ')[0] || user?.firstName || 'User'}
                                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full border border-[#0f0f13] shadow-sm" title="Online" />
                                        </span>
                                    </Link>
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="p-3 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link 
                                        to="/login" 
                                        className="text-sm font-black text-slate-700 hover:text-amber-400 px-6 py-3 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="relative overflow-hidden px-8 py-3 rounded-full font-black transition-all active:scale-95 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] bg-amber-600 text-slate-900 hover:bg-amber-500 flex items-center justify-center gap-2 text-xs"
                                    >
                                        Join Now
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden p-3 bg-white rounded-2xl text-slate-900 transition-all active:scale-90 border border-stone-200"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
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
                            className="fixed inset-0 bg-[#faf9f6]/60 backdrop-blur-sm z-[-1] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 p-8 md:hidden flex flex-col border-l border-stone-200"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <span className="text-2xl font-black tracking-tight text-slate-900">
                                    Servicio<span className="text-amber-500">.</span>
                                </span>
                                <button 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 bg-white rounded-xl text-slate-500 hover:text-slate-900"
                                >
                                    <X />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`text-2xl font-black ${
                                            location.pathname === link.path ? 'text-amber-400' : 'text-slate-700 hover:text-slate-900'
                                        } transition-colors`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                
                                <hr className="border-stone-200 my-4" />
                                
                                {user ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-white border border-stone-200">
                                            <div className="w-14 h-14 bg-[#faf9f6] rounded-2xl flex items-center justify-center shadow-inner">
                                                <User className="w-6 h-6 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-lg leading-tight">{user?.name || user?.firstName || 'User'}</p>
                                                <p className="text-sm font-bold text-green-400">Active Account</p>
                                            </div>
                                        </div>
                                        {user?.role === 'admin' && (
                                            <Link 
                                                to="/admin"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block w-full bg-amber-600 text-slate-900 py-5 rounded-[2rem] font-black text-center shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)]"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link 
                                            to="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block w-full bg-white border border-stone-200 text-slate-900 py-5 rounded-[2rem] font-black text-center hover:bg-[#20202e] transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full bg-red-500/10 text-red-400 py-5 rounded-[2rem] font-black flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
                                        >
                                            <LogOut className="w-5 h-5" /> Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <Link 
                                            to="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full py-5 rounded-[2rem] border-2 border-stone-200 text-center font-black text-slate-900 text-xl hover:bg-white/5 transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link 
                                            to="/register"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full py-5 rounded-[2rem] bg-amber-600 text-center font-black text-slate-900 text-xl shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)]"
                                        >
                                            Join Now
                                        </Link>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-auto pt-8">
                                <p className="text-center text-slate-500 font-bold text-sm">© 2024 Servicio Inc.</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

