import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
    LayoutDashboard, Users, UserCog, Settings, CalendarCheck, 
    TrendingUp, DollarSign, Activity, Package, CheckCircle2,
    Clock, XCircle, Plus, Check, Loader2, Star, CalendarClock, Download, Filter, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const checkIsBusy = (bookings, providerId) => {
    const now = new Date();
    // Use local date for comparison
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    
    return (bookings || []).some(b => {
        const bProviderId = typeof b.provider === 'object' ? b.provider?._id : b.provider;
        if (bProviderId !== providerId || (b.status.toLowerCase() !== 'confirmed' && b.status.toLowerCase() !== 'pending')) {
            return false;
        }

        if (!b.date) return false;
        const bookingDate = new Date(b.date).toISOString().split('T')[0];
        if (bookingDate !== today) return false;

        if (!b.timeSlot) return true;

        try {
            // b.timeSlot format e.g. "11:00 AM - 01:00 PM"
            const [startStr, endStr] = b.timeSlot.split(' - ');
            const parseTime = (timeStr) => {
                const [time, modifier] = timeStr.trim().split(' ');
                let [hours, minutes] = time.split(':');
                hours = parseInt(hours, 10);
                if (hours === 12 && modifier.toUpperCase() === 'AM') hours = 0;
                if (hours < 12 && modifier.toUpperCase() === 'PM') hours += 12;
                return hours * 60 + parseInt(minutes, 10);
            };

            const startMins = parseTime(startStr);
            const endMins = parseTime(endStr);
            const currentMins = now.getHours() * 60 + now.getMinutes();

            return currentMins >= startMins && currentMins <= endMins;
        } catch (e) {
            console.error("Error parsing timeSlot:", e);
            return true; 
        }
    });
};

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    
    // Data states
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);

    // Add Service States
    const [isAddingService, setIsAddingService] = useState(false);
    const [addServiceLoading, setAddServiceLoading] = useState(false);
    const [dashboardStats, setDashboardStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeProviders: 0,
        pendingBookings: 0
    });

    useEffect(() => {
        document.body.style.backgroundColor = '#0a0f1c';
        document.body.style.backgroundImage = 'none';
        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.backgroundImage = '';
        };
    }, []);

    const [newService, setNewService] = useState({
        title: '',
        description: '',
        category: 'Plumber',
        price: '',
        image: ''
    });

    // Provider States
    const [isAddingProvider, setIsAddingProvider] = useState(false);
    const [isEditingProvider, setIsEditingProvider] = useState(false);
    const [providerLoading, setProviderLoading] = useState(false);
    const [currentProvider, setCurrentProvider] = useState({
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
        phone: '', gender: 'Male', role: 'provider', address: '', state: '', district: '', skills: []
    });
    const [providerFilter, setProviderFilter] = useState('all');
    const [providerSearch, setProviderSearch] = useState('');

    // Timetable Filters
    const [timetableDateFilter, setTimetableDateFilter] = useState('all');
    const [timetableStatusFilter, setTimetableStatusFilter] = useState('all');
    const [timetableSearch, setTimetableSearch] = useState('');

    const AVAILABLE_SKILLS = [
        'Plumber', 'Electrician', 'Cleaning', 'AC Repair', 
        'Carpentry', 'Painting', 'Pest Control', 'Appliance Repair'
    ];

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchAllData();
    }, [user, navigate]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [usersRes, bookingsRes, servicesRes] = await Promise.all([
                axios.get('/api/users'),
                axios.get('/api/bookings'),
                axios.get('/api/services')
            ]);
            
            setUsers(usersRes.data);
            setBookings(bookingsRes.data);
            setServices(servicesRes.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            const res = await axios.put(`/api/bookings/${bookingId}`, { status: newStatus });
            setBookings(bookings.map(b => b._id === bookingId ? res.data : b));
            toast.success(`Booking marked as ${newStatus}`);
        } catch (error) {
            console.error('Status update failed', error);
            toast.error('Failed to update status');
        }
    };

    const handleProviderAssign = async (bookingId, providerId) => {
        try {
            const res = await axios.put(`/api/bookings/${bookingId}`, { providerId, status: 'confirmed' });
            setBookings(bookings.map(b => b._id === bookingId ? res.data : b));
            toast.success('Provider assigned successfully');
        } catch (error) {
            console.error('Assignment failed', error);
            toast.error('Failed to assign provider');
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            setAddServiceLoading(true);
            const res = await axios.post('/api/services', newService);
            setServices([...services, res.data]);
            setIsAddingService(false);
            setNewService({ title: '', description: '', category: 'Plumber', price: '', image: '' });
            toast.success('New service added successfully!');
        } catch (error) {
            console.error('Error adding service:', error);
            toast.error(error.response?.data?.message || 'Failed to add service');
        } finally {
            setAddServiceLoading(false);
        }
    };

    const handleProviderChange = (e) => setCurrentProvider({ ...currentProvider, [e.target.name]: e.target.value });
    
    const handleProviderSkillToggle = (skill) => {
        const currentSkills = currentProvider.skills || [];
        if (currentSkills.includes(skill)) {
            setCurrentProvider({ ...currentProvider, skills: currentSkills.filter(s => s !== skill) });
        } else {
            setCurrentProvider({ ...currentProvider, skills: [...currentSkills, skill] });
        }
    };

    const handleAddProvider = async (e) => {
        e.preventDefault();
        if (currentProvider.password !== currentProvider.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        try {
            setProviderLoading(true);
            const res = await axios.post('/api/auth/register', currentProvider);
            setUsers([...users, res.data]);
            toast.success('Provider added successfully');
            setIsAddingProvider(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add provider');
        } finally {
            setProviderLoading(false);
        }
    };

    const handleEditProvider = async (e) => {
        e.preventDefault();
        try {
            setProviderLoading(true);
            const res = await axios.put(`/api/users/${currentProvider._id}`, currentProvider);
            setUsers(users.map(u => u._id === currentProvider._id ? res.data : u));
            toast.success('Provider updated successfully');
            setIsEditingProvider(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update provider');
        } finally {
            setProviderLoading(false);
        }
    };

    const handleToggleBlock = async (provider) => {
        try {
            const res = await axios.put(`/api/users/${provider._id}`, { isBlocked: !provider.isBlocked });
            setUsers(users.map(u => u._id === provider._id ? res.data : u));
            toast.success(res.data.isBlocked ? 'Provider has been blocked' : 'Provider has been unblocked');
        } catch (error) {
            toast.error('Failed to update block status');
        }
    };

    const openEditProvider = (provider) => {
        const [firstName, ...lastNameArr] = (provider.name || '').split(' ');
        setCurrentProvider({
            ...provider,
            firstName: provider.firstName || firstName,
            lastName: provider.lastName || lastNameArr.join(' '),
            skills: provider.skills || []
        });
        setIsEditingProvider(true);
    };

    // Derived Metrics
    const customers = (users || []).filter(u => u.role === 'user');
    const providers = (users || []).filter(u => u.role === 'provider');
    const activeProvidersCount = providers.filter(p => p.isAvailable !== false && !p.isBlocked).length;
    const providerRevenue = (bookings || []).reduce((acc, curr) => {
        if (curr.status === 'completed' || curr.status === 'confirmed' || curr.status === 'Completed') {
            return acc + Number(curr.totalAmount || curr.service?.price || 0);
        }
        return acc;
    }, 0);
    const adminRevenue = Math.round(providerRevenue * 0.10);

    // Date-based order metrics
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const todayOrders = (bookings || []).filter(b => {
        if (!b.date) return false;
        return new Date(b.date).toISOString().split('T')[0] === todayStr;
    }).length;

    const tomorrowOrders = (bookings || []).filter(b => {
        if (!b.date) return false;
        return new Date(b.date).toISOString().split('T')[0] === tomorrowStr;
    }).length;

    const pendingOrders = (bookings || []).filter(b => b.status?.toLowerCase() === 'pending').length;
    const completedOrders = (bookings || []).filter(b => b.status?.toLowerCase() === 'completed').length;

    // Timetable Logic
    const filteredTimetableBookings = (bookings || []).filter(b => {
        const matchesSearch = (b._id.toLowerCase().includes(timetableSearch.toLowerCase()) || 
                               (b.user?.name || b.user?.firstName || '').toLowerCase().includes(timetableSearch.toLowerCase()) ||
                               (typeof b.provider === 'object' ? (b.provider?.name || b.provider?.firstName || '') : (providers.find(p => p._id === b.provider)?.name || providers.find(p => p._id === b.provider)?.firstName || '')).toLowerCase().includes(timetableSearch.toLowerCase()));
        if (!matchesSearch) return false;
        
        if (timetableStatusFilter !== 'all' && b.status?.toLowerCase() !== timetableStatusFilter.toLowerCase()) return false;
        
        if (timetableDateFilter === 'today') {
            if (!b.date) return false;
            return new Date(b.date).toISOString().split('T')[0] === todayStr;
        } else if (timetableDateFilter === 'tomorrow') {
            if (!b.date) return false;
            return new Date(b.date).toISOString().split('T')[0] === tomorrowStr;
        }
        
        return true;
    });

    // Filtering Logic for Providers
    const filteredProviders = (providers || []).filter(p => {
        const matchesSearch = (p.name || `${p.firstName} ${p.lastName}`).toLowerCase().includes(providerSearch.toLowerCase());
        if (!matchesSearch) return false;

        if (providerFilter === 'all') return true;
        
        const isActuallyBusy = checkIsBusy(bookings, p._id);
        const isBlocked = p.isBlocked;

        if (providerFilter === 'blocked') return isBlocked;
        if (isBlocked && providerFilter !== 'blocked') return false; // Hide blocked in other specific filters

        if (providerFilter === 'available') return p.isAvailable !== false && !isActuallyBusy && !isBlocked;
        if (providerFilter === 'unavailable') return p.isAvailable === false && !isBlocked;
        if (providerFilter === 'busy') return isActuallyBusy && !isBlocked;
        
        return true;
    });

    const tabs = [
        { id: 'overview', name: 'Overview', icon: LayoutDashboard },
        { id: 'timetable', name: 'Timetable', icon: CalendarClock },
        { id: 'users', name: 'Customers', icon: Users },
        { id: 'employees', name: 'Employees', icon: UserCog },
        { id: 'services', name: 'Services', icon: Package },
        { id: 'bookings', name: 'Bookings', icon: CalendarCheck },
    ];

    if (loading || !user) {
        return (
            <div className="min-h-screen w-full bg-[#0a0f1c] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#0a0f1c] -mt-24 pt-32 text-[#E4E4E7] flex justify-center">
            <div className="w-full max-w-[1600px] flex flex-col md:flex-row relative">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#111623] border-r border-white/5 flex-shrink-0 relative z-10 hidden md:block">
                <div className="p-6 sticky top-24">
                    <div className="mb-8 px-4">
                        <span className="text-[10px] font-black text-[#71717A] uppercase tracking-widest">Admin Portal</span>
                        <h2 className="text-xl font-black text-[#E4E4E7] leading-tight">Control Panel</h2>
                    </div>
                    
                    <nav className="space-y-2">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all ${
                                        isActive 
                                        ? 'bg-amber-500 text-[#E4E4E7] shadow-lg shadow-amber-500/20' 
                                        : 'text-[#71717A] hover:bg-white/5/50 hover:text-[#E4E4E7]'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#E4E4E7]' : 'text-[#71717A]'}`} />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Mobile Tab Scroller */}
            <div className="md:hidden bg-[#111623] border-b border-white/5 px-4 py-2 flex overflow-x-auto gap-2 sticky top-20 z-20">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                            activeTab === tab.id ? 'bg-amber-500 text-[#E4E4E7]' : 'bg-white/5/40 text-[#71717A]'
                        }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <main className="flex-grow p-6 md:p-10 lg:p-12 overflow-x-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <h3 className="text-3xl font-black text-[#E4E4E7] tracking-tight">Dashboard Overview</h3>
                                
                                {/* Metrics Cards - Row 1 */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-[#111623] p-6 rounded-[2rem] border border-white/5 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-[4rem] flex items-start justify-end p-4 transition-transform group-hover:scale-110">
                                            <DollarSign className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2 relative z-10">Total Revenue</p>
                                        <p className="text-4xl font-black text-[#E4E4E7] tracking-tighter relative z-10">₹{adminRevenue.toLocaleString()}</p>
                                        <p className="text-[10px] text-[#71717A] mt-1 relative z-10">10% commission</p>
                                    </div>
                                    
                                    <div className="bg-[#111623] p-6 rounded-[2rem] border border-white/5 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-[4rem] flex items-start justify-end p-4 transition-transform group-hover:scale-110">
                                            <TrendingUp className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2 relative z-10">Provider Revenue</p>
                                        <p className="text-4xl font-black text-[#E4E4E7] tracking-tighter relative z-10">₹{providerRevenue.toLocaleString()}</p>
                                    </div>

                                    <div className="bg-[#111623] p-6 rounded-[2rem] border border-white/5 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-[4rem] flex items-start justify-end p-4 transition-transform group-hover:scale-110">
                                            <Users className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2 relative z-10">Total Customers</p>
                                        <p className="text-4xl font-black text-[#E4E4E7] tracking-tighter relative z-10">{customers.length}</p>
                                    </div>

                                    <div className="bg-[#111623] p-6 rounded-[2rem] border border-white/5 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-[4rem] flex items-start justify-end p-4 transition-transform group-hover:scale-110">
                                            <UserCog className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2 relative z-10">Active Providers</p>
                                        <p className="text-4xl font-black text-[#E4E4E7] tracking-tighter relative z-10">{activeProvidersCount}</p>
                                    </div>
                                </div>

                                {/* Metrics Cards - Row 2 */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-[#111623] p-6 rounded-[2rem] border border-white/5 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-[4rem] flex items-start justify-end p-4 transition-transform group-hover:scale-110">
                                            <CalendarCheck className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2 relative z-10">Today's Orders</p>
                                        <p className="text-4xl font-black text-[#E4E4E7] tracking-tighter relative z-10">{todayOrders}</p>
                                    </div>
                                    
                                    <div className="bg-[#111623] p-6 rounded-[2rem] border border-white/5 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-[4rem] flex items-start justify-end p-4 transition-transform group-hover:scale-110">
                                            <Clock className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2 relative z-10">Tomorrow's Orders</p>
                                        <p className="text-4xl font-black text-[#E4E4E7] tracking-tighter relative z-10">{tomorrowOrders}</p>
                                    </div>

                                    <div className="bg-[#111623] p-6 rounded-[2rem] border border-white/5 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-[4rem] flex items-start justify-end p-4 transition-transform group-hover:scale-110">
                                            <Activity className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2 relative z-10">Pending Orders</p>
                                        <p className="text-4xl font-black text-[#E4E4E7] tracking-tighter relative z-10">{pendingOrders}</p>
                                    </div>

                                    <div className="bg-[#111623] p-6 rounded-[2rem] border border-white/5 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-[4rem] flex items-start justify-end p-4 transition-transform group-hover:scale-110">
                                            <CheckCircle2 className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2 relative z-10">Completed Orders</p>
                                        <p className="text-4xl font-black text-[#E4E4E7] tracking-tighter relative z-10">{completedOrders}</p>
                                    </div>
                                </div>

                                {/* Recent Bookings Preview */}
                                <div className="bg-[#111623] rounded-[2rem] border border-white/5 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                        <h4 className="font-black text-lg text-[#E4E4E7]">Recent Transactions</h4>
                                        <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline">View All</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-white/5/40">
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">Customer</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">Service</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">Date</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">Amount</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookings.slice(0, 5).map(booking => (
                                                    <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="p-4 font-bold text-gray-200">{booking.user?.name || booking.user?.firstName || 'Unknown'}</td>
                                                        <td className="p-4 text-sm text-[#A1A1AA]">{booking.service?.title || 'Unknown Service'}</td>
                                                        <td className="p-4 text-sm text-[#71717A]">{new Date(booking.date).toLocaleDateString()}</td>
                                                        <td className="p-4 font-black text-[#E4E4E7]">₹{booking.totalAmount || booking.service?.price || '0'}</td>
                                                        <td className="p-4">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                                                                booking.status.toLowerCase() === 'completed' ? 'bg-green-500/15 text-green-400 border border-green-500/20' :
                                                                booking.status.toLowerCase() === 'cancelled' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                                                                booking.status.toLowerCase() === 'confirmed' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                                                                'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                                            }`}>
                                                                {booking.status.toLowerCase() === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                                                                {booking.status.toLowerCase() === 'confirmed' && <Check className="w-3 h-3" />}
                                                                {booking.status.toLowerCase() === 'pending' && <Clock className="w-3 h-3" />}
                                                                {booking.status.toLowerCase() === 'cancelled' && <XCircle className="w-3 h-3" />}
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {bookings.length === 0 && (
                                                    <tr>
                                                        <td colSpan="5" className="p-8 text-center text-[#71717A] font-bold">No bookings found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}


                        {activeTab === 'timetable' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-3xl font-black text-[#E4E4E7] tracking-tight mb-2">Service Timetable</h3>
                                        <p className="text-[#71717A] font-medium">Professional scheduling view of all platform orders.</p>
                                    </div>
                                    <button 
                                        className="px-6 py-3 bg-[#111623] border border-white/5 text-[#E4E4E7] rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-white/5 transition-colors"
                                        onClick={() => {
                                            toast.success('Exporting timetable data...');
                                        }}
                                    >
                                        <Download className="w-4 h-4" /> Export CSV
                                    </button>
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="relative flex-grow">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                                        <input 
                                            type="text" 
                                            placeholder="Search by Order ID, Customer, or Provider..." 
                                            value={timetableSearch}
                                            onChange={(e) => setTimetableSearch(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-[#111623] border border-white/5 rounded-xl font-bold text-sm text-[#E4E4E7] focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <select 
                                            value={timetableDateFilter}
                                            onChange={(e) => setTimetableDateFilter(e.target.value)}
                                            className="px-4 py-3 bg-[#111623] border border-white/5 rounded-xl font-bold text-sm text-[#E4E4E7] focus:border-amber-500 outline-none min-w-[150px]"
                                            style={{ colorScheme: 'dark' }}
                                        >
                                            <option value="all">All Dates</option>
                                            <option value="today">Today</option>
                                            <option value="tomorrow">Tomorrow</option>
                                        </select>
                                        <select 
                                            value={timetableStatusFilter}
                                            onChange={(e) => setTimetableStatusFilter(e.target.value)}
                                            className="px-4 py-3 bg-[#111623] border border-white/5 rounded-xl font-bold text-sm text-[#E4E4E7] focus:border-amber-500 outline-none min-w-[150px]"
                                            style={{ colorScheme: 'dark' }}
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-[#111623] rounded-[2rem] border border-white/5 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[1000px]">
                                            <thead>
                                                <tr className="bg-white/5/40 border-b border-white/5">
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">S.No</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">Order ID</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">Customer</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">Provider</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">Service</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">Date & Time</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">Amount</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {filteredTimetableBookings.map((booking, index) => {
                                                    const isToday = booking.date && new Date(booking.date).toISOString().split('T')[0] === todayStr;
                                                    const providerName = typeof booking.provider === 'object' ? (booking.provider?.name || booking.provider?.firstName) : (providers.find(p => p._id === booking.provider)?.name || providers.find(p => p._id === booking.provider)?.firstName);
                                                    
                                                    return (
                                                        <tr key={booking._id} className={`hover:bg-white/5 transition-colors ${isToday ? 'bg-amber-500/5' : ''}`}>
                                                            <td className="p-4 text-xs font-bold text-[#71717A]">{index + 1}</td>
                                                            <td className="p-4 text-xs font-mono text-[#71717A]">#{booking._id.substring(booking._id.length - 6)}</td>
                                                            <td className="p-4 font-bold text-[#E4E4E7]">{booking.user?.name || booking.user?.firstName || 'Unknown'}</td>
                                                            <td className="p-4">
                                                                {providerName ? (
                                                                    <span className="font-bold text-[#E4E4E7]">{providerName}</span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-md">
                                                                        ⚠️ Not Assigned
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-4">
                                                                <span className="font-bold text-[#A1A1AA] text-sm block">{booking.service?.title || 'Unknown Service'}</span>
                                                                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500/70">{booking.service?.category}</span>
                                                            </td>
                                                            <td className="p-4">
                                                                <span className={`font-bold text-sm block ${isToday ? 'text-amber-400' : 'text-[#E4E4E7]'}`}>
                                                                    {new Date(booking.date).toLocaleDateString()}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-[#71717A]">{booking.timeSlot || 'Any Time'}</span>
                                                            </td>
                                                            <td className="p-4 font-black text-[#E4E4E7]">₹{booking.totalAmount || booking.service?.price || '0'}</td>
                                                            <td className="p-4">
                                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                                                                    booking.status.toLowerCase() === 'completed' ? 'bg-green-500/15 text-green-400 border border-green-500/20' :
                                                                    booking.status.toLowerCase() === 'cancelled' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                                                                    booking.status.toLowerCase() === 'confirmed' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                                                                    'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                                                }`}>
                                                                    {booking.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {filteredTimetableBookings.length === 0 && (
                                                    <tr>
                                                        <td colSpan="8" className="p-12 text-center text-[#71717A] font-bold text-lg">No timetable records found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <DataTable 
                                title="Customer Directory" 
                                description="Manage all registered customer accounts."
                                columns={['Name', 'Email', 'Phone', 'Joined Date']}
                                data={customers}
                                renderRow={(user) => (
                                    <>
                                        <td className="p-4 font-bold text-[#E4E4E7]">{user.name || `${user.firstName} ${user.lastName}`}</td>
                                        <td className="p-4 text-sm text-[#A1A1AA]">{user.email}</td>
                                        <td className="p-4 text-sm text-[#71717A]">{user.phone || 'N/A'}</td>
                                        <td className="p-4 text-sm text-[#71717A]">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </>
                                )}
                            />
                        )}

                        {activeTab === 'employees' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-3xl font-black text-[#E4E4E7] tracking-tight mb-2">Employee / Provider Directory</h3>
                                        <p className="text-[#71717A] font-medium">Manage service providers.</p>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                                        <div className="flex items-center gap-2">
                                            {['all', 'available', 'unavailable', 'busy', 'blocked'].map(filter => (
                                                <button
                                                    key={filter}
                                                    onClick={() => setProviderFilter(filter)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                        providerFilter === filter 
                                                            ? 'bg-amber-500 text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)]' 
                                                            : 'bg-[#111623] text-[#71717A] hover:bg-white/5 hover:text-[#E4E4E7] border border-white/5'
                                                    }`}
                                                >
                                                    {filter === 'all' ? 'All' : filter === 'available' ? 'Active' : filter === 'unavailable' ? 'Inactive' : filter === 'busy' ? 'Busy' : 'Blocked'}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search by name..."
                                            value={providerSearch}
                                            onChange={(e) => setProviderSearch(e.target.value)}
                                            className="bg-[#111623] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#E4E4E7] placeholder-[#71717A] outline-none focus:border-amber-500/50 min-w-[200px]"
                                        />
                                        <button 
                                            onClick={() => {
                                                setCurrentProvider({
                                                    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
                                                    phone: '', gender: 'Male', role: 'provider', address: '', state: '', district: '', skills: []
                                                });
                                                setIsAddingProvider(true);
                                            }}
                                            className="px-6 py-3 bg-[#111623] text-[#E4E4E7] rounded-xl font-black shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-amber-600 transition-colors flex items-center gap-2 text-sm"
                                        >
                                            <Plus className="w-5 h-5" /> Add Provider
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-[#111623] rounded-[2rem] p-2 md:p-8 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[800px]">
                                            <thead>
                                                <tr>
                                                    {['Name', 'Email', 'Phone', 'Status', 'Joined Date', 'Actions'].map(col => (
                                                        <th key={col} className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A] border-b border-white/5">{col}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredProviders.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" className="p-8 text-center text-[#71717A] font-medium">No providers match the selected filter.</td>
                                                    </tr>
                                                ) : (
                                                    filteredProviders.map(user => {
                                                        const isBusy = checkIsBusy(bookings, user._id);

                                                        return (
                                                            <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                                                <td className="p-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="relative">
                                                                            <span className="font-bold text-[#E4E4E7]">{user.name || `${user.firstName} ${user.lastName}`}</span>
                                                                            {user.averageRating > 0 && (
                                                                                <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/20">
                                                                                    <Star className="w-3 h-3 fill-amber-500" />
                                                                                    {user.averageRating}
                                                                                </span>
                                                                            )}
                                                                            {user.isBlocked && (
                                                                                <span className="ml-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-full border border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                                                                                    <XCircle className="w-3 h-3" />
                                                                                    BLOCKED
                                                                                </span>
                                                                            )}
                                                                            {user.isAvailable === false && !user.isBlocked && (
                                                                                <span className="ml-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full border border-red-500/20">
                                                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                                                    Offline
                                                                                </span>
                                                                            )}
                                                                            {isBusy && (
                                                                                <span className="ml-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/20">
                                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                                                    Busy
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-sm text-[#A1A1AA]">{user.email}</td>
                                                                <td className="p-4 text-sm text-[#71717A]">{user.phone || 'N/A'}</td>
                                                                <td className="p-4">
                                                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                                                                        user.isBlocked ? 'bg-red-900/50 text-red-500 border border-red-500/30' :
                                                                        user.isAvailable === false ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                                                                        isBusy ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                                                                        'bg-green-500/15 text-green-400 border border-green-500/20'
                                                                    }`}>
                                                                        {user.isBlocked ? 'Banned' : user.isAvailable === false ? 'Currently Off' : 
                                                                         isBusy ? 'Busy (On Booking)' : 'Available'}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-sm text-[#71717A]">{new Date(user.createdAt).toLocaleDateString()}</td>
                                                                <td className="p-4">
                                                                    <div className="flex gap-2">
                                                                        <button 
                                                                            onClick={() => openEditProvider(user)}
                                                                            className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold hover:bg-amber-200 transition-colors"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleToggleBlock(user)}
                                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                                                                user.isBlocked ? 'bg-green-500/20 text-green-400 hover:bg-green-500/40' : 'bg-red-500/20 text-red-400 hover:bg-red-500/40'
                                                                            }`}
                                                                        >
                                                                            {user.isBlocked ? 'Unblock' : 'Block'}
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-3xl font-black text-[#E4E4E7] tracking-tight mb-2">Platform Services</h3>
                                        <p className="text-[#71717A] font-medium">Manage available service offerings.</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsAddingService(true)}
                                        className="px-6 py-3 bg-amber-500 text-[#E4E4E7] rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-amber-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Add Service
                                    </button>
                                </div>

                                <div className="bg-[#111623] rounded-[2rem] border border-white/5 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[800px]">
                                            <thead>
                                                <tr className="bg-white/5/40 border-b border-white/5">
                                                    {['Service Title', 'Category', 'Price', 'Provider ID'].map((col, idx) => (
                                                        <th key={idx} className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">{col}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {services.map((service) => (
                                                    <tr key={service._id} className="hover:bg-white/5/50/50 transition-colors">
                                                        <td className="p-4 font-bold text-[#E4E4E7]">{service.title}</td>
                                                        <td className="p-4 text-sm text-[#A1A1AA]">
                                                            <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest">{service.category}</span>
                                                        </td>
                                                        <td className="p-4 font-black text-[#E4E4E7]">₹{service.price}</td>
                                                        <td className="p-4 text-xs font-mono text-[#71717A]">{service.provider?.name || service.provider?.email || service.provider || 'System'}</td>
                                                    </tr>
                                                ))}
                                                {services.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="p-12 text-center text-[#71717A] font-bold text-lg">No records found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <DataTable 
                                title="All Bookings" 
                                description="Comprehensive view of all platform bookings. Manage statuses easily."
                                columns={['ID', 'Customer', 'Service', 'Date/Time', 'Amount', 'Status / Assign']}
                                data={bookings}
                                renderRow={(booking) => (
                                    <>
                                        <td className="p-4 text-xs font-mono text-[#71717A]">{booking._id.substring(booking._id.length - 6)}</td>
                                        <td className="p-4 font-bold text-[#E4E4E7]">
                                            {booking.user?.name || booking.user?.firstName || 'Unknown'}
                                            {booking.user?._id && booking.service?.provider && (
                                                (typeof booking.service.provider === 'string' ? booking.service.provider : booking.service.provider._id) === booking.user._id
                                            ) && (
                                                <span className="block mt-1 px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[9px] font-black uppercase tracking-widest w-max">
                                                    Self-Booking Alert
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-[#A1A1AA]">{booking.service?.title || 'Unknown'}</td>
                                        <td className="p-4 text-sm text-[#71717A]">
                                            {new Date(booking.date).toLocaleDateString()} <br/>
                                            <span className="text-[10px] font-bold text-[#71717A]">{booking.timeSlot}</span>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-black text-[#E4E4E7]">₹{booking.totalAmount || booking.service?.price || '0'}</p>
                                            {booking.providerStatus && booking.providerStatus !== 'None' && (
                                                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                                    booking.providerStatus === 'Pending' ? 'bg-amber-500/20 text-amber-300' :
                                                    booking.providerStatus === 'Rejected' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                                                    'bg-green-500/15 text-green-400 border border-green-500/20'
                                                }`}>
                                                    Provider: {booking.providerStatus}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="relative inline-block group w-full mb-2">
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border focus-within:ring-2 focus-within:ring-amber-500/20 transition-all ${
                                                    booking.status.toLowerCase() === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                    booking.status.toLowerCase() === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                    booking.status.toLowerCase() === 'confirmed' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                    'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                                }`}>
                                                    {booking.status.toLowerCase() === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                                                    {booking.status.toLowerCase() === 'confirmed' && <Check className="w-4 h-4" />}
                                                    {booking.status.toLowerCase() === 'pending' && <Clock className="w-4 h-4" />}
                                                    {booking.status.toLowerCase() === 'cancelled' && <XCircle className="w-4 h-4" />}
                                                    
                                                    <select 
                                                        value={booking.status.toLowerCase()}
                                                        onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                                                        className="bg-transparent border-none font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer appearance-none pr-4 w-full"
                                                        style={{ colorScheme: 'dark' }}
                                                    >
                                                        <option value="pending" className="bg-[#111623] text-gray-200">Pending</option>
                                                        <option value="confirmed" className="bg-[#111623] text-gray-200">Confirmed</option>
                                                        <option value="completed" className="bg-[#111623] text-gray-200">Completed</option>
                                                        <option value="cancelled" className="bg-[#111623] text-gray-200">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {booking.status.toLowerCase() !== 'completed' && booking.status.toLowerCase() !== 'cancelled' && (
                                                <select
                                                    value={booking.provider?._id || booking.provider || ''}
                                                    onChange={(e) => handleProviderAssign(booking._id, e.target.value)}
                                                    className="w-full bg-[#111623] border border-white/10 text-[10px] font-bold text-gray-200 rounded-lg p-2 outline-none focus:border-amber-500 transition-colors"
                                                    style={{ colorScheme: 'dark' }}
                                                >
                                                    <option value="" className="bg-[#111623] text-gray-400">Unassigned (Select Provider)</option>
                                                    {providers.filter(p => !p.isBlocked).map(p => (
                                                        <option key={p._id} value={p._id} className="bg-[#111623] text-gray-200">
                                                            {p.name || p.firstName} {p.isAvailable === false ? '(Unavailable/Off)' : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                    </>
                                )}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Add Service Modal */}
                <AnimatePresence>
                    {isAddingService && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111623]/40 backdrop-blur-sm"
                        >
                            <motion.div 
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className="bg-[#111623] rounded-[2rem] p-8 md:p-10 w-full max-w-xl shadow-2xl border border-white/5 relative max-h-[90vh] overflow-y-auto"
                            >
                                <button 
                                    onClick={() => setIsAddingService(false)}
                                    className="absolute top-6 right-6 p-2 bg-white/5 text-[#71717A] rounded-full hover:bg-stone-200 hover:text-[#E4E4E7] transition-colors"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                                
                                <h3 className="text-2xl font-black text-[#E4E4E7] mb-6">Create New Service</h3>
                                
                                <form onSubmit={handleAddService} className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2">Service Title</label>
                                        <input 
                                            required type="text"
                                            value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5/40 border border-white/5 rounded-xl font-bold text-[#E4E4E7] focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none"
                                            placeholder="e.g. Deep Home Cleaning"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2">Description</label>
                                        <textarea 
                                            required rows="3"
                                            value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5/40 border border-white/5 rounded-xl font-bold text-[#E4E4E7] focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none resize-none"
                                            placeholder="Describe the service details..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2">Category</label>
                                            <select 
                                                value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})}
                                                className="w-full px-4 py-3 bg-[#0a0f1c] border border-white/5 rounded-xl font-bold text-[#E4E4E7] focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none"
                                                style={{ colorScheme: 'dark' }}
                                            >
                                                {['Plumber', 'Electrician', 'Carpentry', 'Cleaning', 'AC Repair', 'Painting', 'Salon', 'Other'].map(c => (
                                                    <option key={c} value={c} className="bg-[#111623] text-gray-200">{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2">Price (₹)</label>
                                            <input 
                                                required type="number"
                                                value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})}
                                                className="w-full px-4 py-3 bg-white/5/40 border border-white/5 rounded-xl font-bold text-[#E4E4E7] focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none"
                                                placeholder="599"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2">Image URL (Optional)</label>
                                        <input 
                                            type="text"
                                            value={newService.image} onChange={e => setNewService({...newService, image: e.target.value})}
                                            className="w-full px-4 py-3 bg-white/5/40 border border-white/5 rounded-xl font-bold text-[#E4E4E7] focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none"
                                            placeholder="/images/plumbing.png"
                                        />
                                    </div>
                                    <button 
                                        type="submit" disabled={addServiceLoading}
                                        className="w-full py-4 mt-4 bg-amber-500 text-[#E4E4E7] rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {addServiceLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Service'}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Provider Modal (Add / Edit) - Moved here to fix scope issues */}
                <AnimatePresence>
                    {(isAddingProvider || isEditingProvider) && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#111623]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                        >
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="bg-[#111623] w-full max-w-2xl rounded-3xl p-8 shadow-2xl my-8 relative"
                            >
                                <button 
                                    onClick={() => { setIsAddingProvider(false); setIsEditingProvider(false); }}
                                    className="absolute top-6 right-6 text-[#71717A] hover:text-[#A1A1AA] transition-colors"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                                
                                <h3 className="text-2xl font-black text-[#E4E4E7] mb-6">
                                    {isEditingProvider ? 'Edit Provider Details' : 'Add New Provider'}
                                </h3>
                                
                                <form onSubmit={isEditingProvider ? handleEditProvider : handleAddProvider} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2">First Name</label>
                                            <input type="text" name="firstName" value={currentProvider.firstName} onChange={handleProviderChange} required className="w-full px-4 py-3 bg-white/5/40 border border-slate-200 rounded-xl font-bold text-[#E4E4E7] focus:bg-[#111623] focus:border-amber-500 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2">Last Name</label>
                                            <input type="text" name="lastName" value={currentProvider.lastName} onChange={handleProviderChange} required className="w-full px-4 py-3 bg-white/5/40 border border-slate-200 rounded-xl font-bold text-[#E4E4E7] focus:bg-[#111623] focus:border-amber-500 outline-none transition-all" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2">Email Address</label>
                                            <input type="email" name="email" value={currentProvider.email} onChange={handleProviderChange} required disabled={isEditingProvider} className={`w-full px-4 py-3 bg-white/5/40 border border-slate-200 rounded-xl font-bold text-[#E4E4E7] focus:bg-[#111623] focus:border-amber-500 outline-none transition-all ${isEditingProvider ? 'opacity-60 cursor-not-allowed' : ''}`} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2">Phone</label>
                                            <input type="text" name="phone" value={currentProvider.phone} onChange={handleProviderChange} required className="w-full px-4 py-3 bg-white/5/40 border border-slate-200 rounded-xl font-bold text-[#E4E4E7] focus:bg-[#111623] focus:border-amber-500 outline-none transition-all" />
                                        </div>
                                        {!isEditingProvider && (
                                            <>
                                                <div>
                                                    <label className="block text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2">Password</label>
                                                    <input type="password" name="password" value={currentProvider.password} onChange={handleProviderChange} required className="w-full px-4 py-3 bg-white/5/40 border border-slate-200 rounded-xl font-bold text-[#E4E4E7] focus:bg-[#111623] focus:border-amber-500 outline-none transition-all" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-2">Confirm Password</label>
                                                    <input type="password" name="confirmPassword" value={currentProvider.confirmPassword} onChange={handleProviderChange} required className="w-full px-4 py-3 bg-white/5/40 border border-slate-200 rounded-xl font-bold text-[#E4E4E7] focus:bg-[#111623] focus:border-amber-500 outline-none transition-all" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="border-t border-slate-100 pt-4">
                                        <label className="block text-[10px] font-black text-[#71717A] uppercase tracking-widest mb-3">Skills / Services Offered</label>
                                        <div className="flex flex-wrap gap-2">
                                            {AVAILABLE_SKILLS.map(skill => (
                                                <button
                                                    key={skill}
                                                    type="button"
                                                    onClick={() => handleProviderSkillToggle(skill)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                                                        (currentProvider.skills || []).includes(skill)
                                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-300'
                                                        : 'bg-white/5/40 text-[#71717A] border border-slate-200 hover:border-slate-300'
                                                    }`}
                                                >
                                                    {skill}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        disabled={providerLoading}
                                        className="w-full py-4 bg-amber-600 text-[#E4E4E7] rounded-xl font-black uppercase tracking-widest hover:bg-amber-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {providerLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditingProvider ? 'Save Changes' : 'Add Provider')}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            </div>
        </div>
    );
};

const DataTable = ({ title, description, columns, data, renderRow }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-3xl font-black text-[#E4E4E7] tracking-tight mb-2">{title}</h3>
            <p className="text-[#71717A] font-medium">{description}</p>
        </div>
        
        <div className="bg-[#111623] rounded-[2rem] border border-white/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-white/5/40 border-b border-white/5">
                            {columns.map((col, idx) => (
                                <th key={idx} className="p-4 text-[10px] font-black uppercase tracking-widest text-[#71717A]">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((item, idx) => (
                            <tr key={item._id || idx} className="hover:bg-white/5/50/50 transition-colors">
                                {renderRow(item)}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="p-12 text-center text-[#71717A] font-bold text-lg">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default AdminDashboard;
