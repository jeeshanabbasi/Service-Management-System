import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Search, Zap, Droplets, Snowflake, PaintRoller, PenTool, LayoutGrid, LayoutList, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceCard from '../components/ServiceCard';
import { Toaster } from 'react-hot-toast';

const ServicesList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [maxPrice, setMaxPrice] = useState(500);
    const [minRating, setMinRating] = useState(0);

    const categories = [
        { name: 'Electrical', icon: Zap, color: 'bg-indigo-600' },
        { name: 'Cleaning', icon: Droplets, color: 'bg-transparent' },
        { name: 'Plumbing', icon: PenTool, color: 'bg-transparent' },
        { name: 'HVAC', icon: Snowflake, color: 'bg-transparent' },
        { name: 'Renovation', icon: PaintRoller, color: 'bg-transparent' }
    ];

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const cat = queryParams.get('category');
        const q = queryParams.get('q');
        
        if (cat) {
            setFilterCategory(cat);
        } else if (q) {
            setFilterCategory('All');
        } else if (!filterCategory || filterCategory === 'All') {
             // Keep current or set to Electrical if we want a default
             // I'll set to 'All' so users see all services by default if they just visit /services
             setFilterCategory('All');
        }
        
        setSearchQuery(q || '');
        fetchServices();
    }, [location]);

    const fetchServices = async () => {
        try {
            const res = await axios.get('/api/services');
            setServices(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    let filteredServices = services.filter(service => {
        const matchesCategory = !filterCategory || filterCategory === 'All' || 
            service.category.toLowerCase() === filterCategory.toLowerCase();
        const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            service.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = maxPrice === 500 ? true : service.price <= maxPrice;
        const matchesRating = minRating === 0 ? true : (service.rating || 4.8) >= minRating;
        return matchesCategory && matchesSearch && matchesPrice && matchesRating;
    });

    return (
        <div className="bg-[#151515] min-h-screen text-white pt-24 pb-20 font-sans selection:bg-amber-500/30 selection:text-amber-200">
            <Toaster position="bottom-right" />

            <div className="w-full max-w-[1600px] mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Sidebar / Filters */}
                    <aside className="lg:w-64 shrink-0 flex flex-col gap-8">
                        
                        {/* Categories Box */}
                        <div className="bg-[#1c1c1c] border border-white/5 p-6 rounded-2xl">
                            <h2 className="text-amber-500 font-bold text-lg mb-6">Categories</h2>
                            <div className="space-y-2">
                                <button 
                                    onClick={() => setFilterCategory('All')}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                        filterCategory === 'All'
                                        ? 'bg-indigo-600 text-white' 
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                    All Categories
                                </button>
                                {categories.map(cat => {
                                    const isActive = filterCategory.toLowerCase() === cat.name.toLowerCase();
                                    return (
                                        <button 
                                            key={cat.name} 
                                            onClick={() => setFilterCategory(cat.name)}
                                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                                isActive 
                                                ? 'bg-indigo-600 text-white' 
                                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                            }`}
                                        >
                                            <cat.icon className="w-4 h-4" />
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Filters Box */}
                        <div className="bg-[#1c1c1c] border border-white/5 p-6 rounded-2xl">
                            <h2 className="text-amber-500 font-bold text-lg mb-6">Filters</h2>
                            
                            {/* Price Range */}
                            <div className="mb-8">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Max Price: ${maxPrice === 500 ? '500+' : maxPrice}</p>
                                <input 
                                    type="range" 
                                    min="10" 
                                    max="500" 
                                    value={maxPrice} 
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-full accent-amber-500 bg-slate-700 h-1 rounded-full outline-none"
                                />
                                <div className="flex items-center justify-between text-xs text-slate-400 font-medium mt-4">
                                    <span>$10</span>
                                    <span>$500+</span>
                                </div>
                            </div>

                            {/* Minimum Rating */}
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Minimum Rating</p>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${minRating === 4.5 ? 'bg-amber-500 border-amber-500' : 'bg-[#151515] border-white/20 group-hover:border-amber-500'}`}>
                                            {minRating === 4.5 && <Check className="w-3 h-3 text-slate-900" />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={minRating === 4.5} onChange={() => setMinRating(minRating === 4.5 ? 0 : 4.5)} />
                                        <span className="text-sm text-slate-300 font-medium">4.5+ Stars</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-4 h-4 rounded border border-white/20 bg-[#151515] flex items-center justify-center group-hover:border-amber-500 transition-colors">
                                        </div>
                                        <input type="checkbox" className="hidden" />
                                        <span className="text-sm text-slate-300 font-medium opacity-50">Top Pro Status (Coming Soon)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-grow">
                        {/* Header & Controls */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">Professional Services</h1>
                                <p className="text-slate-400 text-sm font-medium">Elite certified technicians at your command.</p>
                            </div>

                            <div className="flex bg-[#1c1c1c] border border-white/5 rounded-lg p-1">
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                        viewMode === 'grid' ? 'bg-[#f3a953] text-slate-900' : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Grid
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                        viewMode === 'list' ? 'bg-[#f3a953] text-slate-900' : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    List
                                </button>
                            </div>
                        </div>

                        {/* Services Grid */}
                        <div>
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(n => (
                                        <div key={n} className="bg-[#1c1c1c] border border-white/5 rounded-2xl h-[400px] animate-pulse" />
                                    ))}
                                </div>
                            ) : filteredServices.length === 0 ? (
                                <div className="text-center py-32 bg-[#1c1c1c] border border-white/5 rounded-2xl">
                                    <div className="w-20 h-20 bg-[#151515] rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">No Services Found</h3>
                                    <p className="text-slate-400 max-w-sm mx-auto mb-8">Try selecting a different category or adjusting your search filters.</p>
                                    <button 
                                        onClick={() => {setFilterCategory('All'); setSearchQuery('');}}
                                        className="px-8 py-3 bg-[#f3a953] text-slate-900 font-bold rounded-lg"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            ) : (
                                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                    <AnimatePresence mode="popLayout">
                                        {filteredServices.map(service => (
                                            <motion.div
                                                key={service._id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <ServiceCard service={service} variant={viewMode} />
                                            </motion.div>
                                        ))}

                                        {/* Promo Box */}
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-[#ffa500] rounded-2xl p-8 flex flex-col items-start relative overflow-hidden group shadow-lg"
                                        >
                                            {/* Thunder Icon in top right */}
                                            <div className="absolute top-6 right-6 opacity-40 group-hover:scale-110 transition-transform">
                                                <Zap className="w-12 h-12 text-[#b37300] fill-[#b37300]" />
                                            </div>
                                            
                                            <div className="mt-auto pt-24">
                                                <h2 className="text-[#5a3a00] text-5xl font-black leading-none mb-4 tracking-tighter">
                                                    50%<br/>OFF
                                                </h2>
                                                <h3 className="text-[#734a00] font-bold text-lg mb-2">First HVAC Service</h3>
                                                <p className="text-[#8c5a00] text-sm font-medium mb-8 leading-relaxed max-w-[200px]">
                                                    Limited time offer for new premium members.
                                                </p>
                                                <button className="px-6 py-3 bg-[#4d3100] hover:bg-[#332100] text-amber-500 text-sm font-bold rounded-full transition-colors">
                                                    Claim Offer
                                                </button>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
            
            {/* Footer matching home page */}
            <footer className="mt-20 border-t border-white/5 py-8">
                <div className="container mx-auto max-w-[1600px] px-6 flex flex-col md:flex-row justify-between items-center gap-6">
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
                </div>
            </footer>
        </div>
    );
};

export default ServicesList;
