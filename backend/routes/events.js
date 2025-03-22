const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Venue = require('../models/Venue');
const { protect } = require('../config/auth');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Build query
    let query = Event.find()
      .populate('venue', 'name address showTitle')
      .populate('host', 'name');
    
    // Filter by date (future events by default)
    if (!req.query.showPast) {
      query = query.where('date').gte(new Date());
    }
    
    // Filter by host
    if (req.query.host) {
      query = query.where('host').equals(req.query.host);
    }
    
    // Filter by venue
    if (req.query.venue) {
      query = query.where('venue').equals(req.query.venue);
    }
    
    // Filter by cost (free events)
    if (req.query.isFree === 'true') {
      query = query.where('cost').equals(0);
    }
    
    // Sort (default: by date, ascending)
    query = query.sort('date');
    
    const events = await query;
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('venue', 'name address description showTitle operatingHours drinkMinimum')
      .populate('host', 'name bio photo')
      .populate('performers.user', 'name bio photo')
      .populate('attendees', 'name');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (host only)
router.post('/', protect, async (req, res) => {
  try {
    // Verify venue exists
    const venue = await Venue.findById(req.body.venue);
    
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    
    // Check if user is a host
    if (req.user.role !== 'host') {
      return res.status(403).json({ message: 'Only hosts can create events' });
    }
    
    // Add host to the event data
    req.body.host = req.user.id;
    
    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (hosts can only update their own events)
router.put('/:id', protect, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the host of this event
    if (req.user.role !== 'host' || event.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }
    
    // Don't allow changing the host
    if (req.body.host && req.body.host !== req.user.id) {
      delete req.body.host; // Remove host field if it's being changed
    }
    
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/events/:id/perform
// @desc    Register as performer for event
// @access  Private
router.post('/:id/perform', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if event is in the future
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot register for past events' });
    }
    
    // Check if slots are available
    if (event.performers.length >= event.totalSlots) {
      return res.status(400).json({ message: 'No slots available' });
    }
    
    // Check if user is already registered as performer
    if (event.performers.some(performer => performer.user.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Already registered as performer' });
    }
    
    // Add user to performers
    event.performers.push({
      user: req.user.id,
      slotNumber: event.performers.length + 1
    });
    
    await event.save();
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/events/:id/attend
// @desc    Register as attendee for event
// @access  Private
router.post('/:id/attend', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if event is in the future
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot register for past events' });
    }
    
    // Check if user is already registered as attendee
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already registered as attendee' });
    }
    
    // Add user to attendees
    event.attendees.push(req.user.id);
    
    await event.save();
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;