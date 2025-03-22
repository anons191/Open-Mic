const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required']
      },
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      zipcode: {
        type: String,
        required: [true, 'Zipcode is required']
      },
      country: {
        type: String,
        default: 'United States'
      },
      formattedAddress: String
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere'
      }
    },
    description: {
      type: String,
      required: [true, 'Please provide a description']
    },
    images: [String],
    capacity: {
      type: Number,
      required: [true, 'Please provide capacity']
    },
    amenities: {
      hasStage: {
        type: Boolean,
        default: true
      },
      hasMicrophone: {
        type: Boolean,
        default: true
      },
      hasLighting: {
        type: Boolean,
        default: false
      },
      hasSoundSystem: {
        type: Boolean,
        default: true
      },
      hasSeating: {
        type: Boolean,
        default: true
      },
      hasParking: {
        type: Boolean,
        default: false
      },
      isAccessible: {
        type: Boolean,
        default: false
      },
      hasBar: {
        type: Boolean,
        default: false
      },
      hasFood: {
        type: Boolean,
        default: false
      }
    },
    contactInfo: {
      email: String,
      phone: String,
      website: String
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    businessHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual fields for events
VenueSchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'venue'
});

VenueSchema.virtual('upcomingEvents', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'venue',
  match: { date: { $gte: new Date() } }
});

module.exports = mongoose.model('Venue', VenueSchema);