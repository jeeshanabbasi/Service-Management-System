import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, CheckCircle, Clock, XCircle, 
    LayoutDashboard, Package, Plus, User, 
    ArrowUpRight, AlertCircle, Loader2, ChevronRight,
    TrendingUp, Activity, Inbox, ShieldCheck,
    CreditCard, MoreVertical, DollarSign, Star
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const Dashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratingModal, setRatingModal] = useState({ open: false, bookingId: null, value: 0 });

    const handleRate = async (bookingId, rating) => {
        try {
            await axios.post(`/api/bookings/${bookingId}/rate`, { rating });
            toast.success('Thank you for your feedback!');
            setRatingModal({ open: false, bookingId: null, value: 0 });
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to submit rating');
        }
    };

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        } else if (user) {
            fetchData();
        }
    }, [user, authLoading, navigate]);

    const fetchData = async () => {
        try {
            const resBookings = await axios.get('/api/bookings');
            setBookings(resBookings.data);

            if (user.role === 'provider' || user.role === 'admin') {
                const resServices = await axios.get('/api/services');
                if (user.role === 'provider') {
                    setServices(resServices.data.filter(s => s.provider?._id === user._id));
                } else {
                    setServices(resServices.data);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-600 w-8 h-8" />
            </div>
            <p className="mt-8 text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Synchronizing Workspace</p>
        </div>
    );

    if (!user) return null;

    const stats = [
        { label: 'Total Activity', value: bookings.length, icon: Activity, trend: '+12%', color: 'text-slate-700', bg: 'bg-white border border-stone-200' },
        { label: 'Pending Request', value: bookings.filter(b => b.status === 'pending').length, icon: Clock, trend: 'New', color: 'text-slate-700', bg: 'bg-white border border-stone-200' },
        { label: 'Success Rate', value: '98%', icon: ShieldCheck, trend: 'Optimal', color: 'text-slate-700', bg: 'bg-white border border-stone-200' },
    ];

    return (
        <div className="min-h-screen bg-[#faf9f6] pb-20 pt-28">
            <Toaster position="bottom-right" />
            
            <AnimatePresence>
                {ratingModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl"
                        >
                            <h3 className="text-xl font-black text-slate-900 mb-2 text-center">Rate the Service</h3>
                            <p className="text-sm font-bold text-slate-500 mb-8 text-center">How was your experience with the professional?</p>
                            
                            <div className="flex justify-center gap-2 mb-8">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button 
                                        key={star}
                                        onClick={() => setRatingModal(prev => ({ ...prev, value: star }))}
                                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <Star 
                                            className={`w-10 h-10 ${ratingModal.value >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} transition-colors`} 
                                        />
                                    </button>
                                ))}
                            </div>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setRatingModal({ open: false, bookingId: null, value: 0 })}
                                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleRate(ratingModal.bookingId, ratingModal.value)}
                                    disabled={!ratingModal.value}
                                    className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Submit
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-[2px] bg-amber-500" />
                            <span className="text-amber-600 font-black text-[10px] uppercase tracking-[0.3em]">{user.role} workspace</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">
                            Control <span className="text-slate-400 font-normal italic serif">Center.</span>
                        </h1>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <button onClick={() => navigate('/services')} className="btn-gold flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Book New
                        </button>
                    </motion.div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {stats.map((stat, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group hover:shadow-xl hover:border-slate-300 transition-all duration-300 bg-white"
                        >
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="px-2 py-1 rounded-md text-[9px] font-black text-slate-500 bg-slate-50 border border-slate-100 uppercase">
                                        {stat.trend}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                    {/* Sidebar - Profile & Invoices (Left side now) */}
                    <div className="lg:col-span-4 space-y-8 order-1">
                        <div className="glass-card p-10 md:p-12 rounded-[3rem] text-center relative overflow-hidden group border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500 bg-white">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-900" />
                            <div className="absolute -top-20 -left-20 w-48 h-48 bg-slate-50 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
                            
                            <div className="relative w-28 h-28 mx-auto mb-8">
                                <div className="absolute inset-0 bg-slate-900/5 rounded-full animate-pulse" />
                                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-xl">
                                    <User className="text-white w-12 h-12" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-[3px] border-white rounded-full flex items-center justify-center shadow-lg">
                                    <ShieldCheck className="text-white w-4 h-4" />
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">{user?.name || user?.firstName}</h3>
                            <p className="text-slate-500 font-bold mb-8 text-xs">{user.email}</p>
                            
                            <div className="space-y-3">
                                <button className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">Edit Profile</button>
                                <button className="w-full py-3.5 bg-white border border-stone-200 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm">Account Settings</button>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="glass-card p-8 rounded-[3rem] border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 bg-white">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Invoices</h3>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-stone-100">
                                    <CreditCard className="text-slate-400 w-4 h-4" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {bookings.slice(0, 3).map(b => (
                                    <div key={b._id} className="flex items-center justify-between group cursor-pointer p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-stone-100 -mx-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100/50 group-hover:scale-105 transition-transform">
                                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">INV-{b._id.slice(-5)}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(b.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="font-black text-slate-900 text-sm">₹{b.totalAmount}</span>
                                    </div>
                                ))}
                                {bookings.length === 0 && <p className="text-xs font-bold text-slate-400 text-center py-4">No invoices yet</p>}
                            </div>
                        </div>
                    </div>

                    {/* Main Feed (Right side now) */}
                    <div className="lg:col-span-8 order-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                                    <Activity className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Activity Feed</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Real-time Updates</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {bookings.length === 0 ? (
                                <div className="glass-card rounded-[3rem] p-16 md:p-24 text-center border-dashed border-2 border-stone-200 bg-stone-50/50">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <Inbox className="text-slate-300 w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Schedule is Clear</h3>
                                    <p className="text-slate-500 font-bold text-sm max-w-sm mx-auto">No upcoming activities or past records found in your ledger.</p>
                                </div>
                            ) : (
                                <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-stone-200/60 hover:border-amber-200 transition-all duration-300 space-y-6 max-h-[800px] overflow-y-auto">
                                    {[...bookings].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).map((booking, idx) => (
                                        <motion.div 
                                            key={booking._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-stone-200/60 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-slate-300 transition-all duration-300 group"
                                    >
                                        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 xl:gap-8">
                                            
                                            {/* Service Info */}
                                            <div className="flex gap-5 items-center w-full xl:w-auto">
                                                <div className="w-16 h-16 md:w-20 md:h-20 bg-stone-50 rounded-[1.25rem] flex items-center justify-center border border-stone-100 group-hover:scale-105 transition-transform overflow-hidden shrink-0 shadow-inner">
                                                    {booking.service?.image ? (
                                                        <img src={booking.service.image} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <Package className="text-slate-300 w-6 h-6" />
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-black text-lg md:text-xl text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors line-clamp-1">{booking.service?.title || 'Custom Service'}</h4>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-1.5">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                                            {new Date(booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 md:pl-6 border-l border-stone-200">
                                                            <Clock className="w-3.5 h-3.5 text-slate-300" />
                                                            {booking.timeSlot}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status and Fee */}
                                            <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between w-full xl:w-auto gap-4 pt-5 xl:pt-0 border-t xl:border-t-0 border-stone-100 mt-2 xl:mt-0">
                                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                                    booking.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    booking.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    'bg-slate-50 text-slate-600 border-slate-200'
                                                }`}>
                                                    {booking.status}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-slate-900">₹{booking.totalAmount}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Provider Acceptance Block */}
                                        <AnimatePresence>
                                            {booking.providerStatus === 'Accepted' && booking.provider && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                                    className="p-5 bg-stone-50 border border-stone-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 overflow-hidden shadow-sm"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200/50">
                                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Assigned Professional</p>
                                                            <p className="text-[11px] text-slate-500 font-bold mt-0.5">Your provider has accepted the request.</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                                        <div className="flex items-center gap-6 bg-white p-3 rounded-xl border border-stone-200 shadow-sm w-full md:w-max">
                                                            <div className="flex items-center gap-3 pr-6 border-r border-stone-100">
                                                                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center shrink-0">
                                                                    <User className="w-4 h-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Provider</p>
                                                                    <p className="text-xs font-black text-slate-900 line-clamp-1 max-w-[120px]">{booking.provider.name || `${booking.provider.firstName || ''} ${booking.provider.lastName || ''}`}</p>
                                                                </div>
                                                            </div>
                                                            <div className="pr-2">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact</p>
                                                                <p className="text-xs font-black text-slate-900">{booking.provider.phone || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        {booking.status === 'completed' && (
                                                            <div className="flex items-center justify-center bg-white p-3 rounded-xl border border-stone-200 shadow-sm w-full md:w-auto px-6">
                                                                {booking.rating ? (
                                                                    <div className="flex flex-col items-center justify-center gap-1">
                                                                        <div className="flex items-center gap-1">
                                                                            {[...Array(5)].map((_, i) => (
                                                                                <Star key={i} className={`w-4 h-4 ${i < booking.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                                                            ))}
                                                                        </div>
                                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Your Rating</span>
                                                                    </div>
                                                                ) : (
                                                                    <button 
                                                                        onClick={() => setRatingModal({ open: true, bookingId: booking._id, value: 0 })}
                                                                        className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-colors"
                                                                    >
                                                                        <Star className="w-4 h-4" /> Rate Service
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
