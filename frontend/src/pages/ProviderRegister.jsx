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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-100/40 rounded-full blur-[140px] animate-pulse-subtle" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px]" />
            </div>

            <Link 
                to="/" 
                className="absolute top-10 left-10 hidden md:flex items-center gap-2 text-slate-400 hover:text-primary-600 transition-colors font-black text-xs uppercase tracking-widest"
            >
                <ChevronLeft className="w-4 h-4" /> Back to Home
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-5 bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white/50"
            >
                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-between p-16 lg:col-span-2 relative overflow-hidden">
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
                            Partner With <br />
                            <span className="text-primary-400 font-display">Servicio.</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                            Join our network of elite professionals. Earn more and work on your own terms.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-8 pt-16 border-t border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                <Shield className="text-primary-400 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white font-black text-sm">Verified Professionals</p>
                                <p className="text-slate-500 text-xs font-bold uppercase">100% Background Checked</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-10 md:p-16 lg:col-span-3 flex flex-col justify-center">
                    <div className="max-w-2xl mx-auto w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Become a Partner</h2>
                                <p className="text-slate-500 font-bold">Register to provide premium services.</p>
                            </div>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div variants={itemVariants} className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-amber-500">First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:scale-[1.02] border border-slate-200 hover:border-slate-300 transition-all font-bold text-slate-900 shadow-sm" placeholder="John" />
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-amber-500">Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:scale-[1.02] border border-slate-200 hover:border-slate-300 transition-all font-bold text-slate-900 shadow-sm" placeholder="Doe" />
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2 md:col-span-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-amber-500">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:scale-[1.02] border border-slate-200 hover:border-slate-300 transition-all font-bold text-slate-900 shadow-sm" placeholder="john@example.com" />
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2 md:col-span-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-amber-500">Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:scale-[1.02] border border-slate-200 hover:border-slate-300 transition-all font-bold text-slate-900 shadow-sm" placeholder="+91 00000 00000" />
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-amber-500">Password</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:scale-[1.02] border border-slate-200 hover:border-slate-300 transition-all font-bold text-slate-900 shadow-sm" placeholder="••••••••" />
                                </motion.div>
                                <motion.div variants={itemVariants} className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-amber-500">Confirm</label>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:scale-[1.02] border border-slate-200 hover:border-slate-300 transition-all font-bold text-slate-900 shadow-sm" placeholder="••••••••" />
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div variants={itemVariants} className="space-y-2 md:col-span-2 group">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-amber-500">Address</label>
                                            <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:scale-[1.02] border border-slate-200 hover:border-slate-300 transition-all font-bold text-slate-900 shadow-sm" placeholder="123 Main Street" />
                                        </motion.div>
                                        <motion.div variants={itemVariants} className="space-y-2 group">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-amber-500">State</label>
                                            <input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:scale-[1.02] border border-slate-200 hover:border-slate-300 transition-all font-bold text-slate-900 shadow-sm" placeholder="Maharashtra" />
                                        </motion.div>
                                        <motion.div variants={itemVariants} className="space-y-2 group">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-amber-500">District / City</label>
                                            <input type="text" name="district" value={formData.district} onChange={handleChange} required className="w-full px-5 py-4 bg-slate-50/50 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 focus:scale-[1.02] border border-slate-200 hover:border-slate-300 transition-all font-bold text-slate-900 shadow-sm" placeholder="Mumbai" />
                                        </motion.div>
                                        <motion.div variants={itemVariants} className="space-y-3 md:col-span-2 pt-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skills / Services Offered</label>
                                            <div className="flex flex-wrap gap-2">
                                                {AVAILABLE_SKILLS.map(skill => (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        key={skill}
                                                        type="button"
                                                        onClick={() => handleSkillToggle(skill)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                                            (formData.skills || []).includes(skill)
                                                            ? 'bg-amber-100 text-amber-700 border-2 border-amber-500 shadow-sm'
                                                            : 'bg-slate-50/80 text-slate-500 border-2 border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        {skill}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="flex items-center gap-8 py-4 px-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</span>
                                <div className="flex gap-8">
                                    {['Male', 'Female'].map(g => (
                                        <label key={g} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="hidden" />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110 ${formData.gender === g ? 'border-amber-500 bg-amber-50' : 'border-slate-200'}`}>
                                                <div className={`w-2.5 h-2.5 rounded-full transition-all ${formData.gender === g ? 'bg-amber-500 scale-100' : 'scale-0'}`}></div>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${formData.gender === g ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{g}</span>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full relative overflow-hidden px-10 py-5 rounded-xl font-black shadow-sm bg-slate-900 text-white hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2 mt-4 text-sm group transition-colors duration-300"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <span>Create Partner Account</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </motion.form>

                        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                            <p className="text-slate-400 font-bold text-sm mb-4">Already a member?</p>
                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-2 text-slate-900 hover:text-amber-600 font-black text-sm group transition-colors"
                            >
                                Sign in to your account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
                                <Link to="/register" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">
                                    Not a professional? Create a user account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProviderRegister;
