const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service',
        required: true
    },
    provider: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        required: [true, 'Please add a date for the booking']
    },
    timeSlot: {
        type: String,
        required: [true, 'Please add a time slot']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    providerStatus: {
        type: String,
        enum: ['None', 'Pending', 'Accepted', 'Rejected'],
        default: 'None'
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        zip: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'UPI'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
