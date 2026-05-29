import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, Loader2, Sparkles, Shield, ChevronLeft, ArrowRight, Lock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const backgroundImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2068&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521590832167-7bfc17484d8f?q=80&w=2070&auto=format&fit=crop"
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userData = await login(email, password);
            if (userData.role === 'admin') {
                navigate('/admin');
            } else if (userData.role === 'provider') {
                navigate('/provider-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#151515] flex flex-col relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
            {/* Top Navigation */}
            <header className="w-full px-8 py-6 flex justify-between items-center z-20">
                <Link to="/" className="flex items-center gap-3 text-amber-500 hover:text-amber-400 font-bold uppercase tracking-[0.2em] text-[10px] transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back to Home
                </Link>
                <div className="text-lg font-black text-white tracking-tight">
                    Servicio<span className="text-amber-500">.</span>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center p-6 z-10 w-full max-w-[1000px] mx-auto mt-2 lg:mt-0 mb-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full grid grid-cols-1 lg:grid-cols-2 bg-[#1c1c1c] rounded-2xl shadow-2xl overflow-hidden border border-white/5"
                >
                    {/* Visual Side */}
                    <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden min-h-[600px] border-r border-white/5">
                        <div className="absolute inset-0 z-0">
                            <AnimatePresence>
                                <motion.img 
                                    key={currentImage}
                                    src={backgroundImages[currentImage]}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    alt="Premium Service" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#1c1c1c]/80 to-transparent"></div>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-12">
                                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center border-2 border-[#f3a953]/40 overflow-hidden shadow-[0_0_20px_rgba(243,169,83,0.15)]">
                                    <img src="/logo.png" alt="Servicio Logo" className="w-full h-full object-cover scale-110" />
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-white">Servicio.</span>
                            </div>
                            
                            <h1 className="text-xl font-medium text-white leading-relaxed mb-6">
                                Welcome <br />
                                To The <span className="text-[#f3a953]">Elite.</span>
                            </h1>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-xs">
                                Join over 50,000 premium members experiencing the future of home services.
                            </p>
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-8 pt-10 border-t border-white/5 mt-20">
                            <div>
                                <p className="text-[#f3a953] font-medium text-3xl mb-1 tracking-tight">99.9%</p>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Satisfaction</p>
                            </div>
                            <div>
                                <p className="text-white font-medium text-3xl mb-1 tracking-tight">24/7</p>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Concierge</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-10 md:p-14 flex flex-col justify-center bg-[#1c1c1c]">
                        <div className="max-w-sm mx-auto w-full">
                            <div className="mb-10">
                                <h2 className="text-[15px] font-medium text-white mb-2 tracking-wide">Sign In</h2>
                                <p className="text-slate-400 text-[13px]">Secure access to your luxury dashboard.</p>
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-rose-500/10 text-rose-500 p-4 rounded-lg mb-8 text-xs font-bold border border-rose-500/20 flex items-center gap-3"
                                >
                                    <Shield className="w-4 h-4 shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <motion.form 
                                onSubmit={handleSubmit} 
                                className="space-y-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                            >
                                <motion.div variants={itemVariants} className="space-y-3 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#f3a953] block">Work Email</label>
                                    <div className="relative">
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-[#252525] rounded-lg outline-none focus:bg-[#2a2a2a] focus:ring-1 focus:ring-[#f3a953]/50 border border-transparent focus:border-[#f3a953]/50 transition-all text-sm font-medium text-white placeholder-slate-600 shadow-inner"
                                            placeholder="admin@servicio.com"
                                            required
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                                            @
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="space-y-3 group">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#f3a953]">Password</label>
                                        <Link to="#" className="text-[10px] font-black text-[#f3a953] uppercase tracking-[0.2em] hover:text-amber-400 transition-colors">Forgot?</Link>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            type="password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-[#252525] rounded-lg outline-none focus:bg-[#2a2a2a] focus:ring-1 focus:ring-[#f3a953]/50 border border-transparent focus:border-[#f3a953]/50 transition-all text-sm font-medium text-white placeholder-slate-600 shadow-inner"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.button 
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-3.5 bg-[#f3a953] text-[#1c1c1c] font-medium rounded-lg hover:bg-[#e09b4c] transition-all duration-300 flex items-center justify-center gap-2 text-sm mt-4 shadow-lg shadow-[#f3a953]/20"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            Sign In To Account 
                                            <Zap className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.form>

                            <div className="mt-8 relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative px-4 bg-[#1c1c1c] text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    OR
                                </div>
                            </div>

                            <div className="mt-8 text-center text-xs text-slate-400">
                                New to our platform? <Link to="/register" className="text-white font-bold hover:text-[#f3a953] transition-colors ml-1">Create an account →</Link>
                            </div>

                            <div className="mt-10 pt-8 flex justify-center text-center">
                                <Link to="/partner" className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-white transition-colors flex flex-col md:flex-row gap-1 md:gap-2">
                                    <span>Are you a professional?</span> <span className="text-[#f3a953]">Partner with us</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="w-full p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-black uppercase tracking-widest text-slate-500 z-20 mt-auto bg-[#1c1c1c]">
                <div className="flex flex-col sm:items-start items-center gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center border border-[#f3a953]/50 overflow-hidden shadow-sm">
                            <img src="/logo.png" alt="Servicio Logo" className="w-full h-full object-cover scale-110" />
                        </div>
                        <span className="text-lg font-bold text-amber-500 tracking-wide capitalize">Servicio</span>
                    </div>
                    <span className="mt-1">© 2024 Servicio Management System. All rights reserved.</span>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black mt-1">
                        Engineered by <span className="text-amber-500">Jeeshan</span> (Backend) &amp; <span className="text-amber-500">Dipanshu</span> (Frontend)
                    </div>
                </div>
                <div className="flex gap-8">
                    <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link to="#" className="hover:text-white transition-colors">Contact Support</Link>
                </div>
            </footer>
        </div>
    );
};

export default Login;
