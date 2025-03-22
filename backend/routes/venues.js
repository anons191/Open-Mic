const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const { protect } = require('../config/auth');

// @route   GET /api/venues
// @desc    Get all venues
// @access  Public
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/venues/:id
// @desc    Get single venue
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    
    res.status(200).json({
      success: true,
      data: venue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/venues
// @desc    Create new venue
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Any authenticated user can create a venue
    const venue = await Venue.create(req.body);
    
    res.status(201).json({
      success: true,
      data: venue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/venues/:id
// @desc    Update venue
// @access  Private (anyone can update venue details)
router.put('/:id', protect, async (req, res) => {
  try {
    let venue = await Venue.findById(req.params.id);
    
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    
    venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: venue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/venues/:id
// @desc    Delete venue
// @access  Private (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    
    // Check if user is admin (only admins can delete venues)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete venues' });
    }
    
    await venue.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;