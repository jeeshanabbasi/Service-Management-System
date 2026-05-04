const Booking = require('../models/Booking');
const Service = require('../models/Service');

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

module.exports = {
    createBooking,
    getBookings,
    updateBookingStatus
};
