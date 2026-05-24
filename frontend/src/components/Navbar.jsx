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

    const isAdminPage = location.pathname.startsWith('/admin');

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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center bg-gradient-to-r from-slate-900 to-[#0B1120] border-b border-slate-800/60 backdrop-blur-xl ${
            scrolled ? 'shadow-xl shadow-slate-900/50' : ''
        }`}>
            <div className={`w-full max-w-[1600px] transition-all duration-500 px-8 py-5 flex justify-between items-center border-x border-slate-800/60`}>
                {/* Logo */}
                    <Link to="/" className="group flex items-center gap-3 shrink-0">
                        <div className="w-11 h-11 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:rotate-12 transition-all duration-500">
                            <Sparkles className="text-slate-900 w-6 h-6" />
                        </div>
                        <span className={`text-2xl font-black tracking-tight text-white`}>
                            Servicio<span className="text-amber-500">.</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center justify-between flex-grow ml-10">
                        {/* Search Bar - Aligned to left/center */}
                        <div className="flex-grow">
                            {!isAdminPage && (
                                <div className="relative group max-w-md w-full mr-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors text-slate-400 group-focus-within:text-amber-500" />
                                    <input 
                                        type="text" 
                                        placeholder="Find a service..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                        className="w-full pl-11 pr-4 py-2.5 rounded-full text-sm font-semibold transition-all outline-none border bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:bg-slate-800 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right Section: Links & Auth */}
                        <div className="flex items-center gap-6">
                            {/* Navigation Links */}
                            {!isAdminPage ? (
                                <>
                                    <div className="flex items-center gap-2 p-1 rounded-full border bg-slate-800/50 border-slate-700/50">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                to={link.path}
                                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                                                    location.pathname === link.path ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/20' : 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-700/50'
                                                }`}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="w-px h-8 hidden lg:block bg-slate-700"></div>
                                </>
                            ) : (
                                <Link to="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all font-bold text-sm shadow-[0_4px_12px_rgba(245,158,11,0.15)]">
                                    <LogOut className="w-4 h-4 rotate-180" /> Go to App
                                </Link>
                            )}

                            {/* Auth Buttons */}
                            <div className="flex items-center gap-4">
                                {/* Cart Icon */}
                                {!isAdminPage && (
                                    <Link to="/cart" className="relative p-2.5 transition-colors rounded-full border bg-slate-800/50 border-slate-700/50 text-slate-300 hover:text-amber-400 hover:bg-slate-700">
                                        <ShoppingBag className="w-5 h-5" />
                                        {cart?.length > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-900 rounded-full text-[10px] font-bold flex items-center justify-center border border-amber-600 shadow-sm">
                                                {cart.length}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                {user ? (
                                    <div className="flex items-center gap-3">
                                        {user?.role === 'admin' && (
                                            <Link to="/admin" className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-wider">
                                                Admin Panel
                                            </Link>
                                        )}
                                        {user?.role === 'provider' && (
                                            <Link to="/provider-dashboard" className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all font-bold text-xs uppercase tracking-wider">
                                                Provider Panel
                                            </Link>
                                        )}
                                        <Link to="/dashboard" className={`flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all group shadow-sm bg-slate-800/50 border-slate-700/50 hover:border-amber-500/50 hover:text-amber-400`}>
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors bg-slate-900 group-hover:bg-amber-500/10`}>
                                                <User className={`w-4 h-4 transition-colors text-slate-400 group-hover:text-amber-500`} />
                                            </div>
                                            <span className={`text-sm font-bold flex items-center gap-2 text-slate-200`}>
                                                {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
                                                <span className="w-2 h-2 bg-green-500 rounded-full shadow-sm" title="Online" />
                                            </span>
                                        </Link>
                                        
                                        <button
                                            onClick={handleLogout}
                                            className={`p-2.5 rounded-full transition-all border border-transparent text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20`}

                                            title="Logout"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Link 
                                            to="/login" 
                                            className="text-sm font-bold text-slate-600 hover:text-amber-500 px-2 transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link 
                                            to="/register" 
                                            className="px-6 py-2.5 rounded-full font-bold transition-all active:scale-95 shadow-sm hover:shadow-md bg-amber-500 text-white hover:bg-amber-600 flex items-center justify-center text-sm"
                                        >
                                            Join Now
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden p-3 bg-slate-800/50 rounded-2xl text-slate-300 transition-all active:scale-90 border border-slate-700"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
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
                            className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-gradient-to-b from-slate-900 to-[#0B1120] shadow-2xl z-50 p-8 md:hidden flex flex-col border-l border-slate-800/60"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <span className="text-2xl font-black tracking-tight text-white">
                                    Servicio<span className="text-amber-500">.</span>
                                </span>
                                <button 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white"
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
                                            location.pathname === link.path ? 'text-amber-400' : 'text-slate-300 hover:text-white'
                                        } transition-colors`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                
                                <hr className="border-slate-800/60 my-4" />
                                
                                {user ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-slate-800/50 border border-slate-700/50">
                                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-inner">
                                                <User className="w-6 h-6 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-lg leading-tight">{user?.name || user?.firstName || 'User'}</p>
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
                                        {user?.role === 'provider' && (
                                            <Link 
                                                to="/provider-dashboard"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-center shadow-[0_10px_40px_-10px_rgba(59,130,246,0.2)]"
                                            >
                                                Provider Dashboard
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

