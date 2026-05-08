const express = require('express');
const { sendContactMessage } = require('../controllers/contactController');

const router = express.Router();

/**
 * POST /contact
 * Send a contact form message
 * Body: { name, email, phone, subject, message }
 */
router.post('/', sendContactMessage);

module.exports = router;
