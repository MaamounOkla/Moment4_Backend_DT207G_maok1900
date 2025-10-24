// src/middleware/auth.js

require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET_Key;

//Verifierar JWT-token i Authorization-headern
function authenticatedToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
// om ingen token
  if (!token)
    return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) 
      return res.status(403).json({ message: 'Invalid or expired token' });

    req.user = payload; // { userID, username, iat, exp }
    next();
  });
}

module.exports = authenticatedToken;
