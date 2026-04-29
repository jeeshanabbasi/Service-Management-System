import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { MapPin, CreditCard, CheckCircle2, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

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
            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                
                {step !== 4 && (
                    <button 
                        onClick={() => step > 1 ? setStep(step - 1) : navigate('/cart')}
                        className="mb-8 px-6 py-3 bg-white border border-stone-200 rounded-full text-slate-700 hover:bg-white hover:text-slate-900 transition-all inline-flex items-center font-black text-xs uppercase tracking-widest gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                    >
                        <ArrowLeft className="w-4 h-4" /> {step === 1 ? 'Back to Cart' : 'Previous Step'}
                    </button>
                )}

                {step === 4 ? (
                    <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] transition-shadow text-center relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]" />
                        <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10">
                            <CheckCircle2 className="w-12 h-12 text-green-400" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-4 relative z-10">Booking Confirmed!</h2>
                        <p className="text-lg text-slate-500 mb-10 font-medium relative z-10">
                            Your service request has been received. Our professionals will arrive at your address on the scheduled date.
                        </p>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="px-10 py-5 bg-amber-600 text-slate-900 rounded-2xl font-black shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] hover:scale-105 transition-transform relative z-10"
                        >
                            View Bookings in Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left Side - Forms */}
                        <div className="flex-grow">
                            {/* Stepper */}
                            <div className="flex items-center gap-4 mb-12">
                                {[
                                    { num: 1, title: 'Address & Schedule', icon: MapPin },
                                    { num: 2, title: 'Payment Method', icon: CreditCard },
                                    { num: 3, title: 'Review', icon: CheckCircle2 }
                                ].map((s, idx) => (
                                    <React.Fragment key={s.num}>
                                        <div className={`flex items-center gap-3 ${step >= s.num ? 'text-amber-400' : 'text-slate-600'}`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors ${step >= s.num ? 'bg-amber-500/10 border border-amber-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'bg-white border border-stone-200'}`}>
                                                <s.icon className="w-5 h-5" />
                                            </div>
                                            <span className="font-black text-xs uppercase tracking-widest hidden md:block">{s.title}</span>
                                        </div>
                                        {idx < 2 && <div className={`flex-grow h-0.5 transition-colors ${step > s.num ? 'bg-amber-500' : 'bg-white/10'}`} />}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Step 1: Address & Time */}
                            {step === 1 && (
                                <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">Service Location & Time</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Street Address</label>
                                            <input 
                                                type="text" name="street" value={formData.street} onChange={handleChange}
                                                className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-slate-900 focus:bg-[#20202e] focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-600"
                                                placeholder="House/Flat No., Building Name, Street"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">City</label>
                                                <input 
                                                    type="text" name="city" value={formData.city} onChange={handleChange}
                                                    className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-slate-900 focus:bg-[#20202e] focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">PIN/ZIP Code</label>
                                                <input 
                                                    type="text" name="zip" value={formData.zip} onChange={handleChange}
                                                    className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-slate-900 focus:bg-[#20202e] focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-600"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-200">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Service Date</label>
                                                <input 
                                                    type="date" name="date" value={formData.date} onChange={handleChange}
                                                    className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-slate-900 focus:bg-[#20202e] focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all color-scheme-dark"
                                                    style={{colorScheme: 'dark'}}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Preferred Time</label>
                                                <select 
                                                    name="timeSlot" value={formData.timeSlot} onChange={handleChange}
                                                    className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-slate-900 focus:bg-[#20202e] focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
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
                                            if (!formData.street || !formData.city || !formData.date) toast.error('Please fill all fields');
                                            else setStep(2);
                                        }}
                                        className="mt-10 w-full py-5 bg-amber-600 text-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] hover:bg-amber-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Continue to Payment <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Payment */}
                            {step === 2 && (
                                <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">Select Payment Method</h3>
                                    <div className="space-y-4">
                                        {['Card', 'UPI', 'Cash'].map(method => (
                                            <label 
                                                key={method} 
                                                className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                                                    formData.paymentMethod === method 
                                                    ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                                                    : 'border-stone-200 bg-white hover:border-stone-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <input 
                                                        type="radio" name="paymentMethod" value={method} 
                                                        checked={formData.paymentMethod === method}
                                                        onChange={handleChange}
                                                        className="w-5 h-5 text-amber-500 focus:ring-amber-500 bg-white border-stone-200"
                                                    />
                                                    <span className="font-black text-lg text-slate-900">{method === 'Cash' ? 'Cash on Delivery' : method === 'Card' ? 'Credit / Debit Card' : 'UPI Payment'}</span>
                                                </div>
                                                {formData.paymentMethod === method && <CheckCircle2 className="w-6 h-6 text-amber-400" />}
                                            </label>
                                        ))}
                                    </div>

                                    {formData.paymentMethod === 'Card' && (
                                        <div className="mt-8 p-6 bg-white rounded-2xl border border-stone-200">
                                            <p className="text-sm font-bold text-slate-500 text-center mb-4">Secure Payment Mockup</p>
                                            <input type="text" placeholder="Card Number" className="w-full px-5 py-4 mb-4 bg-white border border-stone-200 rounded-xl font-mono text-slate-900 outline-none placeholder:text-slate-600 focus:border-amber-500/50" />
                                            <div className="flex gap-4">
                                                <input type="text" placeholder="MM/YY" className="w-1/2 px-5 py-4 bg-white border border-stone-200 rounded-xl font-mono text-slate-900 outline-none placeholder:text-slate-600 focus:border-amber-500/50" />
                                                <input type="text" placeholder="CVC" className="w-1/2 px-5 py-4 bg-white border border-stone-200 rounded-xl font-mono text-slate-900 outline-none placeholder:text-slate-600 focus:border-amber-500/50" />
                                            </div>
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => setStep(3)}
                                        className="mt-10 w-full py-5 bg-amber-600 text-slate-900 rounded-2xl font-black uppercase tracking-widest shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] hover:bg-amber-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Review Order <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {step === 3 && (
                                <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">Final Review</h3>
                                    
                                    <div className="bg-white p-6 rounded-2xl border border-stone-200 mb-8">
                                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-500 mb-4">Service Details</h4>
                                        <p className="font-bold text-slate-900 mb-1">{formData.street}, {formData.city} - {formData.zip}</p>
                                        <p className="text-sm text-slate-500 font-medium">Scheduled for: {formData.date} at {formData.timeSlot}</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-stone-200 mb-8">
                                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-500 mb-4">Payment Method</h4>
                                        <p className="font-bold text-slate-900">{formData.paymentMethod === 'Cash' ? 'Cash on Delivery' : formData.paymentMethod === 'Card' ? 'Credit / Debit Card' : 'UPI'}</p>
                                    </div>

                                    <button 
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full py-5 bg-amber-600 text-slate-900 rounded-2xl font-black text-lg uppercase tracking-widest shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] hover:bg-amber-500 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm & Pay'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right Side - Summary */}
                        <div className="lg:w-96 shrink-0">
                            <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 text-slate-900 sticky top-32 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
                                {/* Glow Accent */}
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-600/20 rounded-full blur-[50px] pointer-events-none" />

                                <h3 className="text-xl font-black mb-6 relative z-10">Order Summary</h3>
                                
                                <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 relative z-10">
                                    {cart.map(item => (
                                        <div key={item._id} className="flex justify-between gap-4">
                                            <span className="text-slate-500 font-medium text-sm leading-tight">{item.title}</span>
                                            <span className="font-bold text-slate-900 shrink-0">₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="space-y-3 mb-6 pt-6 border-t border-stone-200 relative z-10">
                                    <div className="flex justify-between items-center text-slate-500 text-sm font-medium">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-500 text-sm font-medium">
                                        <span>Taxes & Fees</span>
                                        <span>₹{taxes}</span>
                                    </div>
                                </div>
                                
                                <div className="border-t border-stone-200 pt-6 relative z-10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-black uppercase tracking-widest text-slate-500">Total</span>
                                        <span className="text-4xl font-black tracking-tighter text-amber-400">₹{total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
