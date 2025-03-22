const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const authController = require('../controllers/auth.controller');

// @route   GET /api/venues/:venueId/reviews
// @desc    Get all reviews for a venue
// @access  Public
router.get('/', reviewController.getReviews);

// Routes below require authentication
router.use(authController.protect);

// @route   POST /api/venues/:venueId/reviews
// @desc    Create a new review
// @access  Private
router.post(
  '/',
  [
    body('rating')
      .isNumeric()
      .withMessage('Rating must be a number')
      .isFloat({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .notEmpty()
      .withMessage('Comment is required')
      .isLength({ max: 500 })
      .withMessage('Comment cannot be more than 500 characters'),
    body('title')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Title cannot be more than 100 characters')
  ],
  reviewController.createReview
);

// @route   GET /api/venues/:venueId/reviews/:id
// @desc    Get a single review
// @access  Public
router.get('/:id', reviewController.getReview);

// @route   PUT /api/venues/:venueId/reviews/:id
// @desc    Update a review
// @access  Private (review owner or admin)
router.put(
  '/:id',
  [
    body('rating')
      .optional()
      .isNumeric()
      .withMessage('Rating must be a number')
      .isFloat({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .notEmpty()
      .withMessage('Comment is required')
      .isLength({ max: 500 })
      .withMessage('Comment cannot be more than 500 characters'),
    body('title')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Title cannot be more than 100 characters')
  ],
  reviewController.updateReview
);

// @route   DELETE /api/venues/:venueId/reviews/:id
// @desc    Delete a review
// @access  Private (review owner or admin)
router.delete('/:id', reviewController.deleteReview);

module.exports = router;