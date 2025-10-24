// src/routes/protected.js
const express = require('express');
const authenticatedToken = require('../middleware/auth');

const router = express.Router();

// Skyddad route som bara visas om användaren har giltig JWT-token
router.get('/protected', authenticatedToken, (req, res) => {
  res.json({
    message: 'This data is only visible for logged-in users',
    user: req.user.username,
    time: new Date().toISOString(),
    data: [
      { id: 1, item: 'Example skyddad data 1' },
      { id: 2, item: 'Example skyddad data 2' }
    ]
  });
});

module.exports = router;
