/**
 * Script to create or update an Admin account securely.
 * Usage: node scripts/create-admin.js <username> <email> <password>
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdmin() {
  const args = process.argv.slice(2);
  const username = args[0] || 'admin';
  const email = args[1] || process.env.ADMIN_EMAIL || 'admin@sunrisegadgetsstore.com';
  const password = args[2];

  if (!password || password.length < 8) {
    console.error('❌ Error: Password must be provided and must be at least 8 characters long.');
    console.log('Usage: node scripts/create-admin.js <username> <email> <password>');
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error('❌ Error: MONGO_URI is missing in .env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    let user = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });

    if (user) {
      console.log(`Found existing user: ${user.username} (${user.email}). Updating password...`);
      user.password = password;
      user.role = 'admin';
      await user.save();
      console.log(`✅ Admin user "${user.username}" updated successfully!`);
    } else {
      console.log(`Creating new admin user: ${username}...`);
      user = new User({
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password,
        role: 'admin'
      });
      await user.save();
      console.log(`✅ Admin user "${user.username}" created successfully!`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin user:', err.message);
    process.exit(1);
  }
}

createAdmin();
