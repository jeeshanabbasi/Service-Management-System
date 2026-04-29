import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, Loader2, Sparkles, Shield, ChevronLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
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
                className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
            >
                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl opacity-50" />
                    
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-500 transition-all font-bold text-slate-900" 
                                    placeholder="name@company.com" 
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                    <Link to="#" className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">Forgot?</Link>
                                </div>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary-500 transition-all font-bold text-slate-900" 
                                    placeholder="••••••••" 
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-primary-600 transition-all flex items-center justify-center gap-3 text-sm"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <span>Sign In To Account</span>
                                        <Rocket className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                            <p className="text-slate-400 font-bold text-sm mb-4">New to our platform?</p>
                            <Link 
                                to="/register" 
                                className="inline-flex items-center gap-2 text-primary-600 font-black text-sm group"
                            >
                                Create an account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
