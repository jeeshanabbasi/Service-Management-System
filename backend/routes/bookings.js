const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus, rateBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createBooking)
    .get(protect, getBookings);

router.route('/:id')
    .put(protect, authorize('provider', 'admin'), updateBookingStatus);

router.route('/:id/rate')
    .post(protect, rateBooking);

module.exports = router;
