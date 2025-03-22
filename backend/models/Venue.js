const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a venue name'],
    trim: true
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please add a street address']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    zipcode: {
      type: String,
      required: [true, 'Please add a zipcode']
    }
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  showTitle: {
    type: String,
    required: [true, 'Please add a show title']
  },
  operatingHours: {
    type: String,
    required: [true, 'Please add operating hours']
  },
  price: {
    type: Number,
    default: 0
  },
  drinkMinimum: {
    type: Number,
    default: 0
  },
  performerSlots: {
    type: Number,
    default: 10
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  capacity: {
    type: Number
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Venue', VenueSchema);