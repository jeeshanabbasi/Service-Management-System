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

        // Create Admin
        const admin = await User.create({
            firstName: 'System',
            lastName: 'Admin',
            name: 'System Admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        // Create providers
        const provider1 = await User.create({
            firstName: 'Dev',
            lastName: 'One',
            name: 'Dev',
            email: 'dev@example.com',
            password: 'password123',
            role: 'provider'
        });

        const provider2 = await User.create({
            firstName: 'Dev',
            lastName: 'Two',
            name: 'Dev 2',
            email: 'dev2@example.com',
            password: 'password123',
            role: 'provider'
        });

        // Create a customer
        const customer = await User.create({
            firstName: 'John',
            lastName: 'Doe',
            name: 'John Doe',
            email: 'user@example.com',
            password: 'password123',
            role: 'user'
        });

        // Add dummy services
        const services = [
            {
                title: 'Power Saver AC Servicing',
                description: 'Foam jet AC service, includes deep cleaning of indoor & outdoor units.',
                category: 'AC Repair',
                price: 599,
                image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800',
                rating: 4.8,
                provider: provider1._id
            },
            {
                title: 'Intense Deep Home Cleaning',
                description: 'Professional cleaning of all rooms, bathrooms, and kitchen.',
                category: 'Cleaning',
                price: 2499,
                image: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?auto=format&fit=crop&q=80&w=800',
                rating: 4.7,
                provider: provider2._id
            },
            {
                title: 'Bathroom & Kitchen Plumbing Fix',
                description: 'Fixing leaks, blockages, and installing new taps/pipes.',
                category: 'Plumber',
                price: 249,
                image: 'https://images.unsplash.com/photo-1585704032915-c3400ca1f965?auto=format&fit=crop&q=80&w=800',
                rating: 4.9,
                provider: provider1._id
            },
            {
                title: 'Premium Home Painting',
                description: 'Transform your space with our premium painting services. Includes surface preparation and 2 coats of paint.',
                category: 'Painting',
                price: 5999,
                image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=800',
                rating: 4.6,
                provider: provider2._id
            },
            {
                title: 'Smart Home Installation',
                description: 'Setup and configure smart locks, cameras, and lighting systems.',
                category: 'Electrician',
                price: 1499,
                image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
                rating: 4.9,
                provider: provider1._id
            },
            {
                title: 'Luxury Spa Experience',
                description: 'Rejuvenating massage and facial treatments right in your living room.',
                category: 'Salon',
                price: 1899,
                image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
                rating: 4.9,
                provider: provider2._id
            }
        ];

        const createdServices = await Service.insertMany(services);

        // Add dummy bookings
        const bookings = [
            {
                user: customer._id,
                service: createdServices[0]._id,
                provider: provider1._id,
                date: new Date(),
                timeSlot: '11:00 AM - 01:00 PM',
                address: {
                    street: '123 Luxury Lane',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zip: '400001'
                },
                paymentMethod: 'UPI',
                totalAmount: 599,
                status: 'confirmed',
                providerStatus: 'Accepted'
            },
            {
                user: customer._id,
                service: createdServices[1]._id,
                provider: provider2._id,
                date: new Date(),
                timeSlot: '02:00 PM - 04:00 PM',
                address: {
                    street: '456 Business Park',
                    city: 'Delhi',
                    state: 'Delhi',
                    zip: '110001'
                },
                paymentMethod: 'Card',
                totalAmount: 2499,
                status: 'pending',
                providerStatus: 'Pending'
            }
        ];

        await Booking.insertMany(bookings);

        console.log('Dummy Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
