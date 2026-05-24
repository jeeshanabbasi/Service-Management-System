import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Check, ArrowUpRight, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CartContext } from '../context/CartContext';

const ServiceCard = ({ service, variant = 'grid' }) => {
  const { cart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(service);
  };

  const added = cart.some(item => item._id === service?._id);
  const isList = variant === 'list';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group bg-gradient-to-b from-slate-900 to-[#0B1120] border border-slate-800/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-[2rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:border-amber-500/30 relative overflow-hidden flex ${isList ? 'flex-col md:flex-row gap-6 p-5' : 'flex-col p-0'}`}
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-amber-500/10 transition-colors duration-700 pointer-events-none" />

      {/* Visual Header */}
      <div className={`relative overflow-hidden shrink-0 ${isList ? 'w-full md:w-60 h-60 md:h-auto rounded-2xl' : 'aspect-[1.2/1] mb-6'}`}>
        <img
          src={service.image || '/images/default.png'}
          alt={service.title}
          className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-95"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
            <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/services/${service._id}`); }}
                className="w-full py-3 bg-amber-500 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl hover:bg-amber-400">
                Explore Details <ArrowUpRight className="w-4 h-4" />
            </button>
        </div>
        
        {/* Category Label */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-slate-900/80 backdrop-blur-md shadow-2xl border border-slate-700 text-amber-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
            {service.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className={`flex flex-col flex-grow min-w-0 ${isList ? 'py-2 justify-center' : 'px-6 pb-8'} relative z-10`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="text-[10px] font-black text-amber-400">{service.rating || '4.9'}</span>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-amber-500" /> Premium Service
                </span>
            </div>
            <h3 className={`${isList ? 'text-2xl' : 'text-xl'} font-black text-white leading-[1.15] tracking-tight group-hover:text-amber-400 transition-colors line-clamp-2`}>
                {service.title}
            </h3>
          </div>
        </div>

        <p className={`text-slate-400 font-medium leading-relaxed mb-6 ${isList ? 'text-sm' : 'text-sm'} line-clamp-2`}>
          {service.description}
        </p>

        {/* Footer Actions */}
        <div className={`mt-auto flex items-center justify-between gap-4 ${isList ? 'pt-6 border-t border-slate-800/60' : ''}`}>
          <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Starting from</span>
              <span className={`${isList ? 'text-3xl' : 'text-2xl'} font-black text-white tracking-tighter`}>
                ₹{service.price}
              </span>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className={`flex items-center justify-center rounded-xl transition-all duration-500 ${
                added
                    ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30'
                    : 'bg-white text-slate-900 hover:bg-amber-500 shadow-xl shadow-white/10 hover:shadow-amber-500/20'
                } ${isList ? 'px-6 py-3 text-xs font-black uppercase tracking-widest' : 'w-12 h-12'}`}
            >
                {added ? (
                    <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        {isList && "In Cart"}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        {isList && "Add to Cart"}
                    </div>
                )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
