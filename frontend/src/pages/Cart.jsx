import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
    const { cart, removeFromCart, getCartTotal } = useContext(CartContext);
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#faf9f6] pt-32 pb-20 flex flex-col items-center justify-center">
                <div className="w-32 h-32 bg-white border border-stone-200 rounded-full flex items-center justify-center mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <ShoppingBag className="w-12 h-12 text-slate-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Your cart is empty</h2>
                <p className="text-slate-500 mb-8 font-medium">Looks like you haven't added any services yet.</p>
                <button 
                    onClick={() => navigate('/services')}
                    className="px-8 py-4 bg-amber-600 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)]"
                >
                    Browse Services
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9f6] pt-32 pb-20 selection:bg-amber-500/30">
            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-10">Your Cart</h1>
                
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-grow space-y-6">
                        {cart.map((item, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={item._id} 
                                className="bg-white p-6 rounded-[2rem] border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center gap-6 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] transition-shadow duration-300"
                            >
                                <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-stone-200">
                                    <img 
                                        src={item.image || '/images/default.png'} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                </div>
                                <div className="flex-grow text-center sm:text-left">
                                    <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 inline-block">
                                        {item.category}
                                    </span>
                                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>
                                </div>
                                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                                    <span className="text-2xl font-black text-amber-400 tracking-tighter">₹{item.price}</span>
                                    <button 
                                        onClick={() => removeFromCart(item._id)}
                                        className="p-3 text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-slate-900 rounded-xl transition-colors border border-red-500/20 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="lg:w-96 shrink-0">
                        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 text-slate-900 sticky top-32 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
                            {/* Glow Accent */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-600/20 rounded-full blur-[50px] pointer-events-none" />

                            <h3 className="text-xl font-black mb-8 relative z-10">Order Summary</h3>
                            
                            <div className="space-y-4 mb-8 relative z-10">
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Subtotal ({cart.length} items)</span>
                                    <span className="text-slate-900">₹{getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Taxes & Fees (10%)</span>
                                    <span className="text-slate-900">₹{Math.round(getCartTotal() * 0.1)}</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-stone-200 pt-6 mb-8 relative z-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-500">Total</span>
                                    <span className="text-4xl font-black tracking-tighter text-amber-400">₹{getCartTotal() + Math.round(getCartTotal() * 0.1)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate('/checkout')}
                                className="w-full py-5 bg-amber-600 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-500 transition-colors flex items-center justify-center gap-3 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] relative z-10"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
