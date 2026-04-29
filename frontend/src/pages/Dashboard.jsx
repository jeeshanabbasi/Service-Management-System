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
    CreditCard, MoreVertical
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const Dashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/api/bookings/${id}`, { status });
            toast.success(`Booking ${status}`);
            fetchData();
        } catch (error) {
            toast.error('Error updating status');
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

    const stats = [
        { label: 'Total Activity', value: bookings.length, icon: Activity, trend: '+12%', color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Pending Request', value: bookings.filter(b => b.status === 'pending').length, icon: Clock, trend: '4 New', color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Success Rate', value: '98%', icon: ShieldCheck, trend: 'Optimal', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-28">
            <Toaster position="bottom-right" />
            
            <div className="container mx-auto px-6">
                {/* Top Bar */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">{user.role} Account</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Workspace</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Main Command <span className="text-primary-600">Center.</span></h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:border-primary-600 transition-all shadow-sm">
                            <Calendar className="w-4 h-4" /> Schedule
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-premium">
                            <Plus className="w-4 h-4" /> New Service
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {stats.map((stat, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="bg-white/70 backdrop-blur-xl border border-white shadow-premium p-8 rounded-[2.5rem] relative overflow-hidden"
                        >
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-[9px] font-black ${stat.color} bg-white border border-slate-100 shadow-sm`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Activity Feed */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                                <Inbox className="text-primary-600 w-6 h-6" /> 
                                Operational Feed
                                <span className="w-2 h-2 bg-primary-600 rounded-full animate-ping" />
                            </h2>
                            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600">View History</button>
                        </div>

                        <div className="space-y-4">
                            {bookings.length === 0 ? (
                                <div className="bg-white rounded-[3rem] border border-slate-100 p-20 text-center shadow-sm">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Inbox className="text-slate-200 w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">No Active Records</h3>
                                    <p className="text-slate-500 font-bold text-sm">Your activity pool is currently empty.</p>
                                </div>
                            ) : (
                                bookings.map((booking, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={booking._id} 
                                        className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                                    >
                                        <div className="flex gap-6 items-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shrink-0 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                                                <Package className="text-slate-400 w-6 h-6 group-hover:text-primary-600 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-black text-xl text-slate-900 tracking-tight">{booking.service?.title || 'Service Engagement'}</h4>
                                                    <ArrowUpRight className="w-4 h-4 text-slate-200 group-hover:text-primary-600 transition-all translate-y-1 -translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0" />
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                                                        <Calendar className="w-3.5 h-3.5 text-primary-600" />
                                                        {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-wider pl-4 border-l border-slate-100">
                                                        <Clock className="w-3.5 h-3.5 text-primary-600" />
                                                        {booking.timeSlot}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-center min-w-[120px] ${
                                                booking.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                booking.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}>
                                                {booking.status}
                                            </div>
                                            
                                            {(user.role === 'provider' || user.role === 'admin') && booking.status === 'pending' && (
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button onClick={() => updateStatus(booking._id, 'confirmed')} className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"><CheckCircle className="w-5 h-5" /></button>
                                                    <button onClick={() => updateStatus(booking._id, 'cancelled')} className="w-10 h-10 bg-white text-rose-500 border border-rose-100 rounded-xl flex items-center justify-center hover:bg-rose-50 transition-colors"><XCircle className="w-5 h-5" /></button>
                                                </div>
                                            )}
                                            
                                            <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors ml-auto md:ml-0"><MoreVertical className="w-5 h-5" /></button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sidebar Components */}
                    <div className="lg:col-span-4 space-y-12">
                        {/* Profile Info */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white p-10 rounded-[3.5rem] shadow-premium text-center">
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <div className="absolute inset-0 bg-primary-600/10 rounded-full animate-pulse-subtle" />
                                <div className="absolute -inset-2 border border-slate-100 rounded-full scale-110" />
                                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-xl">
                                    <User className="text-white w-14 h-14" />
                                </div>
                                <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">{user?.name || user?.firstName || 'User'}</h3>
                            <p className="text-slate-400 font-bold mb-8">{user.email}</p>
                            <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-white hover:border-primary-600 transition-all mb-4">Edit Profile</button>
                            <button className="w-full py-4 bg-primary-600/5 text-primary-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all">Account Settings</button>
                        </div>

                        {/* Recent Service Offerings */}
                        {(user.role === 'provider' || user.role === 'admin') && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Services</h2>
                                    <Package className="text-primary-600 w-5 h-5" />
                                </div>
                                
                                <div className="space-y-3">
                                    {services.slice(0, 4).map((s, idx) => (
                                        <div key={s._id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-primary-200 transition-colors cursor-pointer shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                                    <Activity className="text-slate-400 w-4 h-4 group-hover:text-primary-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{s.title}</p>
                                                    <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest">{s.category}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-primary-400" />
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-5 bg-slate-900 rounded-[2rem] text-white flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-premium hover:bg-primary-600 transition-all">
                                    Manage All Services <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

