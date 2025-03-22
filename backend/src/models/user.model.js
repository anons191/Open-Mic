const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['comedian', 'venue_owner', 'admin'],
      default: 'comedian'
    },
    bio: {
      type: String,
      default: ''
    },
    photo: {
      type: String,
      default: 'default.jpg'
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      formattedAddress: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    comedyStyle: {
      type: String,
      enum: ['observational', 'dark', 'absurdist', 'one-liner', 'improv', 'other'],
      default: 'other'
    },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'professional'],
      default: 'beginner'
    },
    eventsAttended: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      }
    ],
    eventsPerformed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      }
    ],
    socialLinks: {
      instagram: String,
      twitter: String,
      youtube: String,
      website: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Encrypt password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual field for upcoming events
UserSchema.virtual('upcomingEvents', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'attendees',
  match: { date: { $gte: new Date() } }
});

module.exports = mongoose.model('User', UserSchema);