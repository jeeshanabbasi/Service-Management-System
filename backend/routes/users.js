const express = require('express');
const router = express.Router();
const { getUsers, updateAvailability, updateUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('admin'), getUsers);

router.route('/profile/availability')
    .put(protect, authorize('provider'), updateAvailability);

router.route('/:id')
    .put(protect, authorize('admin'), updateUser);

module.exports = router;
