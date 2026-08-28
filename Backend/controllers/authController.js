const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * Generate a signed JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Admin Login
 * POST /auth/login
 * Body: { username, password }
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Find user by username or email (case insensitive)
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase().trim() },
        { email: username.toLowerCase().trim() }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed due to server error.' });
  }
};

/**
 * Get current authenticated user
 * GET /auth/me
 */
const getMe = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
};

/**
 * Bootstrap / Seed Initial Admin Account
 * POST /auth/seed
 * Body: { username, email, password, setupKey }
 */
const seedAdmin = async (req, res) => {
  try {
    const { username, email, password, setupKey } = req.body;

    // Check if any admin already exists
    const existingCount = await User.countDocuments();
    if (existingCount > 0) {
      // If accounts already exist, require a setup key or block
      const expectedSetupKey = process.env.ADMIN_SETUP_KEY;
      if (!expectedSetupKey || setupKey !== expectedSetupKey) {
        return res.status(403).json({ error: 'Admin account already initialized. Access forbidden.' });
      }
    }

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const admin = new User({
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'admin'
    });

    await admin.save();
    const token = generateToken(admin);

    res.status(201).json({
      message: 'Admin account created successfully.',
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Seed admin error:', error);
    res.status(500).json({ error: error.message || 'Could not create admin account.' });
  }
};

/**
 * Change Admin Password
 * POST /auth/change-password
 * Body: { currentPassword, newPassword }
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password.' });
  }
};

module.exports = {
  login,
  getMe,
  seedAdmin,
  changePassword
};
