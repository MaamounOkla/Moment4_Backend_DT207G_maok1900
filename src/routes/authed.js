// src/routes/authed.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticatedToken = require('../middleware/auth');  
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_Key;

// Skapa JWT-token
function signToken(user) {
  return jwt.sign(
    { userID: user._id.toString(), username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Registrera användare
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });
    if (String(password).length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const user = await User.register(username, password);
  
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    if (error && error.code === 11000)
      return res.status(409).json({ message: 'Username already taken' });
    console.error('Error in /register:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logga in användare
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password are required' });

    const user = await User.login(username, password);
    const token = signToken(user);

    res.status(200).json({ message: 'User logged in successfully', token });
  } catch (error) {
    if (error && /Incorrect username\/password/i.test(error.message))
      return res.status(401).json({ message: 'Incorrect username/password' });
    console.error('Error in /login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
 
// Skyddad route
router.get('/me', authenticatedToken, async (req, res) => {
  try {
    const me = await User.findById(req.user.userID).select('_id username created');
    if (!me) return res.status(404).json({ message: 'User not found' });
    res.json({ user: me });
  } catch (error) {
    console.error('Error in /me:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
