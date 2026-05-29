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

const ProviderRegister = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        gender: 'Male',
        role: 'provider',
        address: '',
        state: '',
        district: '',
        skills: []
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

    const handleSkillToggle = (skill) => {
        const currentSkills = formData.skills || [];
        if (currentSkills.includes(skill)) {
            setFormData({ ...formData, skills: currentSkills.filter(s => s !== skill) });
        } else {
            setFormData({ ...formData, skills: [...currentSkills, skill] });
        }
    };

    const AVAILABLE_SKILLS = [
        'Plumber', 'Electrician', 'Cleaning', 'AC Repair', 
        'Carpentry', 'Painting', 'Pest Control', 'Appliance Repair'
    ];

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
        <div className="min-h-screen bg-[#111111] flex flex-col relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
            {/* Top Navigation */}
            <header className="w-full px-8 py-6 flex justify-between items-center z-20 border-b border-white/5 bg-[#111111]">
                <Link to="/" className="text-xl font-black text-white tracking-tight">
                    Servicio
                </Link>
                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-xs font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
                    <Link to="/provider-register" className="bg-[#f3a953] text-[#1c1c1c] px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#e09b4c] transition-colors shadow-lg shadow-amber-500/20">
                        Join as Partner
                    </Link>
                </div>
            </header>

            <div className="flex-1 flex bg-[#111111] w-full">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 bg-[#111111]">
                    {/* Visual Side */}
                    <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden min-h-[800px] border-r border-white/5">
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
                                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/80 to-transparent"></div>
                        </div>
                        
                        <div className="relative z-10 pt-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center border-2 border-[#f3a953]/40 overflow-hidden shadow-[0_0_20px_rgba(243,169,83,0.15)]">
                                    <img src="/logo.png" alt="Servicio Logo" className="w-full h-full object-cover scale-110" />
                                </div>
                                <span className="text-2xl font-bold tracking-tight text-white">Servicio.</span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                                Partner With <br />
                                Servicio.
                            </h1>
                            <p className="text-slate-300 text-[15px] font-medium leading-relaxed max-w-sm">
                                Join our network of elite professionals. Earn more and work on your own terms.
                            </p>
                        </div>

                        <div className="relative z-10 mt-auto pt-16">
                            <div className="inline-flex items-center gap-4 bg-[#151515]/80 backdrop-blur-md p-4 pr-10 rounded-xl border border-white/5">
                                <div className="w-10 h-10 bg-[#f3a953]/10 rounded-lg flex items-center justify-center border border-[#f3a953]/20">
                                    <Shield className="text-[#f3a953] w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-white font-medium text-lg tracking-wide mb-0.5">Verified Professionals</p>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">100% Background Checked</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-8 md:p-16 flex flex-col bg-[#151515] overflow-y-auto">
                        <div className="max-w-2xl mx-auto w-full">
                            <div className="mb-10">
                                <h2 className="text-3xl font-medium text-white tracking-wide mb-2">Become a Partner</h2>
                                <p className="text-slate-400 text-sm">Register to provide premium services in your city.</p>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            <div className="px-4 py-3.5 bg-[#252525] rounded-l-lg border border-white/5 border-r-0 text-slate-300 text-sm font-medium flex items-center justify-center">
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <motion.div variants={itemVariants} className="space-y-2 md:col-span-2 group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#f3a953] block">Address</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-3.5 bg-[#1c1c1c] rounded-lg outline-none focus:bg-[#252525] focus:ring-1 focus:ring-[#f3a953]/50 border border-white/5 focus:border-[#f3a953]/50 transition-all text-sm font-medium text-white placeholder-slate-600 shadow-inner" placeholder="123 Main Street" />
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="space-y-2 group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#f3a953] block">State</label>
                                        <div className="relative">
                                            <select name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-3.5 bg-[#1c1c1c] rounded-lg outline-none focus:bg-[#252525] focus:ring-1 focus:ring-[#f3a953]/50 border border-white/5 focus:border-[#f3a953]/50 transition-all text-sm font-medium text-white shadow-inner appearance-none">
                                                <option value="" disabled hidden className="text-slate-600">Maharashtra</option>
                                                <option value="Maharashtra">Maharashtra</option>
                                                <option value="Delhi">Delhi</option>
                                                <option value="Karnataka">Karnataka</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="space-y-2 group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#f3a953] block">District / City</label>
                                        <div className="relative">
                                            <select name="district" value={formData.district} onChange={handleChange} required className="w-full px-4 py-3.5 bg-[#1c1c1c] rounded-lg outline-none focus:bg-[#252525] focus:ring-1 focus:ring-[#f3a953]/50 border border-white/5 focus:border-[#f3a953]/50 transition-all text-sm font-medium text-white shadow-inner appearance-none">
                                                <option value="" disabled hidden className="text-slate-600">Mumbai</option>
                                                <option value="Mumbai">Mumbai</option>
                                                <option value="Pune">Pune</option>
                                                <option value="Nagpur">Nagpur</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div variants={itemVariants} className="space-y-3 md:col-span-2 pt-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Skills / Services Offered</label>
                                        <div className="flex flex-wrap gap-3">
                                            {AVAILABLE_SKILLS.map(skill => (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    key={skill}
                                                    type="button"
                                                    onClick={() => handleSkillToggle(skill)}
                                                    className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all border ${
                                                        (formData.skills || []).includes(skill)
                                                        ? 'bg-[#f3a953] text-[#1c1c1c] border-[#f3a953] shadow-[0_0_10px_rgba(243,169,83,0.3)]'
                                                        : 'bg-transparent text-slate-300 border-white/10 hover:border-amber-500/30 hover:text-amber-500'
                                                    }`}
                                                >
                                                    {skill}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>

                                <motion.div variants={itemVariants} className="space-y-3 pt-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Gender</span>
                                    <div className="flex gap-6">
                                        {['Male', 'Female'].map(g => (
                                            <label key={g} className="flex items-center gap-3 cursor-pointer group">
                                                <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="hidden" />
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.gender === g ? 'border-[#f3a953]' : 'border-slate-500 group-hover:border-slate-400'}`}>
                                                    <div className={`w-2 h-2 rounded-full transition-all ${formData.gender === g ? 'bg-[#f3a953] scale-100' : 'scale-0'}`}></div>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${formData.gender === g ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>{g}</span>
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
                                    className="w-full relative px-6 py-4 rounded-xl font-medium shadow-lg shadow-amber-500/5 border border-[#f3a953] bg-[#151515] text-[#f3a953] hover:bg-[#f3a953]/5 flex items-center justify-center gap-2 mt-8 text-[15px] transition-all duration-300"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <span>Create Partner Account</span>
                                            <ArrowRight className="w-5 h-5 ml-1" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.form>

                            <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm">
                                <span className="text-slate-400">Already a member? </span>
                                <Link to="/login" className="text-[#f3a953] font-medium hover:text-amber-400 transition-colors">
                                    Sign in to your account →
                                </Link>

                                <div className="mt-10">
                                    <Link to="/register" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-slate-300 transition-colors">
                                        Not a professional? Create a user account
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500 z-20 bg-[#111111]">
                <div className="flex flex-col sm:items-start items-center gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center border border-[#f3a953]/50 overflow-hidden shadow-sm">
                            <img src="/logo.png" alt="Servicio Logo" className="w-full h-full object-cover scale-110" />
                        </div>
                        <span className="text-xl font-bold text-amber-500 tracking-wide capitalize">Servicio</span>
                    </div>
                    <span className="mt-1">© 2024 Servicio Management System. All rights reserved.</span>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black mt-1">
                        Engineered by <span className="text-amber-500">Jeeshan</span> (Backend) &amp; <span className="text-amber-500">Dipanshu</span> (Frontend)
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-center">
                    <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link to="#" className="hover:text-white transition-colors">Cookie Settings</Link>
                    <Link to="#" className="hover:text-white transition-colors">Contact Support</Link>
                </div>

            </footer>
        </div>
    );
};

export default ProviderRegister;
