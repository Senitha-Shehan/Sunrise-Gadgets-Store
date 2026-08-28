const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { verifyToken } = require('../middleware/auth');
const { sendCustomerInvoice, sendAdminNotification } = require('../services/notificationService');

// Public: Create a new order (checkout)
router.post('/', async (req, res) => {
  try {
    const { customer, items, summary } = req.body;
    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.district) {
      return res.status(400).json({ error: 'Incomplete customer details' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }
    if (!summary || typeof summary.total !== 'number') {
      return res.status(400).json({ error: 'Invalid order summary calculation' });
    }

    const order = new Order({
      customer: {
        name: String(customer.name).trim(),
        email: String(customer.email || '').trim(),
        phone: String(customer.phone).trim(),
        address: String(customer.address).trim(),
        district: String(customer.district).trim(),
        notes: customer.notes ? String(customer.notes).trim() : ''
      },
      items: items.map(item => ({
        product: item.product,
        name: String(item.name).trim(),
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image ? String(item.image) : ''
      })),
      summary: {
        subtotal: Number(summary.subtotal),
        shipping: Number(summary.shipping),
        total: Number(summary.total)
      },
      status: 'Pending'
    });

    await order.save();
    
    // Trigger Automated Notifications
    try {
      await Promise.all([
        sendCustomerInvoice(order),
        sendAdminNotification(order)
      ]);
    } catch (notifErr) {
      console.error('Notification system error:', notifErr.message);
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Protected: Get all orders (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected: Delete all orders (admin only)
router.delete('/', verifyToken, async (req, res) => {
  try {
    const result = await Order.deleteMany({});
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected: Update order status (admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

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

// Protected: Delete a single order (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

