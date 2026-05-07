const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const { sendCustomerInvoice, sendAdminNotification } = require('../services/notificationService');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    
    // Trigger Automated Notifications
    try {
      await Promise.all([
        sendCustomerInvoice(order),
        sendAdminNotification(order)
      ]);
    } catch (notifErr) {
      console.error('Notification system error:', notifErr.message);
      // We don't fail the order just because email failed, 
      // but we log it for admin investigation.
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
