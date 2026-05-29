import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
    LayoutDashboard, Calendar as CalendarIcon, User, 
    Bell, Activity, Clock, ShieldCheck, DollarSign, Package, LogOut
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const Dashboard = () => {
    const { user, loading: authLoading, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [bookings, setBookings] = useState([]);
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
        } catch (error) {
            console.error(error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return (
        <div className="min-h-screen bg-[#151515] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#1c1c1c] border-t-amber-500 rounded-full animate-spin" />
        </div>
    );

    if (!user) return null;

    const sidebarLinks = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'My Bookings', icon: CalendarIcon, path: '/my-bookings' },
        { name: 'Profile', icon: User, path: '/profile' },
    ];

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };
    
    const initials = getInitials(user?.name || user?.firstName);
    
    const totalSpent = bookings.reduce((sum, b) => {
        if (b.status === 'completed') return sum + b.totalAmount;
        return sum;
    }, 0);

    const pendingCount = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
    
    const stats = [
        { label: 'Total Bookings', value: bookings.length, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Active Requests', value: pendingCount, icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Total Spent', value: `₹${totalSpent}`, icon: DollarSign, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    ];

    return (
        <div className="min-h-screen bg-[#151515] text-white font-sans selection:bg-amber-500/30 selection:text-amber-200 flex">
            <Toaster position="bottom-right" />
            
            {/* Left Sidebar */}
            <aside className="w-72 bg-[#1c1c1c] border-r border-white/5 flex flex-col shrink-0 fixed top-0 bottom-0 left-0 z-10">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center rotate-45 shrink-0 shadow-lg shadow-amber-500/20">
                        <div className="w-3 h-3 bg-[#1c1c1c] rounded-sm -rotate-45" />
                    </div>
                    <span className="text-xl font-bold tracking-wide text-amber-500">Servicio</span>
                </div>

                <nav className="flex-1 px-4 flex flex-col mt-8">
                    <div className="space-y-1">
                    {sidebarLinks.map(link => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link 
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                                    isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                    </div>
                    
                    <div className="mt-auto mb-8">
                        <button 
                            onClick={() => { logout(); navigate('/login'); }} 
                            className="flex w-full items-center gap-4 px-4 py-3 rounded-lg font-medium text-sm text-rose-500 hover:text-white hover:bg-rose-600 transition-all"
                        >
                            <LogOut className="w-5 h-5" /> Logout
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-72">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#151515] sticky top-0 z-10">
                    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            {pendingCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-[#151515]"></span>}
                        </button>
                        <Link to="/profile" className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 overflow-hidden cursor-pointer hover:border-amber-500 transition-colors flex items-center justify-center text-xs font-bold text-amber-500 shrink-0">
                            {initials}
                        </Link>
                    </div>
                </header>

                <div className="p-10 max-w-6xl mx-auto space-y-10">
                    
                    {/* Welcome Section */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || user?.firstName}</h2>
                        <p className="text-slate-400 text-sm">Here is what's happening with your account today.</p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-6 flex items-center gap-6 hover:border-white/10 transition-colors">
                                <div className={`w-14 h-14 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                            <Link to="/my-bookings" className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors">
                                View All Bookings
                            </Link>
                        </div>
                        
                        <div className="space-y-4">
                            {bookings.length === 0 ? (
                                <div className="text-center py-10 bg-[#151515] border border-white/5 rounded-xl">
                                    <Package className="w-10 h-10 text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-400 text-sm">No activity found. Book a service to get started.</p>
                                </div>
                            ) : (
                                bookings.slice(0, 5).map(booking => (
                                    <div key={booking._id} className="p-5 bg-[#151515] border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                                {booking.service?.image ? (
                                                    <img src={booking.service.image} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <Package className="w-5 h-5 text-slate-500" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm mb-1">{booking.service?.title || 'Service Order'}</h4>
                                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {new Date(booking.date).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.timeSlot}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                booking.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                                                'bg-white/5 text-slate-400 border border-white/10'
                                            }`}>
                                                {booking.status}
                                            </span>
                                            <span className="font-bold text-white whitespace-nowrap">₹{booking.totalAmount}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
