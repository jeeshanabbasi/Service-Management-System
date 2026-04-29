const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
    try {
        const services = await Service.find().populate('provider', 'name email');
        res.status(200).json(services);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id).populate('provider', 'name email');
        
        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }

        res.status(200).json(service);
    } catch (error) {
        next(error);
    }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Provider or Admin
const createService = async (req, res, next) => {
    try {
        // Add provider to req.body based on logged in user
        req.body.provider = req.user.id;

        const service = await Service.create(req.body);

        res.status(201).json(service);
    } catch (error) {
        next(error);
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Provider or Admin
const updateService = async (req, res, next) => {
    try {
        let service = await Service.findById(req.params.id);

        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }

        // Make sure user is service provider or admin
        if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('Not authorized to update this service');
        }

        service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json(service);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Provider or Admin
const deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }

        if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('Not authorized to delete this service');
        }

        await Service.findByIdAndDelete(req.params.id);

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
