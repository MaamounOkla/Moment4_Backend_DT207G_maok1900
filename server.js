/*  Uppgift4 - Backend med JWT autentisering
    Kurs: Backendbaserad Webbutveckling - DT207G
    Författare: Maamoun Okla
    Datum: 2025-10-13
 */

//Imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authenticatedToken = require('./src/middleware/auth');

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

 

// Starta applikation
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
