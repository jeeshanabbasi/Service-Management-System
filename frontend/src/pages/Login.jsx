import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, Loader2, Sparkles, Shield, ChevronLeft, ArrowRight } from 'lucide-react';
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-100/40 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px]" />
            </div>

            <Link 
                to="/" 
                className="absolute top-10 left-10 hidden md:flex items-center gap-2 text-slate-400 hover:text-primary-600 transition-colors font-black text-xs uppercase tracking-widest"
            >
                <ChevronLeft className="w-4 h-4" /> Back to Home
            </Link>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white/50"
            >
                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden">
                    {/* Background Image Slideshow */}
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
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-slate-900/50"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl opacity-50 z-0" />
                    
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-3 mb-16">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <Sparkles className="text-white w-5 h-5" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white">Servicio.</span>
                        </Link>
                        
                        <h1 className="text-5xl font-black text-white leading-tight mb-8">
                            Welcome <br />
                            To The <span className="text-primary-400">Elite.</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                            Join over 50,000 premium members experiencing the future of home services.
                        </p>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-8 pt-16 border-t border-white/10">
                        <div>
                            <p className="text-white font-black text-2xl mb-1">99.9%</p>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Satisfaction</p>
                        </div>
                        <div>
                            <p className="text-white font-black text-2xl mb-1">24/7</p>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Concierge</p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-12 md:p-20 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-12">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Sign In</h2>
                            <p className="text-slate-500 font-bold">Secure access to your luxury dashboard.</p>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 text-red-600 p-5 rounded-2xl mb-8 text-sm font-black border border-red-100 flex items-center gap-3"
                            >
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                                    <Shield className="w-4 h-4" />
                                </div>
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
                            <motion.div variants={itemVariants} className="space-y-2 group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-amber-500">Work Email</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:scale-[1.02] border border-slate-200 hover:border-slate-300 transition-all font-bold text-slate-900 shadow-sm"
                                    placeholder="admin@servicio.com"
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2 group">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-amber-500">Password</label>
                                    <Link to="#" className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-colors">Forgot?</Link>
                                </div>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:scale-[1.02] border border-slate-200 hover:border-slate-300 transition-all font-bold text-slate-900 shadow-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </motion.div>

                            <motion.button 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                disabled={loading}
                                className="w-full py-5 bg-slate-900 text-white font-black rounded-xl hover:bg-amber-600 shadow-lg shadow-slate-900/10 hover:shadow-amber-500/30 transition-all duration-300 flex items-center justify-center gap-3 text-sm group"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Sign In To Account 
                                        <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </motion.form>

                        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                            <p className="text-slate-400 font-bold text-sm mb-4">New to our platform?</p>
                            <Link 
                                to="/register" 
                                className="inline-flex items-center gap-2 text-slate-900 hover:text-amber-600 font-black text-sm group transition-colors"
                            >
                                Create an account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
                                <Link to="/partner" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">
                                    Are you a professional? Partner with us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
