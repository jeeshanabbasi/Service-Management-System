import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, Loader2, Sparkles, Shield, ChevronLeft, ArrowRight, User, Users } from 'lucide-react';
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
        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        gender: 'Male',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        setLoading(true);
        setError('');
        try {
            await register(
                formData.firstName, 
                formData.lastName, 
                formData.email, 
                formData.password, 
                formData.role,
                formData.phone,
                formData.gender,
                formData.address,
                formData.state,
                formData.district,
                formData.skills
            );
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#111111] flex flex-col relative overflow-hidden selection:bg-[#f3a953]/30 selection:text-[#f3a953]">
            <div className="flex-1 flex items-center justify-center p-6 w-full">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#f3a953]/5 rounded-full blur-[140px] animate-pulse-subtle" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#f3a953]/5 rounded-full blur-[120px]" />
            </div>

            <Link 
                to="/" 
                className="absolute top-10 left-10 hidden md:flex items-center gap-2 text-[#f3a953] hover:text-[#e09b4c] transition-colors font-black text-[10px] uppercase tracking-[0.2em]"
            >
                <ChevronLeft className="w-4 h-4" /> Back to Home
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-5 bg-[#151515] rounded-[2rem] shadow-2xl overflow-hidden border border-white/5"
            >
                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-between p-12 lg:col-span-2 relative overflow-hidden border-r border-white/5">
                    {/* Background Image & Overlay */}
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
                                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale"
                            />
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/80 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#151515]/90 to-transparent"></div>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#f3a953]/10 rounded-full blur-3xl z-0" />
                    
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-4 mb-16">
                            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center border-2 border-[#f3a953]/40 overflow-hidden shadow-[0_0_20px_rgba(243,169,83,0.15)]">
                                <img src="/logo.png" alt="Servicio Logo" className="w-full h-full object-cover scale-110" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">Servicio.</span>
                        </Link>
                        
                        <h1 className="text-4xl font-bold text-white leading-tight mb-6 mt-10">
                            Start Your <br />
                            <span className="text-[#f3a953]">Journey.</span>
                        </h1>
                        <p className="text-slate-300 text-[15px] font-medium leading-relaxed max-w-sm">
                            Join the world's most exclusive service community today. Experience excellence without limits.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-8 pt-16">
                        <div className="inline-flex items-center gap-4 bg-[#1c1c1c]/80 backdrop-blur-md p-4 pr-8 rounded-xl border border-white/5">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                                <Shield className="text-[#f3a953] w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-white font-medium text-[15px] mb-0.5">Verified Professionals</p>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">100% Background Checked</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-10 md:p-14 lg:col-span-3 flex flex-col justify-center bg-[#151515]">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10">
                            <h2 className="text-3xl font-medium text-white tracking-wide mb-2">Create Account</h2>
                            <p className="text-slate-400 text-sm">Begin your premium membership today.</p>
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
                            className="space-y-5"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <motion.div variants={itemVariants} className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#f3a953] block">First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3.5 bg-[#1c1c1c] rounded-lg outline-none focus:bg-[#252525] focus:ring-1 focus:ring-[#f3a953]/50 border border-white/5 focus:border-[#f3a953]/50 transition-all text-sm font-medium text-white placeholder-slate-600 shadow-inner" placeholder="John" />
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#f3a953] block">Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3.5 bg-[#1c1c1c] rounded-lg outline-none focus:bg-[#252525] focus:ring-1 focus:ring-[#f3a953]/50 border border-white/5 focus:border-[#f3a953]/50 transition-all text-sm font-medium text-white placeholder-slate-600 shadow-inner" placeholder="Doe" />
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2 md:col-span-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#f3a953] block">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3.5 bg-[#1c1c1c] rounded-lg outline-none focus:bg-[#252525] focus:ring-1 focus:ring-[#f3a953]/50 border border-white/5 focus:border-[#f3a953]/50 transition-all text-sm font-medium text-white placeholder-slate-600 shadow-inner" placeholder="john@example.com" />
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2 md:col-span-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#f3a953] block">Phone Number</label>
                                    <div className="flex">
                                        <div className="px-5 py-3.5 bg-[#252525] rounded-l-lg border border-white/5 border-r-0 text-slate-300 text-sm font-medium flex items-center justify-center">
                                            +91
                                        </div>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3.5 bg-[#1c1c1c] rounded-r-lg outline-none focus:bg-[#252525] focus:ring-1 focus:ring-[#f3a953]/50 border border-white/5 focus:border-[#f3a953]/50 transition-all text-sm font-medium text-white placeholder-slate-600 shadow-inner" placeholder="00000 00000" />
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#f3a953] block">Password</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3.5 bg-[#1c1c1c] rounded-lg outline-none focus:bg-[#252525] focus:ring-1 focus:ring-[#f3a953]/50 border border-white/5 focus:border-[#f3a953]/50 transition-all text-sm font-medium text-white placeholder-slate-600 shadow-inner" placeholder="••••••••" />
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#f3a953] block">Confirm</label>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-3.5 bg-[#1c1c1c] rounded-lg outline-none focus:bg-[#252525] focus:ring-1 focus:ring-[#f3a953]/50 border border-white/5 focus:border-[#f3a953]/50 transition-all text-sm font-medium text-white placeholder-slate-600 shadow-inner" placeholder="••••••••" />
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="space-y-3 pt-4 pb-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Gender</span>
                                <div className="flex gap-8">
                                    {['Male', 'Female'].map(g => (
                                        <label key={g} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="hidden" />
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.gender === g ? 'border-[#f3a953]' : 'border-slate-500 group-hover:border-slate-400'}`}>
                                                <div className={`w-2 h-2 rounded-full transition-all ${formData.gender === g ? 'bg-[#f3a953] scale-100' : 'scale-0'}`}></div>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${formData.gender === g ? 'text-[#f3a953]' : 'text-slate-400 group-hover:text-slate-300'}`}>{g}</span>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="w-full relative px-6 py-4 rounded-lg font-medium shadow-lg shadow-amber-500/10 bg-[#f3a953] text-[#1c1c1c] hover:bg-[#e09b4c] flex items-center justify-center gap-2 mt-4 text-[15px] transition-all duration-300"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <span>Create Account Now</span>
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </motion.button>
                        </motion.form>

                        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm">
                            <p className="text-slate-400 text-xs mb-1">Already a member?</p>
                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-2 text-[#f3a953] hover:text-[#e09b4c] font-medium text-sm transition-colors"
                            >
                                Sign in to your account <ArrowRight className="w-4 h-4" />
                            </Link>

                            <div className="mt-10">
                                <Link to="/provider-register" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-slate-300 transition-colors">
                                    Are you a professional? Partner with us
                                </Link>
                            </div>
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

export default Register;
