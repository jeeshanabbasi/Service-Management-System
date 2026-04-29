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
      whileHover={{ y: -5 }}
      className={`group bg-gradient-to-br from-white to-amber-50/60 rounded-[2.5rem] border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.15)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden flex ${isList ? 'flex-col md:flex-row gap-8 p-6' : 'flex-col p-0'}`}
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

      {/* Image Container */}
      <div className={`relative overflow-hidden rounded-[2rem] shrink-0 border border-stone-100 ${isList ? 'w-full md:w-64 h-64 md:h-auto' : 'aspect-[11/10] mb-6'}`}>
        <img
          src={service.image || '/images/default.png'}
          alt={service.title}
          className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-500 flex items-end p-6">
            <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/services/${service._id}`); }}
                className="w-full py-3 bg-white/90 backdrop-blur-md border border-white/50 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl hover:bg-white">
                Quick View <ArrowUpRight className="w-3 h-3" />
            </button>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md shadow-lg border border-stone-200 text-amber-600 text-[9px] font-black uppercase tracking-widest rounded-full">
            {service.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-grow min-w-0 z-10 ${isList ? 'py-2' : 'p-6 pt-0'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    <span className="text-[9px] font-black text-amber-600">{service.rating || '4.8'}</span>
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-amber-500" /> Mumbai
                </span>
            </div>
            <h3 className={`${isList ? 'text-3xl' : 'text-xl'} font-black text-slate-900 leading-tight group-hover:text-amber-600 transition-colors line-clamp-2`}>
                {service.title}
            </h3>
          </div>
          {isList && (
            <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">Starting From</span>
                <span className="text-4xl font-black text-amber-600 leading-none tracking-tighter">
                    ₹{service.price}
                </span>
            </div>
          )}
        </div>

        <p className={`text-slate-500 font-medium leading-relaxed mb-8 ${isList ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
          {service.description}
        </p>

        <div className={`mt-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 ${isList ? 'pt-8 border-t border-stone-200' : ''}`}>
          {!isList && (
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Premium Rate</span>
                <span className="text-2xl font-black text-amber-600 leading-none">
                ₹{service.price}
                </span>
            </div>
          )}

          {isList && (
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                        <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</p>
                        <p className="text-sm font-black text-slate-700">45-60 Mins</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-amber-600 font-black text-xs uppercase tracking-widest group/btn hover:text-amber-500 transition-colors">
                    Read Reviews <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </button>
            </div>
          )}

          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            {isList && (
                <button className="px-5 py-3 sm:px-8 sm:py-4 bg-amber-500 text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    Book Appointment
                </button>
            )}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className={`flex items-center justify-center rounded-2xl transition-all duration-500 ${
                added
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border-none'
                    : 'bg-white border border-stone-200 text-amber-500 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/30'
                } ${isList ? 'w-14 h-14' : 'w-12 h-12 shadow-sm'}`}
            >
                {added ? (
                <Check className="w-6 h-6" />
                ) : (
                <ShoppingBag className="w-5 h-5" />
                )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
