const Product = require('../models/Product');
const upload = require('../middleware/upload');

// Get all products sorted by latest first
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new product with multiple image uploads
const addProduct = async (req, res) => {
  try {
    const { name, brand, category, description, price, newArrival, included } = req.body;
    
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one image file' });
    }
    
    // Process multiple images
    const images = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      public_id: file.filename
    }));
    
    // Process included items (split by comma if it's a string)
    const includedItems = typeof included === 'string' ? 
      included.split(',').map(item => item.trim()).filter(item => item) : 
      (Array.isArray(included) ? included : []);
    
    const newProduct = new Product({ 
      name, 
      brand,
      category,
      description, 
      price,
      images,
      newArrival: newArrival === 'true' || newArrival === true,
      included: includedItems
    });
    
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Could not create product',
      details: error.message 
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { name, brand, category, description, price, newArrival, included } = req.body;
    
    let updateData = {
      name,
      brand,
      category,
      description,
      price,
      newArrival: newArrival === 'true' || newArrival === true
    };

    // Process included items
    if (included) {
      const includedItems = typeof included === 'string' ? 
        included.split(',').map(item => item.trim()).filter(item => item) : 
        (Array.isArray(included) ? included : []);
      updateData.included = includedItems;
    }

    // Handle image uploads if new images are provided
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        public_id: file.filename
      }));
      updateData.images = images;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Could not update product',
      details: error.message 
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Could not delete product',
      details: error.message 
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct: [upload.array('images', 5), addProduct],
  updateProduct: [upload.array('images', 5), updateProduct],
  deleteProduct
};