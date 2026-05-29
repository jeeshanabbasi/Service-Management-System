import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, CalendarCheck, Shield, Rocket, Zap, Cpu, Network, Globe, Star, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const backgroundImages = [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070", // Building
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072", // Tech Network
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2070", // Modern abstract
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069"  // Corporate Office
    ];

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Auto rotate background
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#111111] min-h-screen text-white font-sans selection:bg-amber-500/30 selection:text-amber-200">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[#111111]">
                    {/* Auto Rotating Backgrounds */}
                    <AnimatePresence mode="wait">
                        <motion.img 
                            key={currentImageIndex}
                            src={backgroundImages[currentImageIndex]}
                            alt="Background" 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/50 via-[#111111]/30 to-[#111111]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/90 via-[#111111]/50 to-transparent"></div>
                </div>

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="max-w-3xl">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-3 py-1 mb-6 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px] font-bold tracking-[0.2em] uppercase"
                        >
                            Enterprise Operations
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
                        >
                            Mastering Complexity<br />
                            with <span className="text-amber-500">Precision.</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed font-medium"
                        >
                            Elevate your service management with real-time analytics, automated scheduling, and seamless team coordination on a platform built for high-performance teams.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <button 
                                onClick={() => navigate('/services')}
                                className="px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg transition-colors text-sm"
                            >
                                Get Started
                            </button>
                            <button 
                                onClick={() => navigate('/services')}
                                className="px-8 py-3.5 bg-transparent border border-slate-600 hover:border-slate-400 text-white font-bold rounded-lg transition-colors text-sm"
                            >
                                View Demo
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Most Requested Section */}
            <section className="py-24 px-6 bg-[#151515]">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Most Requested</h2>
                            <p className="text-slate-400 text-sm">Optimized workflows for your core operations.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/services')}
                            className="text-amber-500 hover:text-amber-400 text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            Explore all <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Operational Analytics Card */}
                        <div className="group relative rounded-2xl overflow-hidden bg-[#1c1c1c] border border-white/5 aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/9]">
                            <img 
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" 
                                alt="Operational Analytics" 
                                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/60 to-transparent"></div>
                            <div className="absolute inset-x-6 bottom-6">
                                <div className="flex items-center gap-2 text-green-400 mb-2">
                                    <Activity className="w-4 h-4" />
                                    <span className="text-[10px] font-bold tracking-widest uppercase">Top Priority</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Operational Analytics</h3>
                                <p className="text-slate-400 text-sm max-w-sm">Deep-dive into resource allocation and performance metrics with our core engine.</p>
                            </div>
                        </div>

                        {/* Resource Planning Card */}
                        <div className="group relative rounded-2xl overflow-hidden bg-[#1c1c1c] border border-white/5 aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/9]">
                            <img 
                                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000" 
                                alt="Resource Planning" 
                                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/60 to-transparent"></div>
                            <div className="absolute inset-x-6 bottom-6">
                                <div className="flex items-center gap-2 text-blue-400 mb-2">
                                    <Users className="w-4 h-4" />
                                    <span className="text-[10px] font-bold tracking-widest uppercase">Teamwork</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Resource Planning</h3>
                                <p className="text-slate-400 text-sm max-w-sm">Sync your workforce with demand forecasting in real-time.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Small Card 1 */}
                        <div className="bg-[#1a1a1a] border border-white/5 p-8 rounded-2xl hover:bg-[#1f1f1f] transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-6">
                                <CalendarCheck className="w-5 h-5 text-amber-500" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Smart Scheduling</h3>
                            <p className="text-slate-400 text-sm">AI-driven automated booking systems.</p>
                        </div>
                        {/* Small Card 2 */}
                        <div className="bg-[#1a1a1a] border border-white/5 p-8 rounded-2xl hover:bg-[#1f1f1f] transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-6">
                                <Shield className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Access Control</h3>
                            <p className="text-slate-400 text-sm">Enterprise-grade security protocols.</p>
                        </div>
                        {/* Small Card 3 */}
                        <div className="bg-[#1a1a1a] border border-white/5 p-8 rounded-2xl hover:bg-[#1f1f1f] transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6">
                                <Rocket className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Rapid Scale</h3>
                            <p className="text-slate-400 text-sm">Deployment tools for growing networks.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Servicio Core Section */}
            <section className="py-24 px-6 bg-[#111111]">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 w-full">
                            <div className="relative rounded-3xl overflow-hidden aspect-square md:aspect-[4/3] lg:aspect-square">
                                <img 
                                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000" 
                                    alt="Server Infrastructure" 
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#111111]/80 via-transparent to-transparent mix-blend-multiply"></div>
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                                The <span className="text-amber-500">Servicio</span> Core
                            </h2>
                            <p className="text-slate-400 mb-12 text-lg">
                                We didn't just build a dashboard. We built an ecosystem designed to handle the friction of scale.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <Zap className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Zero Latency Updates</h4>
                                        <p className="text-sm text-slate-500">Sync changes across your entire global team in under 50ms.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <Cpu className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Predictive Engines</h4>
                                        <p className="text-sm text-slate-500">Identify bottlenecks before they happen with our ML core.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <Network className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Universal Integration</h4>
                                        <p className="text-sm text-slate-500">Connect to 2,000+ tools with our native API bridge.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 relative overflow-hidden bg-[#151515]">
                {/* Dotted background effect */}
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, #333 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.2 }}></div>
                
                <div className="container mx-auto max-w-4xl relative z-10">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-12 md:p-20 text-center shadow-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to level up your<br />operations?</h2>
                        <p className="text-slate-400 mb-10 max-w-xl mx-auto">
                            Join 500+ global enterprises that trust Servicio to power their mission-critical services.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                            <button 
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg transition-colors text-sm"
                            >
                                Start Free Trial
                            </button>
                            <button 
                                onClick={() => navigate('/services')}
                                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-slate-600 hover:border-slate-400 text-white font-bold rounded-lg transition-colors text-sm"
                            >
                                Talk to Sales
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">No credit card required. 14-day free trial.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#111111] py-8 border-t border-white/5">
                <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col sm:items-start items-center gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center border border-[#f3a953]/50 overflow-hidden shadow-sm">
                                <img src="/logo.png" alt="Servicio Logo" className="w-full h-full object-cover scale-110" />
                            </div>
                            <span className="text-xl font-bold text-amber-500 tracking-wide">Servicio</span>
                        </div>
                        <span className="text-xs text-slate-500 mt-1">© 2024 Servicio Management. All rights reserved.</span>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">
                            Engineered by <span className="text-amber-500">Jeeshan</span> (Backend) &amp; <span className="text-amber-500">Dipanshu</span> (Frontend)
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                            <Globe className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                            <Star className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
