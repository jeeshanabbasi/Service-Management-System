const User = require('../models/User');

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Update user availability (provider only)
// @route   PUT /api/users/profile/availability
// @access  Private
const updateAvailability = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.role !== 'provider') {
            res.status(401);
            throw new Error('Only providers can update availability');
        }

        user.isAvailable = req.body.isAvailable;
        await user.save();

        res.status(200).json({
            _id: user._id,
            isAvailable: user.isAvailable
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user details (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const { firstName, lastName, phone, email, isAvailable, isBlocked, skills } = req.body;

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (firstName && lastName) user.name = `${firstName} ${lastName}`;
        if (phone) user.phone = phone;
        if (email) user.email = email;
        if (isAvailable !== undefined) user.isAvailable = isAvailable;
        if (isBlocked !== undefined) user.isBlocked = isBlocked;
        if (skills) user.skills = skills;

        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

module.exports = { getUsers, updateAvailability, updateUser };
