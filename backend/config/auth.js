const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - middleware
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized - no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('JWT decoded:', decoded);

    if (!decoded || !decoded.id) {
      console.log('Invalid decoded token - missing ID');
      return res.status(401).json({ message: 'Not authorized - invalid token structure' });
    }

    // Set user in request
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('User not found for decoded token ID:', decoded.id);
      return res.status(401).json({ message: 'Not authorized - user not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized - invalid token' });
  }
};
