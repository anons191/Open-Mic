const users = [
  {
    name: 'John Comedian',
    email: 'john@example.com',
    password: 'password123',
    role: 'comedian',
    bio: 'Stand-up comedian specializing in observational humor.'
  },
  {
    name: 'Jane Owner',
    email: 'jane@example.com',
    password: 'password123',
    role: 'venue_owner',
    bio: 'Owner of The Laugh Factory comedy club.'
  },
  {
    name: 'Bob Performer',
    email: 'bob@example.com',
    password: 'password123',
    role: 'comedian',
    bio: 'Improv comedian with 5 years of experience.'
  },
  {
    name: 'Alice Guest',
    email: 'alice@example.com',
    password: 'password123',
    role: 'guest',
    bio: 'Comedy enthusiast who loves attending open mics.'
  }
];

const venues = [
  {
    name: 'The Laugh Factory',
    address: {
      street: '123 Comedy Lane',
      city: 'New York',
      state: 'NY',
      zipcode: '10001'
    },
    location: {
      type: 'Point',
      coordinates: [-73.9851, 40.7484]
    },
    description: 'A premier comedy club in the heart of New York City featuring top comedians and open mic nights.',
    capacity: 120,
    // owner will be set dynamically to Jane Owner's ID
  },
  {
    name: 'Chuckle Hut',
    address: {
      street: '456 Joke Street',
      city: 'Los Angeles',
      state: 'CA',
      zipcode: '90028'
    },
    location: {
      type: 'Point',
      coordinates: [-118.3252, 34.0981]
    },
    description: 'Intimate venue hosting both established comedians and newcomers in a casual atmosphere.',
    capacity: 80,
    // owner will be set dynamically to Jane Owner's ID
  }
];

const events = [
  {
    name: 'Wednesday Open Mic',
    description: 'Weekly open mic night for comedians of all levels. 5-minute slots available on a first-come, first-served basis.',
    // venue will be set dynamically to The Laugh Factory's ID
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    startTime: '8:00 PM',
    endTime: '11:00 PM',
    cost: 0,
    totalSlots: 15,
    slotDuration: 5,
    status: 'scheduled'
  },
  {
    name: 'Weekend Showcase',
    description: 'Featuring our top performing comedians from recent open mics, plus a professional headliner.',
    // venue will be set dynamically to The Laugh Factory's ID
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    startTime: '9:00 PM',
    endTime: '11:30 PM',
    cost: 15,
    totalSlots: 5,
    slotDuration: 15,
    status: 'scheduled'
  },
  {
    name: 'Comedy Workshop',
    description: 'Learn stand-up fundamentals, joke writing, and performance techniques from professional comedians.',
    // venue will be set dynamically to Chuckle Hut's ID
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    startTime: '6:00 PM',
    endTime: '9:00 PM',
    cost: 25,
    totalSlots: 10,
    slotDuration: 10,
    status: 'scheduled'
  }
];

module.exports = {
  users,
  venues,
  events
};