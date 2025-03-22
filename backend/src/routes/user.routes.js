const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

// All routes below this require authentication
router.use(authController.protect);

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', authController.restrictTo('admin'), userController.getAllUsers);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', userController.getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    body('name').optional(),
    body('email').optional().isEmail().withMessage('Please include a valid email'),
    body('phoneNumber').optional(),
    body('bio').optional(),
    body('comedyStyle').optional(),
    body('experienceLevel').optional(),
    body('socialLinks.instagram').optional().isURL().withMessage('Instagram URL is invalid'),
    body('socialLinks.twitter').optional().isURL().withMessage('Twitter URL is invalid'),
    body('socialLinks.youtube').optional().isURL().withMessage('YouTube URL is invalid'),
    body('socialLinks.website').optional().isURL().withMessage('Website URL is invalid')
  ],
  userController.updateUserProfile
);

// @route   GET /api/users/events
// @desc    Get user's events (both attended and performed)
// @access  Private
router.get('/events', userController.getUserEvents);

// @route   GET /api/users/:id
// @desc    Get a user by ID
// @access  Private
router.get('/:id', userController.getUserById);

// @route   PUT /api/users/:id
// @desc    Update a user
// @access  Private/Admin
router.put('/:id', authController.restrictTo('admin'), userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/:id', authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;