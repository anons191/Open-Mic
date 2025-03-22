const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../config/auth');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });
    
    // Generate JWT
    const token = user.getSignedJwtToken();
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt with:', { email, passwordProvided: !!password });
    
    // Validate email & password
    if (!email || !password) {
      console.log('Email or password missing');
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('User found:', { id: user._id, role: user.role });
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = user.getSignedJwtToken();
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    // The user should be available from the middleware
    if (!req.user || !req.user._id) {
      console.log('User not found in /me route');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Error in /me route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/auth/test-user
// @desc    Check if any users exist in the database
// @access  Public
router.get('/test-user', async (req, res) => {
  try {
    // Get user count
    const userCount = await User.countDocuments({});
    
    res.status(200).json({
      success: true,
      message: userCount > 0 ? 'Users exist in database' : 'No users in database',
      count: userCount
    });
  } catch (error) {
    console.error('Error in test-user route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/auth/check-env
// @desc    Check if JWT_SECRET is properly set
// @access  Public
router.get('/check-env', (req, res) => {
  console.log('Environment check');
  if (!process.env.JWT_SECRET) {
    console.log('JWT_SECRET is missing');
    return res.status(500).json({ success: false, message: 'JWT_SECRET is not set' });
  }
  if (process.env.JWT_SECRET.length < 10) {
    console.log('JWT_SECRET is too short');
    return res.status(500).json({ success: false, message: 'JWT_SECRET is too short' });
  }
  return res.status(200).json({ 
    success: true, 
    message: 'JWT_SECRET is properly set',
    jwtSecretLength: process.env.JWT_SECRET.length,
    nodeEnv: process.env.NODE_ENV || 'not set'
  });
});

module.exports = router;