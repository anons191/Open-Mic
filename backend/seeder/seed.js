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

    // Check if there's any data to import
    if (users.length === 0) {
      console.log('No user data to import');
    } else {
      // Import users with hashed passwords
      const preparedUsers = await prepareUsers();
      const createdUsers = await User.insertMany(preparedUsers);
      console.log(`${createdUsers.length} users created`);
      
      // Process venues if we have users and venues
      if (venues.length > 0 && createdUsers.length > 0) {
        // Find a host user if there is one
        const hostUser = createdUsers.find(user => user.role === 'host');
        
        // If we found a host user, add venues
        if (hostUser) {
          console.log('Host user found:', hostUser._id);
          
          // Add host to venues
          const venuesWithHost = venues.map(venue => {
            return { ...venue, host: hostUser._id };
          });
          
          // Import venues
          const createdVenues = await Venue.insertMany(venuesWithHost);
          console.log(`${createdVenues.length} venues created`);
          
          // Process events if we have venues and events
          if (events.length > 0 && createdVenues.length > 0) {
            // Map venues by name for easier lookup
            const venueMap = {};
            createdVenues.forEach(venue => {
              venueMap[venue.name] = venue._id;
            });
            
            // Add host to events
            const eventsWithData = events.map(event => {
              // Add default venue and host
              return { 
                ...event, 
                venue: venueMap[Object.keys(venueMap)[0]],
                host: hostUser._id
              };
            });
            
            // Import events
            const createdEvents = await Event.insertMany(eventsWithData);
            console.log(`${createdEvents.length} events created`);
          } else {
            console.log('No events to import or no venues available');
          }
        } else {
          console.log('No host user found, skipping venue creation');
        }
      } else {
        console.log('No venues to import or no users available');
      }
    }
    
    console.log('Data import process completed!');
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