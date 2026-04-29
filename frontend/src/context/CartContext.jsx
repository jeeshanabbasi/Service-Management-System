import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('servicio_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('servicio_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (service) => {
        setCart((prevCart) => {
            const existing = prevCart.find(item => item._id === service._id);
            if (existing) {
                toast('Service is already in your cart!', { icon: 'ℹ️' });
                return prevCart;
            }
            toast.success(`${service.title} added to cart!`, {
                icon: '🛒',
                className: 'font-black text-sm rounded-2xl shadow-premium',
            });
            return [...prevCart, service];
        });
    };

    const removeFromCart = (serviceId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== serviceId));
        toast.success('Item removed from cart');
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + Number(item.price || 0), 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
