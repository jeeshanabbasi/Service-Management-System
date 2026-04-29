import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Shield, Star, DollarSign, ArrowRight, Loader2, Play, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { Toaster } from 'react-hot-toast';

const Home = () => {
    const [query, setQuery] = useState('');
    const [suggestion, setSuggestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const slides = [
        {
            image: '/images/plumbing_light.png',
            title: 'Elite Plumbing Solutions',
            subtitle: 'THE GOLD STANDARD OF REPAIR',
            description: 'Book verified expert plumbers for luxury home maintenance and emergency repairs.',
        },
        {
            image: '/images/cleaning_light.png',
            title: 'Masterful Home Cleaning',
            subtitle: 'PURITY IN EVERY CORNER',
            description: 'Experience pristine living with our professional, white-glove cleaning services.',
        },
        {
            image: '/images/salon_light.png',
            title: 'Luxury Wellness & Style',
            subtitle: 'SALON AT YOUR DOORSTEP',
            description: 'Premium stylists and wellness experts dedicated to your personal care.',
        },
        {
            image: '/images/electrician_light.png',
            title: 'Precision Tech & Electrical',
            subtitle: 'SMART HOME EVOLUTION',
            description: 'Safe, smart, and efficient electrical solutions for your modern lifestyle.',
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get('/api/services');
            setServices(res.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setServicesLoading(false);
        }
    };

    return (
        <div className="bg-[#faf9f6] min-h-screen selection:bg-amber-500/30 selection:text-slate-900">
            <Toaster position="bottom-right" />
            
            {/* Hero Banner Section */}
            <div className="relative h-[95vh] min-h-[700px] w-full overflow-hidden bg-[#faf9f6]">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0"
                    >
                        {/* Background Image */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] scale-105"
                            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f6] via-[#faf9f6]/90 to-[#faf9f6]/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-transparent to-[#faf9f6]/20" />
                        </div>

                        {/* Content */}
                        <div className="relative h-full container mx-auto px-6 flex items-center">
                            <div className="max-w-3xl pt-20 relative z-10">
                                {/* Decorative Glow */}
                                <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/30 blur-[100px] rounded-full pointer-events-none" />

                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 backdrop-blur-md border border-amber-500/20 rounded-full text-amber-400 text-[10px] font-black uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                >
                                    <Sparkles className="w-3 h-3" />
                                    <span>{slides[currentSlide].subtitle}</span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8 drop-shadow-2xl"
                                >
                                    {slides[currentSlide].title.split(' ').map((word, i) => (
                                        <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 block md:inline" : ""}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="text-xl md:text-2xl text-slate-700 font-medium max-w-xl leading-relaxed mb-12 drop-shadow-lg"
                                >
                                    {slides[currentSlide].description}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                    className="flex flex-col sm:flex-row items-center gap-6"
                                >
                                    <button
                                        onClick={() => navigate('/services')}
                                        className="w-full sm:w-auto px-10 py-5 bg-amber-600 text-slate-900 rounded-2xl font-black text-lg shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] hover:bg-amber-500 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        <span>View Services</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => navigate('/services')}
                                        className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md border border-stone-200 text-slate-900 rounded-2xl font-black text-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        <span>View More</span>
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Slide Indicators */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`h-1.5 transition-all duration-500 rounded-full ${
                                i === currentSlide ? 'w-12 bg-amber-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'w-4 bg-white/20 hover:bg-white/40'
                            }`}
                        />
                    ))}
                </div>

                {/* Navigation Arrows */}
                <div className="absolute bottom-12 right-12 flex gap-4 z-20 opacity-0 md:opacity-100">
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="p-4 bg-[#faf9f6]/40 backdrop-blur-md border border-stone-200 rounded-full text-slate-900 hover:bg-white/10 hover:border-stone-200 transition-all hover:scale-110"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                        className="p-4 bg-[#faf9f6]/40 backdrop-blur-md border border-stone-200 rounded-full text-slate-900 hover:bg-white/10 hover:border-stone-200 transition-all hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Popular Services Section */}
            <div className="container mx-auto px-6 py-32 relative">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 relative z-10">
                    <div className="max-w-2xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-amber-500 font-black text-xs uppercase tracking-[0.3em] mb-4"
                        >
                            Most Requested
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                            Elevate your home <br /> with our <span className="italic font-normal serif text-slate-500">finest</span> services.
                        </h2>
                    </div>
                    <button 
                        onClick={() => navigate('/services')}
                        className="px-8 py-4 rounded-2xl font-black transition-all active:scale-95 border border-stone-200 bg-white text-slate-900 hover:bg-white hover:border-stone-200 flex items-center justify-center gap-2 group shadow-lg"
                    >
                        <span>View Catalogue</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                
                {servicesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="bg-white border border-stone-200 h-[500px] rounded-[3rem] animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                        {services.slice(0, 6).map((service) => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                )}
            </div>
            
            {/* Value Propositions */}
            <div className="py-32 relative overflow-hidden bg-[#faf9f6] border-y border-stone-200">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-24 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">The Servicio Core</h2>
                        <p className="text-slate-500 text-xl font-medium leading-relaxed">We don't just provide services; we deliver peace of mind through a meticulous layer of quality control and absolute perfection.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { 
                                icon: Award, 
                                title: 'Elite Pros Only', 
                                desc: 'We only accept the top 5% of professionals based on technical skill and client communication.',
                                color: 'from-amber-400 to-orange-600',
                                glow: 'shadow-[0_0_30px_rgba(251,191,36,0.15)]'
                            },
                            { 
                                icon: Shield, 
                                title: 'Ultimate Security', 
                                desc: 'Every service is backed by our $1M protection plan and rigorous background verification.',
                                color: 'from-blue-400 to-amber-600',
                                glow: 'shadow-[0_0_30px_rgba(96,165,250,0.15)]'
                            },
                            { 
                                icon: Sparkles, 
                                title: 'Precision Match', 
                                desc: 'Our proprietary AI ensures you are paired with the most qualified expert for your specific needs.',
                                color: 'from-amber-400 to-amber-600',
                                glow: 'shadow-[0_0_30px_rgba(129,140,248,0.15)]'
                            }
                        ].map((prop, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                className={`bg-[#faf9f6] border border-stone-200 p-12 rounded-[3.5rem] relative group hover:-translate-y-2 transition-all duration-500 ${prop.glow} hover:border-stone-200`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${prop.color} opacity-0 group-hover:opacity-5 rounded-[3.5rem] transition-opacity duration-500`} />
                                <div className={`w-20 h-20 bg-gradient-to-br ${prop.color} rounded-3xl flex items-center justify-center mb-10 shadow-lg`}>
                                    <prop.icon className="w-10 h-10 text-slate-900" />
                                </div>
                                <h3 className="font-black text-3xl mb-6 text-slate-900">{prop.title}</h3>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed">{prop.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="container mx-auto px-6 py-32">
                <div className="w-full bg-gradient-to-r from-white to-amber-50 rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden group border border-amber-200 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.15)]">
                    {/* Animated Glow */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-400 opacity-20 rounded-full blur-[100px] -translate-x-1/4 -translate-y-1/4 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400 opacity-10 rounded-full blur-[80px] translate-x-1/4 translate-y-1/4 animate-pulse" style={{ animationDelay: '2s' }} />
                    
                    <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
                        <motion.h2 
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-8"
                        >
                            Ready to level up <br /> your home?
                        </motion.h2>
                        <p className="text-xl text-slate-500 font-medium mb-12 max-w-2xl">
                            Join thousands of satisfied customers who have transformed their living spaces with our elite network of professionals.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                            <button 
                                onClick={() => navigate('/services')}
                                className="w-full sm:w-auto px-10 py-5 bg-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 hover:bg-amber-600 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <span>Explore Now</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto px-10 py-5 bg-black/20 backdrop-blur-md border border-stone-200 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black/30 hover:border-stone-200 transition-all duration-300"
                            >
                                Become a Pro
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simplified Footer */}
            <footer className="container mx-auto px-6 py-12 border-t border-stone-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-600/20 border border-amber-500/30 rounded-xl flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)]">
                            <Sparkles className="text-amber-400 w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-900">Servicio.</span>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="font-black text-xs uppercase tracking-widest text-slate-500 hover:text-amber-400 transition-colors">Privacy</a>
                        <a href="#" className="font-black text-xs uppercase tracking-widest text-slate-500 hover:text-amber-400 transition-colors">Terms</a>
                        <a href="#" className="font-black text-xs uppercase tracking-widest text-slate-500 hover:text-amber-400 transition-colors">Support</a>
                    </div>
                    <div className="text-slate-600 font-bold text-sm">© 2024 All Rights Reserved.</div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
