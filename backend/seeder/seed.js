const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Venue = require('../models/Venue');
const Event = require('../models/Event');
const { users, venues, events } = require('./data');
const path = require('path');

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Check if MongoDB URI is available
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in the environment variables!');
  console.log('Please check your .env file in the backend directory.');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected Successfully');
}).catch(err => {
  console.error('MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Hash passwords before seeding
const prepareUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  return Promise.all(
    users.map(async user => {
      user.password = await bcrypt.hash(user.password, salt);
      return user;
    })
  );
};

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Venue.deleteMany();
    await Event.deleteMany();

    console.log('Existing data cleared');

    // Import users with hashed passwords
    const preparedUsers = await prepareUsers();
    const createdUsers = await User.insertMany(preparedUsers);
    console.log(`${createdUsers.length} users created`);
    
    // Find user IDs
    const venueOwner = createdUsers.find(user => user.role === 'venue_owner');
    
    // Add owner to venues
    const venuesWithOwner = venues.map(venue => {
      return { ...venue, owner: venueOwner._id };
    });
    
    // Import venues
    const createdVenues = await Venue.insertMany(venuesWithOwner);
    console.log(`${createdVenues.length} venues created`);
    
    // Link events to venues
    const laughFactory = createdVenues.find(venue => venue.name === 'The Laugh Factory');
    const chuckleHut = createdVenues.find(venue => venue.name === 'Chuckle Hut');
    
    const eventsWithVenues = events.map((event, index) => {
      if (index === 2) {
        return { ...event, venue: chuckleHut._id };
      }
      return { ...event, venue: laughFactory._id };
    });
    
    // Import events
    const createdEvents = await Event.insertMany(eventsWithVenues);
    console.log(`${createdEvents.length} events created`);
    
    console.log('Data imported successfully!');
    process.exit();
  } catch (err) {
    console.error('Error importing data:', err);
    process.exit(1);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Venue.deleteMany();
    await Event.deleteMany();
    
    console.log('Data destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Check command line args
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use correct command: node seed.js -i (import) or node seed.js -d (delete)');
  process.exit();
}