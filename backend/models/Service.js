const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a service title'],
        trim: true,
        maxlength: [50, 'Title can not be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Please specify a category'],
        enum: ['Plumber', 'Electrician', 'Carpentry', 'Cleaning', 'AC Repair', 'Painting', 'Salon', 'Other']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    image: {
        type: String,
        default: '/images/default.png'
    },
    rating: {
        type: Number,
        default: 4.5
    },
    provider: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
