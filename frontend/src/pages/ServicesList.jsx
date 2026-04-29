import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Filter, Grid, List, Search, SlidersHorizontal, ChevronRight, Sparkles, LayoutGrid, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceCard from '../components/ServiceCard';
import { Toaster } from 'react-hot-toast';

const ServicesList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [filterCategory, setFilterCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('Featured');
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Rating'];

    const categories = ['All', 'Plumber', 'Electrician', 'AC Repair', 'Cleaning', 'Carpentry', 'Salon', 'Painting'];

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const cat = queryParams.get('category');
        const q = queryParams.get('q');
        
        if (cat) setFilterCategory(cat);
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
        return matchesCategory && matchesSearch;
    });

    if (sortBy === 'Price: Low to High') {
        filteredServices.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
        filteredServices.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Rating') {
        filteredServices.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return (
        <div className="bg-[#faf9f6] min-h-screen pb-20">
            <Toaster position="bottom-right" />
            
            {/* Header Section */}
            <div className="bg-[#faf9f6] pt-32 pb-20 overflow-hidden relative border-b border-stone-200">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-amber-600/20 rounded-full blur-[120px]" />
                    <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
                </div>
                
                <div className="container mx-auto px-6 lg:px-12 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-stone-200 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)]">
                                <Sparkles className="text-amber-400 w-5 h-5" />
                            </div>
                            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Premium Marketplace</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
                            Find The Best <br />
                            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-400 font-display">Services.</span>
                        </h1>
                        <div className="flex items-center gap-4 text-slate-500 font-bold">
                            <div className="flex -space-x-3">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-white" />
                                ))}
                            </div>
                            <p className="text-sm">Trusted by 2,500+ satisfied customers</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
                    
                    {/* Sidebar / Filters */}
                    <aside className="lg:w-64 xl:w-72 shrink-0">
                        <div className="bg-white/80 backdrop-blur-xl border border-stone-200 p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] sticky top-32">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3 text-slate-900">
                                    <Filter className="w-5 h-5 text-amber-500" />
                                    <h2 className="font-black text-xl tracking-tight">Catalog</h2>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-4">Categories</p>
                                {categories.map(cat => (
                                    <button 
                                        key={cat} 
                                        onClick={() => setFilterCategory(cat)}
                                        className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl text-sm font-black transition-all group ${
                                            (filterCategory === cat || (cat === 'All' && filterCategory === '')) 
                                            ? 'bg-amber-600 text-slate-900 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)]' 
                                            : 'text-slate-500 hover:bg-white hover:text-amber-400'
                                        }`}
                                    >
                                        <span>{cat}</span>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${ (filterCategory === cat || (cat === 'All' && filterCategory === '')) ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                                    </button>
                                ))}
                            </div>

                            <div className="mt-12 pt-12 border-t border-stone-200">
                                <div className="bg-white border border-stone-200 rounded-3xl p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                    <p className="text-slate-900 font-black text-lg mb-2 relative z-10">Premium Member?</p>
                                    <p className="text-slate-500 text-xs font-bold mb-4 relative z-10 leading-relaxed">Save up to 40% on all professional services.</p>
                                    <button className="w-full py-3 bg-amber-600 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest relative z-10 hover:bg-amber-500 transition-colors shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)]">Upgrade Now</button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-grow">
                        {/* Control Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-4 rounded-[2rem] border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                            <div className="flex items-center gap-4 px-2">
                                <div className="w-1.5 h-10 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                        {filterCategory === 'All' || !filterCategory ? 'Showing All' : `Hiring ${filterCategory}s`}
                                    </h3>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                        {filteredServices.length} Results Found
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex bg-white p-1 rounded-xl border border-stone-200">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-amber-400 shadow-sm border border-stone-200' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <LayoutGrid className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-amber-400 shadow-sm border border-stone-200' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <LayoutList className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />
                                <div className="relative z-20">
                                    <button 
                                        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 font-black text-[10px] uppercase tracking-widest text-slate-700 hover:border-amber-500 hover:text-amber-400 transition-all bg-white"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" /> Sort: {sortBy}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isSortDropdownOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] overflow-hidden"
                                            >
                                                {sortOptions.map(option => (
                                                    <button
                                                        key={option}
                                                        onClick={() => { setSortBy(option); setIsSortDropdownOpen(false); }}
                                                        className={`w-full text-left px-4 py-3 text-xs font-black transition-colors ${sortBy === option ? 'bg-amber-600/20 text-amber-400' : 'text-slate-700 hover:bg-white/5'}`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Services Content */}
                        <div className="min-h-[60vh]">
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {[1, 2, 3, 4, 5, 6].map(n => (
                                        <div key={n} className="bg-white rounded-[3rem] h-[420px] animate-pulse border border-stone-200 shadow-sm" />
                                    ))}
                                </div>
                            ) : filteredServices.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-32 bg-white rounded-[3.5rem] border border-dashed border-stone-200"
                                >
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 transition-transform hover:rotate-12 border border-stone-200">
                                        <Search className="w-10 h-10 text-amber-500" />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-4">No Matches Found</h3>
                                    <p className="text-slate-500 font-bold mb-10 max-w-sm mx-auto">We couldn't find any services matching your criteria. Try adjusting your filters.</p>
                                    <button 
                                        onClick={() => {setFilterCategory(''); setSearchQuery('');}}
                                        className="relative overflow-hidden px-10 py-4 rounded-full font-black transition-all active:scale-95 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] bg-amber-600 text-slate-900 hover:bg-amber-500 flex items-center justify-center gap-2 mx-auto"
                                    >
                                        Clear and reset all filters
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    layout
                                    className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
                                >
                                    <AnimatePresence mode="popLayout">
                                        {filteredServices.map(service => (
                                            <motion.div
                                                key={service._id}
                                                layout
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                            >
                                                <ServiceCard service={service} variant={viewMode} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ServicesList;
