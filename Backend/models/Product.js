const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  images: [{
    public_id: String,
    url: String
  }],
  price: Number,
  originalPrice: Number,                    // For showing discounts/savings
  inStock: { type: Boolean, default: true }, // Availability status
  newArrival: { type: Boolean, default: false },
  included: [{ type: String }],             // What comes with the box
  specs: [{ key: String, value: String }],  // Flexible product specifications
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);