const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Service = require('./models/Service');
const Booking = require('./models/Booking');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
    try {
        await User.deleteMany();
        await Service.deleteMany();
        await Booking.deleteMany();

        // Create provider
        const providerUser = await User.create({
            name: 'Urban Expert',
            email: 'expert@urban.com',
            password: 'password123',
            role: 'provider'
        });

        // Add dummy services
        const services = [
            {
                title: 'Power Saver AC Servicing',
                description: 'Foam jet AC service, includes deep cleaning of indoor & outdoor units. Best for enhancing cooling & saving electricity.',
                category: 'AC Repair',
                price: 599,
                image: '/images/ac_repair.png',
                rating: 4.8,
                provider: providerUser._id
            },
            {
                title: 'Intense Deep Home Cleaning',
                description: 'Professional cleaning of all rooms, bathrooms, and kitchen. Includes floor scrubbing, dusting & cobweb removal.',
                category: 'Cleaning',
                price: 2499,
                image: '/images/house_cleaning.png',
                rating: 4.7,
                provider: providerUser._id
            },
            {
                title: 'Bathroom & Kitchen Plumbing Fix',
                description: 'Fixing leaks, blockages, and installing new taps/pipes. Experienced professionals with all tools.',
                category: 'Plumber',
                price: 249,
                image: '/images/plumbing.png',
                rating: 4.9,
                provider: providerUser._id
            },
            {
                title: 'Premium Salon & Spa at Home',
                description: 'Relaxing spa, massage, facial and manicure setup by trained experts right in your living room.',
                category: 'Salon',
                price: 1299,
                image: '/images/salon.png',
                rating: 4.9,
                provider: providerUser._id
            }
        ];

        await Service.insertMany(services);

        console.log('Dummy Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
