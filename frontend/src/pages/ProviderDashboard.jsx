import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle, MapPin, DollarSign, User, Shield, Briefcase, ChevronRight, Loader2, Activity, TrendingUp, Inbox, ShieldCheck, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const ProviderDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true);
    const [isBlocked, setIsBlocked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== 'provider') {
            navigate('/');
        } else {
            fetchBookings();
            fetchProfile();
        }
    }, [user, navigate]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/auth/me');
            if (res.data.isAvailable !== undefined) {
                setIsAvailable(res.data.isAvailable);
            }
            if (res.data.isBlocked !== undefined) {
                setIsBlocked(res.data.isBlocked);
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await axios.get('/api/bookings');
            setBookings(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch your schedule');
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (bookingId, newStatus, providerStatus = null) => {
        try {
            const payload = {};
            if (newStatus) payload.status = newStatus;
            if (providerStatus) payload.providerStatus = providerStatus;
            
            await axios.put(`/api/bookings/${bookingId}`, payload);
            toast.success(`Job ${providerStatus === 'Accepted' ? 'Accepted' : providerStatus === 'Rejected' ? 'Rejected' : 'Completed'}!`);
            fetchBookings();
        } catch (err) {
            console.error('Error updating status', err);
            toast.error('Failed to update status');
        }
    };

    const toggleAvailability = async () => {
        try {
            const newStatus = !isAvailable;
            setIsAvailable(newStatus);
            await axios.put('/api/users/profile/availability', { isAvailable: newStatus });
            toast.success(newStatus ? 'You are now Online' : 'You are now Offline');
        } catch (err) {
            console.error('Error updating availability', err);
            setIsAvailable(!isAvailable);
            toast.error('Failed to update availability status');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <Briefcase className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 w-8 h-8" />
            </div>
            <p className="mt-8 text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Loading Workspace</p>
        </div>
    );

    if (!user) return null;

    const completedJobs = bookings.filter(b => b.status === 'completed').length;
    const pendingJobs = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;

    const ratedJobs = bookings.filter(b => b.status === 'completed' && b.rating);
    const calculatedTotalRatings = ratedJobs.length;
    const calculatedAverageRating = calculatedTotalRatings > 0 
        ? (ratedJobs.reduce((acc, curr) => acc + curr.rating, 0) / calculatedTotalRatings).toFixed(1) 
        : 0;
    const totalEarnings = bookings.filter(b => b.status === 'completed').reduce((acc, curr) => acc + curr.totalAmount, 0);

    return (
        <div className="min-h-screen bg-[#faf9f6] pb-20 pt-28">
            <Toaster position="bottom-right" />
            
            <div className="container mx-auto px-6 max-w-7xl">
                {isBlocked && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500 text-white p-6 md:p-8 rounded-[2.5rem] mb-12 font-black flex flex-col md:flex-row items-center gap-6 shadow-[0_10px_40px_-10px_rgba(239,68,68,0.5)] border border-red-400 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[4rem] flex items-start justify-end p-4">
                            <Shield className="w-12 h-12 text-white/20" />
                        </div>
                        <div className="w-16 h-16 bg-white text-red-500 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner z-10">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div className="z-10 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl tracking-tight uppercase">Account Suspended</h2>
                            <p className="text-red-100 mt-2 uppercase tracking-[0.2em] text-xs">Your account has been suspended by Servicio.</p>
                        </div>
                    </motion.div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-[2px] bg-blue-500" />
                            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">{user?.name || 'Provider'} Workspace</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">
                            Your <span className="text-blue-600">Schedule.</span>
                        </h1>
                    </motion.div>

                    {/* Availability Toggle */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-6 rounded-[2rem] border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-8"
                    >
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status Protocol</p>
                            <p className={`text-sm font-black uppercase tracking-widest transition-colors ${isAvailable ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {isAvailable ? 'Receiving Jobs' : 'Offline / Away'}
                            </p>
                        </div>
                        <button 
                            onClick={toggleAvailability}
                            className={`w-24 h-12 rounded-full p-1.5 transition-all duration-500 ease-in-out shadow-inner flex items-center ${isAvailable ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-slate-200'}`}
                        >
                            <div className={`w-9 h-9 bg-white rounded-full shadow-md transition-transform duration-500 ease-in-out ${isAvailable ? 'translate-x-12' : 'translate-x-0'}`} />
                        </button>
                    </motion.div>
                </div>

                {error && (
                    <div className="bg-rose-50 text-rose-600 p-6 rounded-3xl mb-8 font-bold flex items-center gap-4 border border-rose-100">
                        <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                            <Shield className="w-5 h-5" />
                        </div>
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                    
                    {/* Main Feed (Left Side) */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-3 mb-8 px-2">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                                <Briefcase className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assigned Jobs</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Manage your dispatch</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {bookings.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className="glass-card rounded-[3rem] p-16 md:p-24 text-center border-dashed border-2 border-stone-200 bg-stone-50/50"
                                >
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
                                        <Calendar className="text-slate-300 w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">No Active Assignments</h3>
                                    <p className="text-slate-500 font-bold text-sm max-w-sm mx-auto">Standby for incoming dispatch from the central system.</p>
                                </motion.div>
                            ) : (
                                <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-stone-200/60 hover:border-amber-200 transition-all duration-300 space-y-6 max-h-[800px] overflow-y-auto">
                                    {[...bookings].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).map((booking, idx) => (
                                        <motion.div 
                                            key={booking._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-8 border-b border-stone-100">
                                            <div>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                                        booking.providerStatus === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        booking.providerStatus === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                        booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                        'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                        {booking.providerStatus === 'Pending' ? 'Action Required' : 
                                                         booking.providerStatus === 'Rejected' ? 'Rejected' : booking.status}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: #{booking._id.substring(0, 6)}</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{booking.service?.title || booking.service?.name || 'Service Unlisted'}</h3>
                                            </div>
                                            <div className="text-left md:text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pay</p>
                                                <p className="text-3xl font-black text-slate-900">₹{booking.totalAmount}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-stone-100">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Scheduled Date</p>
                                                        <p className="font-black text-slate-900 text-sm">{new Date(booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-stone-100">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Time Slot</p>
                                                        <p className="font-black text-slate-900 text-sm">{booking.timeSlot}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-stone-100">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Customer Name</p>
                                                        <p className="font-black text-slate-900 text-sm">{booking.user?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-stone-100">
                                                        <MapPin className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                                                        <p className="font-black text-slate-900 text-sm line-clamp-1">{booking.address?.street}, {booking.address?.city}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {booking.providerStatus === 'Pending' ? (
                                            <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row justify-end gap-4">
                                                <button 
                                                    onClick={() => handleUpdateStatus(booking._id, 'pending', 'Rejected')}
                                                    className="w-full sm:w-auto px-8 py-4 bg-white border border-stone-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-rose-200 hover:text-rose-600 transition-all text-center"
                                                >
                                                    Reject Assignment
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdateStatus(booking._id, 'confirmed', 'Accepted')}
                                                    className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Accept Job
                                                </button>
                                            </div>
                                        ) : booking.providerStatus === 'Accepted' && booking.status !== 'completed' && booking.status !== 'cancelled' ? (
                                            <div className="pt-6 border-t border-stone-100 flex justify-end">
                                                <button 
                                                    onClick={() => handleUpdateStatus(booking._id, 'completed')}
                                                    className="w-full sm:w-auto px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Mark as Completed
                                                </button>
                                            </div>
                                        ) : booking.status === 'completed' && booking.rating ? (
                                            <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Feedback</p>
                                                <div className="flex items-center gap-1 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < booking.rating ? 'text-amber-500 fill-amber-500' : 'text-amber-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Stats (Right Side) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Primary Stat Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px]" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px]" />
                            
                            <div className="relative z-10 flex items-center gap-4 mb-10 pb-8 border-b border-white/10">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight">Performance</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Ledger</p>
                                </div>
                            </div>
                            
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <DollarSign className="w-3 h-3 text-emerald-400" /> Revenue Generated
                                    </p>
                                    <p className="text-5xl font-black text-white">₹{totalEarnings}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Completed</p>
                                        <p className="text-3xl font-black text-white">{completedJobs}</p>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 backdrop-blur-sm">
                                        <p className="text-blue-300 text-[9px] font-black uppercase tracking-widest mb-1">In Queue</p>
                                        <p className="text-3xl font-black text-blue-400">{pendingJobs}</p>
                                    </div>
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-amber-300 text-[9px] font-black uppercase tracking-widest mb-1">Provider Rating</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-3xl font-black text-amber-400">{calculatedAverageRating}</p>
                                            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Based on</p>
                                        <p className="font-black text-white">{calculatedTotalRatings} reviews</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Tips or Info */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white p-8 rounded-[3rem] border border-stone-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="w-5 h-5 text-blue-500" />
                                <h3 className="font-black text-slate-900">Provider Guidelines</h3>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                                    <span className="text-slate-600 font-bold">Accept dispatch quickly to secure the assigned payload.</span>
                                </li>
                                <li className="flex gap-3 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                                    <span className="text-slate-600 font-bold">Always verify customer coordinates upon arrival.</span>
                                </li>
                                <li className="flex gap-3 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                    <span className="text-slate-600 font-bold">Mark jobs as completed immediately for prompt settlements.</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
