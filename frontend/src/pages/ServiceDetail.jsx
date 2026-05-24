import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, Clock, ArrowLeft, ShoppingBag, Check, ShieldCheck, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cart, addToCart } = React.useContext(CartContext);
    const { user } = React.useContext(AuthContext);
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchService();
    }, [id]);

    const fetchService = async () => {
        try {
            const res = await axios.get(`/api/services/${id}`);
            setService(res.data);
        } catch (error) {
            console.error('Error fetching service:', error);
            toast.error('Service not found');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addToCart(service);
    };

    const isAdded = cart.some(item => item._id === service?._id);
    const isOwnService = user && service?.provider && (
        (typeof service.provider === 'string' ? service.provider : service.provider._id) === user._id
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
                <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
            </div>
        );
    }

    if (!service) return null;

    return (
        <div className="bg-[#faf9f6] min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-8 px-6 py-3 bg-white border border-stone-200 rounded-full text-slate-700 hover:bg-white hover:text-slate-900 transition-all inline-flex items-center font-black text-xs uppercase tracking-widest gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Services
                </button>

                <div className="bg-white rounded-[3rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] transition-shadow duration-500 border border-stone-200 flex flex-col lg:flex-row overflow-hidden relative">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

                    {/* Left Image */}
                    <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full border-r border-stone-200">
                        <img 
                            src={service.image || '/images/default.png'} 
                            alt={service.title} 
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/50 to-transparent" />
                    </div>

                    {/* Right Details */}
                    <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col relative z-10">
                        <div className="flex-grow">
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className="px-4 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                    {service.category}
                                </span>
                                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span className="text-xs font-black text-amber-400">{service.rating || '4.8'}</span>
                                </div>
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-amber-500" /> Mumbai
                                </span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                                {service.title}
                            </h1>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                                {service.description}
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-12">
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-stone-200">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Guarantee</p>
                                        <p className="font-black text-slate-900 leading-tight">Service<br/>Warranty</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-stone-200">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                        <Award className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Quality</p>
                                        <p className="font-black text-slate-900 leading-tight">Verified<br/>Experts</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Panel */}
                        <div className="bg-white rounded-[2rem] p-8 border border-stone-200 mt-auto shadow-inner">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                                <div>
                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">Premium Rate</span>
                                    <span className="text-5xl font-black text-amber-400 leading-none tracking-tighter">
                                        ₹{service.price}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                                    <Clock className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Duration</p>
                                        <p className="font-black text-slate-900 leading-none">45-60 Mins</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {isOwnService ? (
                                    <div className="flex-grow py-5 bg-stone-100 text-slate-500 rounded-[1.5rem] font-black text-sm uppercase tracking-widest text-center border border-stone-200">
                                        Your Own Service
                                    </div>
                                ) : (
                                    <>
                                        <button 
                                            className="flex-grow py-5 bg-amber-600 text-slate-900 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] hover:bg-amber-500 transition-colors"
                                        >
                                            Book Now
                                        </button>
                                        
                                        <button 
                                            onClick={handleAddToCart}
                                            className={`py-5 px-8 rounded-[1.5rem] font-black text-sm uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${
                                                isAdded 
                                                ? 'bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                                                : 'bg-white border-stone-200 text-amber-500 hover:border-amber-500 hover:text-slate-900 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] hover:bg-amber-600/20'
                                            }`}
                                        >
                                            {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
