const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        // Connect to the database
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/service-booking');
        console.log('MongoDB Connected...');

        // Check if admin already exists
        let admin = await User.findOne({ email: 'admin@servicio.com' });

        if (admin) {
            // Update existing user to be admin and reset password
            admin.role = 'admin';
            admin.password = 'admin123'; // Pre-save hook will hash this
            await admin.save();
            console.log('Admin user updated successfully!');
        } else {
            // Create a new admin user
            admin = await User.create({
                firstName: 'Super',
                lastName: 'Admin',
                name: 'Super Admin',
                email: 'admin@servicio.com',
                password: 'admin123', // Pre-save hook will hash this
                role: 'admin',
                phone: '1234567890'
            });
            console.log('Admin user created successfully!');
        }

        console.log('\n--- ADMIN CREDENTIALS ---');
        console.log('Email: admin@servicio.com');
        console.log('Password: admin123');
        console.log('-------------------------\n');

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
