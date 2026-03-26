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
  newArrival: { type: Boolean, default: false },
  included: [{ type: String }], // What comes with the box
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', productSchema);