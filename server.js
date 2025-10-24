/* Uppgift4 - Backend med JWT autentisering
    Kurs: DT207G
    Författare: Maamoun Okla
    Datum: 2025-10-13
 */

// server.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//importera routes
const authed = require('./src/routes/authed');
const protectedRoutes = require('./src/routes/protected');
// Konfiguration 
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET_Key;  

if (!JWT_SECRET) {
  console.error('Missing JWT_SECRET_Key in .env');
  process.exit(1);
}
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}

//  App 
const app = express();
app.use(express.json());
 
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:1234', 'http://127.0.0.1:1234']
}));
// MongoDB Connection
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

//Routes  
 
app.use('/api', authed);
app.use('/api', protectedRoutes);
 
app.get('/api/protected', authenticatedToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// JWT autentisering
function authenticatedToken(req, res, next) {
  // Förväntar "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Not authorized for this route, no token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
 
    req.user = payload;
    next();
  });
}

// Starta applikation
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
