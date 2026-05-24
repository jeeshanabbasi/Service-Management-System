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
            image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2000',
            title: 'Elite Plumbing Solutions',
            subtitle: 'THE GOLD STANDARD OF REPAIR',
            description: 'Book verified expert plumbers for luxury home maintenance and emergency repairs.',
        },
        {
            image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=2000',
            title: 'Masterful Home Cleaning',
            subtitle: 'PURITY IN EVERY CORNER',
            description: 'Experience pristine living with our professional, white-glove cleaning services.',
        },
        {
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=2000',
            title: 'Luxury Wellness & Style',
            subtitle: 'SALON AT YOUR DOORSTEP',
            description: 'Premium stylists and wellness experts dedicated to your personal care.',
        },
        {
            image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=2000',
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
        <div className="bg-[#e5e7eb] min-h-screen selection:bg-amber-500/30 selection:text-slate-900 flex justify-center">
            <Toaster position="bottom-right" />
            <div className="w-full max-w-[1600px] relative bg-[#faf9f6] shadow-2xl overflow-hidden border-x border-stone-200/50">
            
            {/* Hero Banner Section */}
            <div className="relative min-h-[850px] max-h-[1200px] h-[100vh] w-full overflow-hidden bg-slate-900">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        {/* Background Image with Parallax-like effect */}
                        <motion.div 
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 10, ease: "linear" }}
                            className="absolute inset-0 bg-cover bg-center brightness-[1.05]"
                            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f6] via-[#faf9f6]/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent" />
                        </motion.div>

                        {/* Hero Content */}
                        <div className="relative h-full container mx-auto px-6 flex items-center pt-20 pb-8">
                            <div className="max-w-3xl">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-3 mb-4"
                                >
                                    <span className="w-10 h-[1px] bg-amber-500/50" />
                                    <span className="text-amber-600 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em]">
                                        {slides[currentSlide].subtitle}
                                    </span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-6xl md:text-8xl lg:text-[7.5rem] font-black text-slate-900 leading-[0.9] tracking-[-0.03em] mb-6"
                                >
                                    {slides[currentSlide].title.split(' ').map((word, i) => (
                                        <span key={i} className="block last:text-slate-500/80 last:font-medium last:italic last:serif mix-blend-multiply">
                                            {word}
                                        </span>
                                    ))}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="text-lg md:text-xl text-slate-600 font-medium max-w-xl leading-relaxed mb-8"
                                >
                                    {slides[currentSlide].description}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="flex flex-wrap items-center gap-6"
                                >
                                    <button
                                        onClick={() => navigate('/services')}
                                        className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/20"
                                    >
                                        <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <span className="relative z-10 flex items-center gap-2 group-hover:text-slate-900">
                                            Book Appointment <ArrowRight className="w-5 h-5" />
                                        </span>
                                    </button>
                                    
                                    <div className="flex -space-x-4">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-xl">
                                                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                                            </div>
                                        ))}
                                        <div className="w-12 h-12 rounded-full border-4 border-white bg-amber-100 flex items-center justify-center shadow-xl">
                                            <span className="text-[10px] font-black text-amber-700">+2k</span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-400">Trusted by <span className="text-slate-900">2,000+</span> happy families</p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Vertical Progress Indicators */}
                <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-20">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className="group flex items-center gap-4 text-right"
                        >
                            <span className={`text-[10px] font-black transition-all duration-500 ${i === currentSlide ? 'text-slate-900 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}>
                                0{i + 1}
                            </span>
                            <div className={`w-1 transition-all duration-700 rounded-full ${
                                i === currentSlide ? 'h-12 bg-amber-500' : 'h-4 bg-slate-200 group-hover:bg-slate-400'
                            }`} />
                        </button>
                    ))}
                </div>

                {/* Navigation Arrows */}
                <div className="absolute bottom-12 right-12 flex gap-4 z-20 opacity-0 md:opacity-100">
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="p-4 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-slate-900 hover:bg-white/40 transition-all hover:scale-110"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                        className="p-4 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-slate-900 hover:bg-white/40 transition-all hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Popular Services Section */}
            <div className="container mx-auto px-6 pt-12 pb-24 relative">
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
                
                <div className="relative z-10 w-[100vw] ml-[calc(50%-50vw)] overflow-hidden py-10 mt-8 group">
                    <div className="flex w-max animate-marquee">
                        {[
                            { name: 'AC Servicing', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Deep Cleaning', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Spa & Salon', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Smart Home', img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Home Interior', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Office Setup', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Quick Repairs', img: 'https://images.unsplash.com/photo-1527515637-60e0a3dcfa77?auto=format&fit=crop&q=80&w=600' },
                            { name: 'AC Servicing', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Deep Cleaning', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Spa & Salon', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Smart Home', img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Home Interior', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Office Setup', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Quick Repairs', img: 'https://images.unsplash.com/photo-1527515637-60e0a3dcfa77?auto=format&fit=crop&q=80&w=600' }
                        ].map((service, i) => (
                            <div key={i} className="flex-none w-64 md:w-80 mx-4 md:mx-6 flex flex-col items-center gap-4">
                                <div className="w-full h-40 md:h-56 rounded-[2rem] overflow-hidden shadow-xl shadow-stone-200 border border-stone-100 bg-white">
                                    <img src={service.img} alt={service.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 opacity-90 hover:opacity-100" />
                                </div>
                                <h4 className="text-sm md:text-lg font-black text-slate-900 tracking-widest uppercase">{service.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
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
                                bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
                                glow: 'hover:shadow-[0_20px_50px_rgba(249,115,22,0.4)]',
                                border: 'border-orange-400/30'
                            },
                            { 
                                icon: Shield, 
                                title: 'Ultimate Security', 
                                desc: 'Every service is backed by our $1M protection plan and rigorous background verification.',
                                bg: 'bg-gradient-to-br from-blue-600 to-indigo-600',
                                glow: 'hover:shadow-[0_20px_50px_rgba(79,70,229,0.4)]',
                                border: 'border-indigo-400/30'
                            },
                            { 
                                icon: Sparkles, 
                                title: 'Precision Match', 
                                desc: 'Our proprietary AI ensures you are paired with the most qualified expert for your specific needs.',
                                bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
                                glow: 'hover:shadow-[0_20px_50px_rgba(16,185,129,0.4)]',
                                border: 'border-teal-400/30'
                            }
                        ].map((prop, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                className={`p-12 rounded-[3.5rem] relative group hover:-translate-y-4 transition-all duration-500 ${prop.bg} ${prop.glow} border ${prop.border} overflow-hidden shadow-xl`}
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
                                
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-10 shadow-inner border border-white/20 relative z-10 group-hover:scale-110 transition-transform duration-500">
                                    <prop.icon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="font-black text-3xl mb-6 text-white relative z-10 tracking-tight">{prop.title}</h3>
                                <p className="text-white/90 text-lg font-medium leading-relaxed relative z-10">{prop.desc}</p>
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
        </div>
    );
};

export default Home;
