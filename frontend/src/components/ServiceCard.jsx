import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
      className={`group bg-[#1c1c1c] border border-white/5 rounded-2xl transition-all duration-300 hover:border-amber-500/30 overflow-hidden flex ${isList ? 'flex-col md:flex-row' : 'flex-col'}`}
    >
      {/* Top Image Section */}
      <div className={`relative overflow-hidden shrink-0 ${isList ? 'w-full md:w-72 h-64 md:h-auto' : 'h-52 w-full'}`}>
        <img
          src={service.image || '/images/default.png'}
          alt={service.title}
          className="w-full h-full object-cover brightness-75 group-hover:brightness-95 transition-all duration-700 group-hover:scale-105"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">{service.rating || '4.9'}</span>
          </div>
        </div>
        
        {/* Bottom Fade Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1c1c1c] to-transparent" />
      </div>

      {/* Content Section */}
      <div className={`flex flex-col flex-grow ${isList ? 'p-8' : 'p-6'}`}>
        <div className="mb-4">
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2 block">
            {service.category} OPTIMIZATION
          </span>
          <h3 className="text-xl font-bold text-white leading-tight group-hover:text-amber-500 transition-colors line-clamp-2">
            {service.title}
          </h3>
        </div>

        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6 line-clamp-2">
          {service.description}
        </p>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Starts At</span>
              <span className="text-xl font-bold text-white">
                ${service.price}.00
              </span>
          </div>

          <button
              onClick={(e) => { e.stopPropagation(); navigate(`/services/${service._id}`); }}
              className="px-6 py-2.5 bg-[#f3a953] hover:bg-amber-400 text-slate-900 rounded-lg font-bold text-sm transition-colors"
          >
              Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
