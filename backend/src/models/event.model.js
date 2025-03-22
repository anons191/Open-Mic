const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true
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
      required: [true, 'Event date is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    description: {
      type: String,
      required: [true, 'Please provide a description']
    },
    eventType: {
      type: String,
      enum: ['open_mic', 'showcase', 'competition', 'workshop', 'other'],
      default: 'open_mic'
    },
    coverImage: {
      type: String,
      default: 'default-event.jpg'
    },
    cost: {
      type: Number,
      default: 0
    },
    totalSlots: {
      type: Number,
      required: [true, 'Please provide the total number of performance slots']
    },
    slotDuration: {
      type: Number,
      default: 5, // in minutes
      required: [true, 'Please provide the slot duration in minutes']
    },
    performers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        slotNumber: Number,
        startTime: String,
        isConfirmed: {
          type: Boolean,
          default: false
        }
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
    isPrivate: {
      type: Boolean,
      default: false
    },
    experience: {
      type: String,
      enum: ['all_levels', 'beginner_friendly', 'intermediate', 'advanced'],
      default: 'all_levels'
    },
    tags: [String],
    notes: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for available slots count
EventSchema.virtual('availableSlots').get(function() {
  return this.totalSlots - this.performers.length;
});

// Middleware to check if event is in the past
EventSchema.pre('save', function(next) {
  if (new Date(this.date) < new Date() && this.status === 'scheduled') {
    this.status = 'completed';
  }
  next();
});

module.exports = mongoose.model('Event', EventSchema);