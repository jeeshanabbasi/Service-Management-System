import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, Loader2, Sparkles, Shield, ChevronLeft, ArrowRight, User, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        gender: 'male',
        role: 'employee',
    });
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

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
                formData.gender
            );
            navigate('/');
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
                className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-5 bg-white rounded-[3rem] shadow-premium overflow-hidden border border-slate-100"
            >
                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 lg:col-span-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl opacity-50" />
                    
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-3 mb-16">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <Sparkles className="text-white w-5 h-5" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white">Servicio.</span>
                        </Link>
                        
                        <h1 className="text-5xl font-black text-white leading-tight mb-8">
                            Start Your <br />
                            <span className="text-primary-400 font-display">Journey.</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                            Join the world's most exclusive service community today. Experience excellence without limits.
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
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h2>
                                <p className="text-slate-500 font-bold">Begin your premium membership.</p>
                            </div>

                            {/* Role Switcher */}
                            <div className="bg-slate-50 p-1.5 rounded-[1.5rem] flex items-center border border-slate-100">
                                {['employee', 'hirer'].map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setFormData({...formData, role: r})}
                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                            formData.role === r 
                                            ? 'bg-white text-primary-600 shadow-premium' 
                                            : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        {r === 'employee' ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                        {r}
                                    </button>
                                ))}
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-500 font-bold text-slate-900 transition-all shadow-inner" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-500 font-bold text-slate-900 transition-all shadow-inner" placeholder="Doe" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-500 font-bold text-slate-900 transition-all shadow-inner" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-500 font-bold text-slate-900 transition-all shadow-inner" placeholder="+91 00000 00000" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-500 font-bold text-slate-900 transition-all shadow-inner" placeholder="••••••••" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-500 font-bold text-slate-900 transition-all shadow-inner" placeholder="••••••••" />
                                </div>
                            </div>

                            <div className="flex items-center gap-8 py-4 px-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</span>
                                <div className="flex gap-8">
                                    {['male', 'female'].map(g => (
                                        <label key={g} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="hidden" />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.gender === g ? 'border-primary-500 bg-primary-50' : 'border-slate-200'}`}>
                                                <div className={`w-2.5 h-2.5 rounded-full transition-all ${formData.gender === g ? 'bg-primary-500 scale-100' : 'scale-0'}`}></div>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${formData.gender === g ? 'text-primary-600' : 'text-slate-400'}`}>{g}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative overflow-hidden px-10 py-5 rounded-2xl font-black transition-all active:scale-95 shadow-premium hover:shadow-premium-hover bg-primary-600 text-white hover:bg-primary-700 flex items-center justify-center gap-2 mt-4 text-sm"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <span>Create Account Now</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                            <p className="text-slate-400 font-bold text-sm mb-4">Already a member?</p>
                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-2 text-primary-600 font-black text-sm group"
                            >
                                Sign in to your account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
