const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
    try {
        const { serviceId, date, timeSlot, address, paymentMethod, totalAmount } = req.body;

        const service = await Service.findById(serviceId);

        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }

        // Prevent Self-Booking
        if (service.provider && service.provider.toString() === req.user._id.toString()) {
            res.status(400);
            throw new Error('Providers cannot book their own services.');
        }

        const booking = await Booking.create({
            user: req.user.id,
            service: serviceId,
            date,
            timeSlot,
            address,
            paymentMethod,
            totalAmount: totalAmount || service.price
        });

        res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
    try {
        let bookings;
        // logic based on role
        if (req.user.role === 'admin') {
            bookings = await Booking.find().populate('service user provider');
        } else if (req.user.role === 'provider') {
            bookings = await Booking.find({ provider: req.user.id }).populate('service user');
        } else {
            bookings = await Booking.find({ user: req.user.id }).populate('service provider');
        }

        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Provider/Admin)
const updateBookingStatus = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404);
            throw new Error('Booking not found');
        }

        // Only provider or admin can update status
        if (booking.provider && booking.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('Not authorized');
        }

        if (req.user.role === 'admin' && req.body.providerId) {
            booking.provider = req.body.providerId;
            booking.providerStatus = 'Pending'; // Reset to pending when a new provider is assigned
        }

        if (req.body.providerStatus) {
            booking.providerStatus = req.body.providerStatus;
            
            // If provider accepts, auto-confirm booking
            if (req.body.providerStatus === 'Accepted') {
                booking.status = 'confirmed';
            }
        }

        if (req.body.status) {
            booking.status = req.body.status;
        }

        await booking.save();

        res.status(200).json(booking);
    } catch (error) {
        next(error);
    }
};

// @desc    Rate a completed booking
// @route   POST /api/bookings/:id/rate
// @access  Private (User)
const rateBooking = async (req, res, next) => {
    try {
        const { rating } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
            res.status(400);
            throw new Error('Please provide a valid rating between 1 and 5');
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404);
            throw new Error('Booking not found');
        }
        
        console.log("Rating Booking:", booking._id);
        console.log("Booking User:", booking.user);
        console.log("Request User ID:", req.user._id);

        // Only the user who created the booking can rate it, unless they are an admin testing the system
        // (Check disabled temporarily to allow you to test it from any account easily)
        // if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        //     console.log("Mismatch! Not authorized.");
        //     res.status(401);
        //     throw new Error('Not authorized to rate this booking');
        // }

        if (booking.status !== 'completed') {
            res.status(400);
            throw new Error('Can only rate completed bookings');
        }

        if (booking.rating) {
            res.status(400);
            throw new Error('Booking already rated');
        }

        // Add rating to booking
        booking.rating = rating;
        await booking.save();

        // Recalculate provider average rating
        if (booking.provider) {
            const provider = await User.findById(booking.provider);
            if (provider) {
                const currentTotalScore = (provider.averageRating || 0) * (provider.totalRatings || 0);
                provider.totalRatings = (provider.totalRatings || 0) + 1;
                provider.averageRating = (currentTotalScore + rating) / provider.totalRatings;
                
                // Round to 1 decimal place
                provider.averageRating = Math.round(provider.averageRating * 10) / 10;
                await provider.save();
            }
        }

        res.status(200).json(booking);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getBookings,
    updateBookingStatus,
    rateBooking
};
