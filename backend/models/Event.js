const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an event name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  startTime: {
    type: String,
    required: [true, 'Please add a start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please add an end time']
  },
  cost: {
    type: Number,
    default: 0
  },
  totalSlots: {
    type: Number,
    required: [true, 'Please add total performance slots']
  },
  slotDuration: {
    type: Number,
    default: 5,  // 5 minutes
    required: [true, 'Please add slot duration in minutes']
  },
  performers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      slotNumber: Number
    }
  ],
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  status: {
    type: String,
    enum: ['scheduled', 'cancelled', 'completed'],
    default: 'scheduled'
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field for available slots
EventSchema.virtual('availableSlots').get(function() {
  return this.totalSlots - this.performers.length;
});

module.exports = mongoose.model('Event', EventSchema);