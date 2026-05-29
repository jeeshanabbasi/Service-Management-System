import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
    LayoutDashboard, Calendar as CalendarIcon, User, 
    Bell, ShieldCheck, MapPin, CheckCircle, 
    Phone, Edit2, Zap, LogOut
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const Profile = () => {
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
            toast.error('Failed to load profile data');
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

    // Separate active and past bookings for the UI
    const activeBooking = bookings.find(b => b.status === 'pending' || b.status === 'confirmed');
    const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').slice(0, 3);

    const sidebarLinks = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'My Bookings', icon: CalendarIcon, path: '/my-bookings' },
        { name: 'Profile', icon: User, path: '/profile' },
    ];

    // Helper to get initials (e.g. SA for Super Admin)
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };
    
    const initials = getInitials(user?.name || user?.firstName);
    const displayName = user?.name || user?.firstName || 'User';

    return (
        <div className="min-h-screen bg-[#151515] text-white font-sans selection:bg-amber-500/30 selection:text-amber-200 flex">
            <Toaster position="bottom-right" />
            
            {/* Left Sidebar */}
            <aside className="w-72 bg-[#1c1c1c] border-r border-white/5 flex flex-col shrink-0 fixed top-0 bottom-0 left-0 z-10">
                {/* Logo Area */}
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center rotate-45 shrink-0 shadow-lg shadow-amber-500/20">
                        <div className="w-3 h-3 bg-[#1c1c1c] rounded-sm -rotate-45" />
                    </div>
                    <span className="text-xl font-bold tracking-wide text-amber-500">Servicio</span>
                </div>

                {/* Navigation Links */}
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
                {/* Top Navbar */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#151515] sticky top-0 z-10">
                    <h1 className="text-2xl font-bold text-amber-500">Profile</h1>
                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-[#151515]"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800 overflow-hidden cursor-pointer hover:border-amber-500 transition-colors flex items-center justify-center text-xs font-bold text-amber-500 shrink-0">
                            {initials}
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-6xl mx-auto space-y-8">
                    
                    {/* Top Row: Profile & Loyalty Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="lg:col-span-2 bg-[#1c1c1c] border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                            {/* Avatar section */}
                            <div className="relative shrink-0">
                                <div className="w-32 h-32 rounded-xl border border-white/10 overflow-hidden bg-[#111111] shadow-xl flex items-center justify-center">
                                    <span className="text-5xl font-light tracking-widest text-[#f3a953]">{initials}</span>
                                </div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                                    Premium
                                </div>
                            </div>
                            
                            {/* User details */}
                            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                                <h2 className="text-3xl font-bold text-white mb-2">{displayName}</h2>
                                <p className="text-slate-400 text-sm font-medium mb-6">Silver Tier Member <br/> since Jan 2023</p>
                                
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 w-full">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5 text-xs font-medium text-slate-300">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        Verified User
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5 text-xs font-medium text-slate-300">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        Mumbai, India
                                    </div>
                                </div>
                            </div>

                            <button className="px-6 py-2.5 bg-[#f3a953] hover:bg-amber-400 text-slate-900 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-amber-500/20 shrink-0 self-center md:self-start">
                                Edit Profile
                            </button>
                        </div>

                        {/* Loyalty Points Card */}
                        <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col">
                            {/* Decorative Star/Ribbon Background */}
                            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                <Zap className="w-32 h-32 text-amber-500" />
                            </div>
                            
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Loyalty Points</h3>
                            <div className="flex items-end gap-2 mb-6">
                                <span className="text-4xl font-black text-[#f3a953]">1,240</span>
                                <span className="text-slate-400 text-sm font-bold mb-1">pts</span>
                            </div>

                            <div className="mb-2 flex justify-between text-xs font-medium text-slate-300">
                                <span>Silver Tier</span>
                                <span className="text-amber-500">760 pts to Elite</span>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full mb-8 overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full w-[60%] shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                            </div>

                            <button className="mt-auto w-full py-2.5 border border-amber-500/50 hover:bg-amber-500/10 text-amber-500 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 group">
                                Redeem Rewards <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Middle Row: Active Service & Order History */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Active Service Card */}
                        <div className="lg:col-span-2 bg-[#1c1c1c] border border-white/5 rounded-2xl p-8 flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3 text-white font-medium">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,1)]"></div>
                                    </div>
                                    Active Service
                                </div>
                                <span className="px-3 py-1 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full bg-amber-500/5">
                                    Live Tracking
                                </span>
                            </div>

                            {activeBooking ? (
                                <>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">{activeBooking.service?.title || 'Custom Service'}</h3>
                                            <p className="text-sm text-slate-400">Order #SRV-{activeBooking._id.slice(-5)} • {new Date(activeBooking.date).toLocaleDateString()}, {activeBooking.timeSlot}</p>
                                        </div>
                                        
                                        {activeBooking.provider && (
                                            <div className="bg-[#151515] p-3 rounded-xl border border-white/5 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                                                    <img src={`https://ui-avatars.com/api/?name=${activeBooking.provider.name || 'Tech'}&background=1a1a1a&color=f59e0b`} alt="Tech" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="pr-4 border-r border-white/10">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Assigned Technician</p>
                                                    <p className="text-sm font-bold text-white mb-0.5">{activeBooking.provider.name || 'Mark J.'}</p>
                                                    <div className="flex items-center gap-1 text-xs font-bold text-white">
                                                        <span className="text-amber-500">★</span> 4.9
                                                    </div>
                                                </div>
                                                <button className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center hover:bg-amber-500 hover:text-[#1c1c1c] transition-colors shrink-0">
                                                    <Phone className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Progress Tracker UI */}
                                    <div className="mt-auto pt-8 border-t border-white/5">
                                        <div className="relative flex justify-between items-center mb-6">
                                            {/* Track Background */}
                                            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
                                            {/* Active Track (Mocked as In Progress) */}
                                            <div className="absolute top-1/2 left-4 w-[60%] h-0.5 bg-amber-500 -translate-y-1/2 z-0 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                            
                                            {/* Step 1: Scheduled */}
                                            <div className="relative z-10 flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[#1c1c1c] shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-3">
                                                    <CheckCircle className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-bold text-amber-500">Scheduled</span>
                                            </div>

                                            {/* Step 2: Technician Assigned */}
                                            <div className="relative z-10 flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[#1c1c1c] shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-3">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-bold text-amber-500">Technician Assigned</span>
                                            </div>

                                            {/* Step 3: In Progress (Current) */}
                                            <div className="relative z-10 flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[#1c1c1c] ring-4 ring-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.5)] mb-3 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                                    <div className="w-3 h-3 bg-[#1c1c1c] rounded-sm" />
                                                </div>
                                                <span className="text-xs font-bold text-white">In Progress</span>
                                            </div>

                                            {/* Step 4: Completed */}
                                            <div className="relative z-10 flex flex-col items-center">
                                                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] border border-slate-700 flex items-center justify-center text-slate-600 mb-3">
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-medium text-slate-500">Completed</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                                    <div className="w-16 h-16 rounded-full bg-[#151515] flex items-center justify-center mb-4">
                                        <CalendarIcon className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <p className="text-slate-400 font-medium">No active services right now.</p>
                                </div>
                            )}
                        </div>

                        {/* Order History */}
                        <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-8 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-white font-medium">Order History</h3>
                                <Link to="/my-bookings" className="text-xs font-bold text-[#f3a953] hover:text-amber-400 transition-colors">
                                    View All
                                </Link>
                            </div>

                            <div className="space-y-4 flex-1">
                                {pastBookings.length > 0 ? (
                                    pastBookings.map((b) => (
                                        <div key={b._id} className="p-4 bg-[#151515] border border-white/5 rounded-xl flex flex-col justify-between hover:border-white/10 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-bold text-white text-sm group-hover:text-amber-500 transition-colors line-clamp-1 pr-4">{b.service?.title || 'Service Order'}</h4>
                                                <span className="font-bold text-white shrink-0">₹{b.totalAmount}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    {new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                                                    {b.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-500 text-sm py-10 text-center">
                                        No past orders found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Personal Information */}
                    <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-8">
                        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                            <h3 className="text-white font-medium">Personal Information</h3>
                            <button className="flex items-center gap-2 text-[#f3a953] hover:text-amber-400 font-bold text-xs transition-colors">
                                <Edit2 className="w-3.5 h-3.5" /> Edit Fields
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                <div className="bg-[#111111] border border-white/5 rounded-lg px-4 py-3 text-sm text-slate-300">
                                    {displayName}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                <div className="bg-[#111111] border border-white/5 rounded-lg px-4 py-3 text-sm text-slate-300">
                                    {user?.email}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                                <div className="bg-[#111111] border border-white/5 rounded-lg px-4 py-3 text-sm text-slate-300">
                                    {user?.phone || '+91 98765 43210'}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Residential Address</label>
                                <div className="bg-[#111111] border border-white/5 rounded-lg px-4 py-3 text-sm text-slate-300 truncate">
                                    {user?.address || '402, Skyline Apartments, Mumbai'}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Standard Footer */}
                <footer className="border-t border-white/5 py-8 bg-[#151515] mt-10">
                    <div className="max-w-6xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col sm:items-start items-center gap-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center border border-[#f3a953]/50 overflow-hidden shadow-sm">
                                    <img src="/logo.png" alt="Servicio Logo" className="w-full h-full object-cover scale-110" />
                                </div>
                                <span className="text-xl font-bold text-amber-500 tracking-wide capitalize">Servicio</span>
                            </div>
                            <span className="text-xs text-slate-500 font-medium mt-1">© 2024 Servicio Management. All rights reserved.</span>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">
                                Engineered by <span className="text-amber-500">Jeeshan</span> (Backend) &amp; <span className="text-amber-500">Dipanshu</span> (Frontend)
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
                            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link to="#" className="hover:text-white transition-colors">Contact Us</Link>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Profile;
