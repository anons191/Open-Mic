const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const eventController = require('../controllers/event.controller');
const authController = require('../controllers/auth.controller');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', eventController.getAllEvents);

// @route   GET /api/events/upcoming
// @desc    Get upcoming events
// @access  Public
router.get('/upcoming', eventController.getUpcomingEvents);

// Routes below require authentication
router.use(authController.protect);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (venue owners and admins)
router.post(
  '/',
  authController.restrictTo('venue_owner', 'admin'),
  [
    body('name').notEmpty().withMessage('Event name is required'),
    body('venue').isMongoId().withMessage('Valid venue ID is required'),
    body('date').isDate().withMessage('Valid date is required'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('totalSlots').isNumeric().withMessage('Total slots must be a number'),
    body('slotDuration').isNumeric().withMessage('Slot duration must be a number')
  ],
  eventController.createEvent
);

// @route   GET /api/events/:id
// @desc    Get a single event
// @access  Public
router.get('/:id', eventController.getEvent);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (event creator or admin)
router.put(
  '/:id',
  authController.restrictTo('venue_owner', 'admin'),
  eventController.updateEvent
);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (event creator or admin)
router.delete(
  '/:id',
  authController.restrictTo('venue_owner', 'admin'),
  eventController.deleteEvent
);

// @route   POST /api/events/:id/performers
// @desc    Register as a performer for an event
// @access  Private
router.post(
  '/:id/performers',
  eventController.registerPerformer
);

// @route   DELETE /api/events/:id/performers
// @desc    Unregister as a performer from an event
// @access  Private
router.delete(
  '/:id/performers',
  eventController.unregisterPerformer
);

// @route   POST /api/events/:id/attendees
// @desc    Register as an attendee for an event
// @access  Private
router.post(
  '/:id/attendees',
  eventController.registerAttendee
);

// @route   DELETE /api/events/:id/attendees
// @desc    Unregister as an attendee from an event
// @access  Private
router.delete(
  '/:id/attendees',
  eventController.unregisterAttendee
);

// @route   GET /api/events/:id/performers
// @desc    Get all performers for an event
// @access  Public
router.get('/:id/performers', eventController.getEventPerformers);

// @route   GET /api/events/:id/attendees
// @desc    Get all attendees for an event
// @access  Private (event creator or admin)
router.get(
  '/:id/attendees',
  authController.restrictTo('venue_owner', 'admin'),
  eventController.getEventAttendees
);

// @route   PUT /api/events/:id/cancel
// @desc    Cancel an event
// @access  Private (event creator or admin)
router.put(
  '/:id/cancel',
  authController.restrictTo('venue_owner', 'admin'),
  eventController.cancelEvent
);

module.exports = router;