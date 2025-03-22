const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const venueController = require('../controllers/venue.controller');
const authController = require('../controllers/auth.controller');
const reviewRouter = require('./review.routes');

// Re-route to review router if route is for venue reviews
router.use('/:venueId/reviews', reviewRouter);

// @route   GET /api/venues
// @desc    Get all venues
// @access  Public
router.get('/', venueController.getAllVenues);

// @route   GET /api/venues/radius/:zipcode/:distance
// @desc    Get venues within a radius of zipcode
// @access  Public
router.get('/radius/:zipcode/:distance', venueController.getVenuesInRadius);

// Routes below require authentication
router.use(authController.protect);

// @route   POST /api/venues
// @desc    Create a new venue
// @access  Private (venue owners and admins)
router.post(
  '/',
  authController.restrictTo('venue_owner', 'admin'),
  [
    body('name').notEmpty().withMessage('Venue name is required'),
    body('address.street').notEmpty().withMessage('Street address is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    body('address.zipcode').notEmpty().withMessage('Zipcode is required'),
    body('location.coordinates').isArray().withMessage('Location coordinates must be an array'),
    body('description').notEmpty().withMessage('Description is required'),
    body('capacity').isNumeric().withMessage('Capacity must be a number')
  ],
  venueController.createVenue
);

// @route   GET /api/venues/:id
// @desc    Get a single venue
// @access  Public
router.get('/:id', venueController.getVenue);

// @route   PUT /api/venues/:id
// @desc    Update a venue
// @access  Private (venue owner or admin)
router.put(
  '/:id',
  authController.restrictTo('venue_owner', 'admin'),
  venueController.updateVenue
);

// @route   DELETE /api/venues/:id
// @desc    Delete a venue
// @access  Private (venue owner or admin)
router.delete(
  '/:id',
  authController.restrictTo('venue_owner', 'admin'),
  venueController.deleteVenue
);

// @route   GET /api/venues/:id/events
// @desc    Get all events for a venue
// @access  Public
router.get('/:id/events', venueController.getVenueEvents);

module.exports = router;