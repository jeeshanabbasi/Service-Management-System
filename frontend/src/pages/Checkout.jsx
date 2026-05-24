import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { MapPin, CreditCard, CheckCircle2, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        zip: '',
        date: '',
        timeSlot: '10:00 AM - 12:00 PM',
        paymentMethod: 'Card'
    });

    useEffect(() => {
        if (!user) {
            toast.error('Please login to checkout');
            navigate('/login');
        } else if (cart.length === 0) {
            navigate('/services');
        }
    }, [user, cart, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            setLoading(true);
            
            const bookingPromises = cart.map(item => 
                axios.post('/api/bookings', {
                    serviceId: item._id,
                    date: formData.date,
                    timeSlot: formData.timeSlot,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        zip: formData.zip
                    },
                    paymentMethod: formData.paymentMethod,
                    totalAmount: item.price
                })
            );

            await Promise.all(bookingPromises);
            
            clearCart();
            toast.success('Booking Confirmed!', { duration: 4000 });
            setStep(4);
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && step !== 4) return null;

    const subtotal = getCartTotal();
    const taxes = Math.round(subtotal * 0.1);
    const total = subtotal + taxes;

    return (
        <div className="min-h-screen bg-[#faf9f6] pt-32 pb-20">
            <Toaster position="bottom-right" />
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                
                {step !== 4 && (
                    <motion.button 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => step > 1 ? setStep(step - 1) : navigate('/cart')}
                        className="mb-10 px-8 py-4 bg-white border border-stone-200 rounded-full text-slate-700 hover:text-amber-600 transition-all inline-flex items-center font-black text-[10px] uppercase tracking-[0.2em] gap-3 shadow-premium"
                    >
                        <ArrowLeft className="w-4 h-4" /> {step === 1 ? 'Back to Marketplace' : 'Previous Phase'}
                    </motion.button>
                )}

                {step === 4 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-3xl mx-auto glass-card p-16 rounded-[4rem] text-center relative overflow-hidden"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                        <div className="w-28 h-28 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 relative z-10 border border-emerald-100 shadow-xl shadow-emerald-500/20">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 relative z-10 tracking-tight leading-none">Booking <span className="text-emerald-500">Confirmed.</span></h2>
                        <p className="text-xl text-slate-500 mb-12 font-medium relative z-10 max-w-lg mx-auto">
                            Your reservation is secured. Our premium professionals will arrive as scheduled.
                        </p>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="btn-premium px-12 py-6 relative z-10"
                        >
                            Review in Dashboard
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Left Side - Workflow */}
                        <div className="flex-grow">
                            {/* Stepper HUD */}
                            <div className="flex items-center gap-6 mb-16 px-4">
                                {[
                                    { num: 1, title: 'Address', icon: MapPin },
                                    { num: 2, title: 'Method', icon: CreditCard },
                                    { num: 3, title: 'Finalize', icon: CheckCircle2 }
                                ].map((s, idx) => (
                                    <React.Fragment key={s.num}>
                                        <div className={`flex items-center gap-4 transition-all duration-500 ${step >= s.num ? 'text-amber-500 opacity-100' : 'text-slate-300 opacity-50'}`}>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black border-2 transition-all duration-500 ${step >= s.num ? 'bg-amber-500/10 border-amber-500 shadow-xl shadow-amber-500/20 scale-110' : 'bg-white border-stone-200'}`}>
                                                <s.icon className="w-5 h-5" />
                                            </div>
                                            <div className="hidden xl:block">
                                                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Phase 0{s.num}</p>
                                                <p className={`text-sm font-black uppercase tracking-widest ${step === s.num ? 'text-slate-900' : ''}`}>{s.title}</p>
                                            </div>
                                        </div>
                                        {idx < 2 && <div className={`flex-grow h-1 rounded-full transition-all duration-1000 ${step > s.num ? 'bg-amber-500' : 'bg-stone-200'}`} />}
                                    </React.Fragment>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {/* Step 1: Logistics */}
                                {step === 1 && (
                                    <motion.div 
                                        key="step1"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="glass-card p-10 md:p-16 rounded-[3.5rem] relative overflow-hidden"
                                    >
                                        <h3 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Deployment Details</h3>
                                        <div className="space-y-8">
                                            <div className="group">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-amber-500 transition-colors">Street Address</label>
                                                <input 
                                                    type="text" name="street" value={formData.street} onChange={handleChange}
                                                    className="w-full px-8 py-5 bg-stone-50 border border-stone-100 rounded-[1.5rem] font-bold text-slate-900 focus:bg-white focus:border-amber-500/50 outline-none transition-all shadow-inner"
                                                    placeholder="Avenue, Building, Floor..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-amber-500 transition-colors">City</label>
                                                    <input 
                                                        type="text" name="city" value={formData.city} onChange={handleChange}
                                                        className="w-full px-8 py-5 bg-stone-50 border border-stone-100 rounded-[1.5rem] font-bold text-slate-900 focus:bg-white focus:border-amber-500/50 outline-none transition-all shadow-inner"
                                                    />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-amber-500 transition-colors">Postal Code</label>
                                                    <input 
                                                        type="text" name="zip" value={formData.zip} onChange={handleChange}
                                                        className="w-full px-8 py-5 bg-stone-50 border border-stone-100 rounded-[1.5rem] font-bold text-slate-900 focus:bg-white focus:border-amber-500/50 outline-none transition-all shadow-inner"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-stone-100">
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-amber-500 transition-colors">Select Date</label>
                                                    <input 
                                                        type="date" name="date" value={formData.date} onChange={handleChange}
                                                        className="w-full px-8 py-5 bg-stone-50 border border-stone-100 rounded-[1.5rem] font-bold text-slate-900 focus:bg-white focus:border-amber-500/50 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-amber-500 transition-colors">Time Slot</label>
                                                    <select 
                                                        name="timeSlot" value={formData.timeSlot} onChange={handleChange}
                                                        className="w-full px-8 py-5 bg-stone-50 border border-stone-100 rounded-[1.5rem] font-bold text-slate-900 focus:bg-white focus:border-amber-500/50 outline-none transition-all appearance-none"
                                                    >
                                                        <option>09:00 AM - 11:00 AM</option>
                                                        <option>11:00 AM - 01:00 PM</option>
                                                        <option>02:00 PM - 04:00 PM</option>
                                                        <option>04:00 PM - 06:00 PM</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                if (!formData.street || !formData.city || !formData.date) toast.error('Required fields missing');
                                                else setStep(2);
                                            }}
                                            className="btn-gold mt-12 w-full py-6 flex items-center justify-center gap-3 text-sm"
                                        >
                                            Next: Payment Protocol <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                )}

                                {/* Step 2: Payment Gateway */}
                                {step === 2 && (
                                    <motion.div 
                                        key="step2"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="glass-card p-10 md:p-16 rounded-[3.5rem]"
                                    >
                                        <h3 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Transaction Method</h3>
                                        <div className="space-y-6">
                                            {['Card', 'UPI', 'Cash'].map(method => (
                                                <label 
                                                    key={method} 
                                                    className={`flex items-center justify-between p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${
                                                        formData.paymentMethod === method 
                                                        ? 'border-amber-500 bg-amber-50 shadow-xl shadow-amber-500/10' 
                                                        : 'border-stone-100 bg-white hover:border-amber-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center transition-colors ${formData.paymentMethod === method ? 'border-amber-500 bg-white' : 'border-stone-200'}`}>
                                                            {formData.paymentMethod === method && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />}
                                                        </div>
                                                        <span className="font-black text-xl text-slate-900">{method === 'Cash' ? 'Settlement on Delivery' : method === 'Card' ? 'Digital Card Payment' : 'Instant UPI Gateway'}</span>
                                                    </div>
                                                    <CreditCard className={`w-8 h-8 ${formData.paymentMethod === method ? 'text-amber-500' : 'text-slate-200'}`} />
                                                </label>
                                            ))}
                                        </div>

                                        <button 
                                            onClick={() => setStep(3)}
                                            className="btn-gold mt-12 w-full py-6 flex items-center justify-center gap-3 text-sm"
                                        >
                                            Review Configuration <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                )}

                                {/* Step 3: Audit & Submit */}
                                {step === 3 && (
                                    <motion.div 
                                        key="step3"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="glass-card p-10 md:p-16 rounded-[3.5rem]"
                                    >
                                        <h3 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">System Review</h3>
                                        
                                        <div className="space-y-6">
                                            <div className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Service Coordinates</h4>
                                                <p className="text-xl font-black text-slate-900 leading-tight mb-2">{formData.street}</p>
                                                <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">{formData.city}, {formData.zip}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Temporal Slot</h4>
                                                    <p className="text-lg font-black text-slate-900">{new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</p>
                                                    <p className="font-bold text-amber-600 text-xs mt-1">{formData.timeSlot}</p>
                                                </div>
                                                <div className="p-8 bg-stone-50 rounded-[2rem] border border-stone-100">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Methodology</h4>
                                                    <p className="text-lg font-black text-slate-900">{formData.paymentMethod}</p>
                                                    <p className="font-bold text-emerald-600 text-xs mt-1">Verified Gateway</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="btn-premium mt-12 w-full py-6 flex items-center justify-center gap-4 text-lg"
                                        >
                                            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <>Initiate Booking <ChevronRight className="w-6 h-6" /></>}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Order Ledger */}
                        <aside className="lg:w-[400px] shrink-0">
                            <div className="glass-card rounded-[3.5rem] p-10 sticky top-32 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
                                <h3 className="text-2xl font-black mb-10 tracking-tight">Order Summary</h3>
                                
                                <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                                    {cart.map(item => (
                                        <div key={item._id} className="flex gap-6 group/item">
                                            <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 overflow-hidden shrink-0">
                                                <img src={item.image} className="w-full h-full object-cover opacity-80 group-hover/item:opacity-100 transition-opacity" alt="" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-xs font-black text-slate-900 line-clamp-1 mb-1">{item.title}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Unit</span>
                                                    <span className="font-black text-amber-600">₹{item.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="space-y-4 pt-10 border-t border-stone-100">
                                    <div className="flex justify-between items-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                                        <span>Base Total</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                                        <span>Protocol Fees</span>
                                        <span>₹{taxes}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-6">
                                        <span className="text-sm font-black uppercase tracking-widest text-slate-900">Final Settlement</span>
                                        <span className="text-5xl font-black tracking-tighter text-slate-900">₹{total}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
