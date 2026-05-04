import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, MapPin, DollarSign, User, Shield, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const ProviderDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true);
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
            setIsAvailable(res.data.isAvailable !== false); // default to true if undefined
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
            fetchBookings();
        } catch (err) {
            console.error('Error updating status', err);
            alert('Failed to update status');
        }
    };

    const toggleAvailability = async () => {
        try {
            const newStatus = !isAvailable;
            setIsAvailable(newStatus); // Optimistic update
            await axios.put('/api/users/profile/availability', { isAvailable: newStatus });
        } catch (err) {
            console.error('Error updating availability', err);
            setIsAvailable(!isAvailable); // Revert on failure
            alert('Failed to update availability status');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-100/40 rounded-full blur-[140px] animate-pulse-subtle" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-amber-50/50 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
                                <Briefcase className="text-blue-600 w-5 h-5" />
                            </div>
                            <span className="text-sm font-black text-blue-600 uppercase tracking-widest">Provider Workspace</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Your <span className="text-blue-600">Schedule.</span>
                        </h1>
                    </div>

                    {/* Availability Toggle */}
                    <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6">
                        <div>
                            <p className="text-sm font-black text-slate-900">Current Status</p>
                            <p className={`text-xs font-bold uppercase tracking-widest transition-colors ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                                {isAvailable ? 'Available for Jobs' : 'Offline / Unavailable'}
                            </p>
                        </div>
                        <button 
                            onClick={toggleAvailability}
                            className={`w-20 h-10 rounded-full p-1.5 transition-all duration-500 ease-in-out shadow-inner flex items-center ${isAvailable ? 'bg-green-500 shadow-green-500/20' : 'bg-slate-200'}`}
                        >
                            <div className={`w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-500 ease-in-out ${isAvailable ? 'translate-x-10' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-3xl mb-8 font-bold flex items-center gap-4 border border-red-100">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                            <Shield className="w-5 h-5" />
                        </div>
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Schedule Column */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="lg:col-span-2 space-y-6"
                    >
                        <h2 className="text-2xl font-black text-slate-900 mb-6">Assigned Jobs</h2>
                        
                        {bookings.length === 0 ? (
                            <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-12 text-center border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Calendar className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">No Jobs Assigned Yet</h3>
                                <p className="text-slate-500 font-bold max-w-sm mx-auto">
                                    You currently don't have any jobs in your schedule. The admin will assign them here.
                                </p>
                            </motion.div>
                        ) : (
                            bookings.map(booking => (
                                <motion.div 
                                    variants={itemVariants}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    key={booking._id} 
                                    className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-8 border-b border-slate-100">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    booking.providerStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    booking.providerStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    booking.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {booking.providerStatus === 'Pending' ? 'Action Required' : 
                                                     booking.providerStatus === 'Rejected' ? 'Rejected' : booking.status}
                                                </span>
                                                <span className="text-sm font-bold text-slate-400">ID: #{booking._id.substring(0, 8)}</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900">{booking.service?.name || 'Service Unlisted'}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Total Pay</p>
                                            <p className="text-3xl font-black text-slate-900">₹{booking.totalAmount}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                                    <Calendar className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Date</p>
                                                    <p className="font-bold text-slate-900">{new Date(booking.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                                    <Clock className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Time</p>
                                                    <p className="font-bold text-slate-900">{booking.timeSlot}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                                    <User className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Customer</p>
                                                    <p className="font-bold text-slate-900">{booking.user?.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                                    <MapPin className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                                                    <p className="font-bold text-slate-900 text-sm line-clamp-1">{booking.address?.street}, {booking.address?.city}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {booking.providerStatus === 'Pending' ? (
                                        <div className="pt-6 border-t border-slate-100/50 flex justify-end gap-4">
                                            <button 
                                                onClick={() => handleUpdateStatus(booking._id, 'pending', 'Rejected')}
                                                className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-red-100 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Reject Job
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(booking._id, 'confirmed', 'Accepted')}
                                                className="px-8 py-3 bg-green-500 text-white rounded-xl font-black text-sm flex items-center gap-2 hover:bg-green-600 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30 transition-all duration-300"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Accept Job
                                            </button>
                                        </div>
                                    ) : booking.providerStatus === 'Accepted' && booking.status !== 'completed' && booking.status !== 'cancelled' ? (
                                        <div className="pt-6 border-t border-slate-100/50 flex justify-end gap-4">
                                            <button 
                                                onClick={() => handleUpdateStatus(booking._id, 'completed')}
                                                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-sm flex items-center gap-2 hover:bg-amber-600 hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20 transition-all duration-300"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Mark Completed
                                            </button>
                                        </div>
                                    ) : null}
                                </motion.div>
                            ))
                        )}
                    </motion.div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                            <h3 className="text-xl font-black mb-8 relative z-10">Performance</h3>
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Completed</p>
                                    <p className="text-5xl font-black text-white">{bookings.filter(b => b.status === 'completed').length}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Pending Jobs</p>
                                    <p className="text-5xl font-black text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">{bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
