const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      maxlength: 500
    },
    isApproved: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent users from submitting more than one review per venue
ReviewSchema.index({ user: 1, venue: 1 }, { unique: true });

// Update venue rating after review is submitted
ReviewSchema.statics.calcAverageRating = async function(venueId) {
  const stats = await this.aggregate([
    {
      $match: { venue: venueId }
    },
    {
      $group: {
        _id: '$venue',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Venue').findByIdAndUpdate(venueId, {
      rating: stats[0].avgRating,
      numReviews: stats[0].numReviews
    });
  } else {
    await mongoose.model('Venue').findByIdAndUpdate(venueId, {
      rating: 0,
      numReviews: 0
    });
  }
};

// Call calcAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.venue);
});

// Call calcAverageRating before remove
ReviewSchema.pre('remove', function() {
  this.constructor.calcAverageRating(this.venue);
});

module.exports = mongoose.model('Review', ReviewSchema);