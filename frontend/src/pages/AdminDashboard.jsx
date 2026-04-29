import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
    LayoutDashboard, Users, UserCog, Settings, CalendarCheck, 
    TrendingUp, DollarSign, Activity, Package, CheckCircle2,
    Clock, XCircle, Plus, Check, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

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
    const [newService, setNewService] = useState({
        title: '',
        description: '',
        category: 'Plumber',
        price: '',
        image: ''
    });

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

    // Derived Metrics
    const customers = users.filter(u => u.role === 'user');
    const providers = users.filter(u => u.role === 'provider');
    const totalRevenue = bookings.reduce((acc, curr) => {
        if (curr.status === 'completed' || curr.status === 'confirmed' || curr.status === 'Completed') {
            return acc + Number(curr.totalAmount || curr.service?.price || 0);
        }
        return acc;
    }, 0);

    const tabs = [
        { id: 'overview', name: 'Overview', icon: LayoutDashboard },
        { id: 'users', name: 'Customers', icon: Users },
        { id: 'employees', name: 'Employees', icon: UserCog },
        { id: 'services', name: 'Services', icon: Package },
        { id: 'bookings', name: 'Bookings', icon: CalendarCheck },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9f6] flex flex-col md:flex-row pt-20 text-slate-900">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-stone-200 flex-shrink-0 relative z-10 hidden md:block">
                <div className="p-6 sticky top-24">
                    <div className="mb-8 px-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Portal</span>
                        <h2 className="text-xl font-black text-slate-900 leading-tight">Control Panel</h2>
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
                                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                                        : 'text-slate-500 hover:bg-stone-50 hover:text-slate-900'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Mobile Tab Scroller */}
            <div className="md:hidden bg-white border-b border-stone-200 px-4 py-2 flex overflow-x-auto gap-2 sticky top-20 z-20">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                            activeTab === tab.id ? 'bg-amber-500 text-white' : 'bg-stone-50 text-slate-500'
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
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h3>
                                
                                {/* Metrics Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-[4rem] flex items-start justify-end p-4 transition-transform group-hover:scale-110">
                                            <DollarSign className="w-6 h-6 text-green-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Total Revenue</p>
                                        <p className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">₹{totalRevenue.toLocaleString()}</p>
                                    </div>
                                    
                                    <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] flex items-start justify-end p-4 transition-transform group-hover:scale-110">
                                            <Activity className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Total Orders</p>
                                        <p className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">{bookings.length}</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-[4rem] flex items-start justify-end p-4 transition-transform group-hover:scale-110">
                                            <Users className="w-6 h-6 text-purple-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Total Customers</p>
                                        <p className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">{customers.length}</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[4rem] flex items-start justify-end p-4 transition-transform group-hover:scale-110">
                                            <UserCog className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Active Providers</p>
                                        <p className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">{providers.length}</p>
                                    </div>
                                </div>

                                {/* Recent Bookings Preview */}
                                <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-stone-200 flex justify-between items-center">
                                        <h4 className="font-black text-lg text-slate-900">Recent Transactions</h4>
                                        <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline">View All</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-stone-50">
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Service</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bookings.slice(0, 5).map(booking => (
                                                    <tr key={booking._id} className="border-b border-stone-50 hover:bg-stone-50/50">
                                                        <td className="p-4 font-bold text-slate-700">{booking.user?.name || booking.user?.firstName || 'Unknown'}</td>
                                                        <td className="p-4 text-sm text-slate-600">{booking.service?.title || 'Unknown Service'}</td>
                                                        <td className="p-4 text-sm text-slate-500">{new Date(booking.date).toLocaleDateString()}</td>
                                                        <td className="p-4 font-black text-slate-900">₹{booking.totalAmount || booking.service?.price || '0'}</td>
                                                        <td className="p-4">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                                                                booking.status.toLowerCase() === 'completed' ? 'bg-green-50 text-green-600' :
                                                                booking.status.toLowerCase() === 'cancelled' ? 'bg-red-50 text-red-600' :
                                                                booking.status.toLowerCase() === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                                                                'bg-amber-50 text-amber-600'
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
                                                        <td colSpan="5" className="p-8 text-center text-slate-400 font-bold">No bookings found.</td>
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
                                        <td className="p-4 font-bold text-slate-900">{user.name || `${user.firstName} ${user.lastName}`}</td>
                                        <td className="p-4 text-sm text-slate-600">{user.email}</td>
                                        <td className="p-4 text-sm text-slate-500">{user.phone || 'N/A'}</td>
                                        <td className="p-4 text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </>
                                )}
                            />
                        )}

                        {activeTab === 'employees' && (
                            <DataTable 
                                title="Employee / Provider Directory" 
                                description="Manage service providers."
                                columns={['Name', 'Email', 'Phone', 'Joined Date']}
                                data={providers}
                                renderRow={(user) => (
                                    <>
                                        <td className="p-4 font-bold text-slate-900">{user.name || `${user.firstName} ${user.lastName}`}</td>
                                        <td className="p-4 text-sm text-slate-600">{user.email}</td>
                                        <td className="p-4 text-sm text-slate-500">{user.phone || 'N/A'}</td>
                                        <td className="p-4 text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </>
                                )}
                            />
                        )}

                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Platform Services</h3>
                                        <p className="text-slate-500 font-medium">Manage available service offerings.</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsAddingService(true)}
                                        className="px-6 py-3 bg-amber-500 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-amber-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Add Service
                                    </button>
                                </div>

                                <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[800px]">
                                            <thead>
                                                <tr className="bg-stone-50 border-b border-stone-200">
                                                    {['Service Title', 'Category', 'Price', 'Provider ID'].map((col, idx) => (
                                                        <th key={idx} className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{col}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-stone-50">
                                                {services.map((service) => (
                                                    <tr key={service._id} className="hover:bg-stone-50/50 transition-colors">
                                                        <td className="p-4 font-bold text-slate-900">{service.title}</td>
                                                        <td className="p-4 text-sm text-slate-600">
                                                            <span className="px-3 py-1 bg-stone-100 rounded-lg text-[10px] font-black uppercase tracking-widest">{service.category}</span>
                                                        </td>
                                                        <td className="p-4 font-black text-slate-900">₹{service.price}</td>
                                                        <td className="p-4 text-xs font-mono text-slate-400">{service.provider?.name || service.provider?.email || service.provider || 'System'}</td>
                                                    </tr>
                                                ))}
                                                {services.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="p-12 text-center text-slate-400 font-bold text-lg">No records found.</td>
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
                                columns={['ID', 'Customer', 'Service', 'Date/Time', 'Amount', 'Status Update']}
                                data={bookings}
                                renderRow={(booking) => (
                                    <>
                                        <td className="p-4 text-xs font-mono text-slate-400">{booking._id.substring(booking._id.length - 6)}</td>
                                        <td className="p-4 font-bold text-slate-900">{booking.user?.name || booking.user?.firstName || 'Unknown'}</td>
                                        <td className="p-4 text-sm text-slate-600">{booking.service?.title || 'Unknown'}</td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date(booking.date).toLocaleDateString()} <br/>
                                            <span className="text-[10px] font-bold text-slate-400">{booking.timeSlot}</span>
                                        </td>
                                        <td className="p-4 font-black text-slate-900">₹{booking.totalAmount || booking.service?.price || '0'}</td>
                                        <td className="p-4">
                                            <div className="relative inline-block group">
                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border focus-within:ring-2 focus-within:ring-amber-500/20 transition-all ${
                                                    booking.status.toLowerCase() === 'completed' ? 'bg-green-50 border-green-200 text-green-700' :
                                                    booking.status.toLowerCase() === 'cancelled' ? 'bg-red-50 border-red-200 text-red-700' :
                                                    booking.status.toLowerCase() === 'confirmed' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                    'bg-amber-50 border-amber-200 text-amber-700'
                                                }`}>
                                                    {booking.status.toLowerCase() === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                                                    {booking.status.toLowerCase() === 'confirmed' && <Check className="w-4 h-4" />}
                                                    {booking.status.toLowerCase() === 'pending' && <Clock className="w-4 h-4" />}
                                                    {booking.status.toLowerCase() === 'cancelled' && <XCircle className="w-4 h-4" />}
                                                    
                                                    <select 
                                                        value={booking.status.toLowerCase()}
                                                        onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                                                        className="bg-transparent border-none font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer appearance-none pr-4"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
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
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                        >
                            <motion.div 
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-xl shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto"
                            >
                                <button 
                                    onClick={() => setIsAddingService(false)}
                                    className="absolute top-6 right-6 p-2 bg-stone-100 text-slate-500 rounded-full hover:bg-stone-200 hover:text-slate-900 transition-colors"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                                
                                <h3 className="text-2xl font-black text-slate-900 mb-6">Create New Service</h3>
                                
                                <form onSubmit={handleAddService} className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Service Title</label>
                                        <input 
                                            required type="text"
                                            value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})}
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-bold text-slate-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none"
                                            placeholder="e.g. Deep Home Cleaning"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                                        <textarea 
                                            required rows="3"
                                            value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})}
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-bold text-slate-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none resize-none"
                                            placeholder="Describe the service details..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
                                            <select 
                                                value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})}
                                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-bold text-slate-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none"
                                            >
                                                {['Plumber', 'Electrician', 'Carpentry', 'Cleaning', 'AC Repair', 'Painting', 'Salon', 'Other'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Price (₹)</label>
                                            <input 
                                                required type="number"
                                                value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})}
                                                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-bold text-slate-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none"
                                                placeholder="599"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Image URL (Optional)</label>
                                        <input 
                                            type="text"
                                            value={newService.image} onChange={e => setNewService({...newService, image: e.target.value})}
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-bold text-slate-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none"
                                            placeholder="/images/plumbing.png"
                                        />
                                    </div>
                                    <button 
                                        type="submit" disabled={addServiceLoading}
                                        className="w-full py-4 mt-4 bg-amber-500 text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {addServiceLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Service'}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const DataTable = ({ title, description, columns, data, renderRow }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{title}</h3>
            <p className="text-slate-500 font-medium">{description}</p>
        </div>
        
        <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-stone-50 border-b border-stone-200">
                            {columns.map((col, idx) => (
                                <th key={idx} className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {data.map((item, idx) => (
                            <tr key={item._id || idx} className="hover:bg-stone-50/50 transition-colors">
                                {renderRow(item)}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="p-12 text-center text-slate-400 font-bold text-lg">
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
