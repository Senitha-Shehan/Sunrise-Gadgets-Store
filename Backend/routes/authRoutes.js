const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { login, getMe, seedAdmin, changePassword } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Strict rate limiter for authentication endpoints (15 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public auth routes
router.post('/login', authLimiter, login);
router.post('/seed', authLimiter, seedAdmin);

// Protected auth routes (require valid JWT)
router.get('/me', verifyToken, getMe);
router.post('/change-password', verifyToken, changePassword);

module.exports = router;
