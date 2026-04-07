const Product = require('../models/Product');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

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
    const { name, brand, category, description, price, originalPrice, inStock, newArrival, included, specs } = req.body;
    
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
    
    // Process specs (parse JSON string from FormData)
    let parsedSpecs = [];
    if (specs) {
      try { parsedSpecs = JSON.parse(specs); } 
      catch (e) { console.error('Error parsing specs:', e); }
    }
    
    const newProduct = new Product({ 
      name, 
      brand,
      category,
      description, 
      price,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      images,
      inStock: inStock === 'true' || inStock === true,
      newArrival: newArrival === 'true' || newArrival === true,
      included: includedItems,
      specs: parsedSpecs
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
    const { name, brand, category, description, price, originalPrice, inStock, newArrival, included, specs } = req.body;
    
    let updateData = {
      name,
      brand,
      category,
      description,
      price,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      inStock: inStock === 'true' || inStock === true,
      newArrival: newArrival === 'true' || newArrival === true
    };

    // Process specs (parse JSON string from FormData)
    if (specs) {
      try { updateData.specs = JSON.parse(specs); } 
      catch (e) { console.error('Error parsing specs:', e); }
    }

    // Process included items
    if (included) {
      const includedItems = typeof included === 'string' ? 
        included.split(',').map(item => item.trim()).filter(item => item) : 
        (Array.isArray(included) ? included : []);
      updateData.included = includedItems;
    }

    // Handle images: Merge existing ones with new uploads
    let finalImages = [];
    
    // 1. Get existing images from request body (sent as JSON string from client)
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch (e) {
        console.error('Error parsing existingImages:', e);
      }
    } else {
        // Fallback: If no instruction provided, keep current images
        const currentProduct = await Product.findById(req.params.id);
        if (currentProduct) existingImages = currentProduct.images;
    }

    // 2. Add new uploads
    const newImages = (req.files && req.files.length > 0) ? req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      public_id: file.filename
    })) : [];

    // 3. Construct final list based on order if provided
    if (req.body.imageOrder) {
      try {
        const order = JSON.parse(req.body.imageOrder);
        finalImages = order.map(item => {
          if (item.type === 'existing') {
            return existingImages.find(img => img.public_id === item.id);
          } else if (item.type === 'new') {
            return newImages[item.index];
          }
          return null;
        }).filter(Boolean);
      } catch (e) {
        console.error('Error parsing imageOrder:', e);
        finalImages = [...existingImages, ...newImages];
      }
    } else {
      finalImages = [...existingImages, ...newImages];
    }

    updateData.images = finalImages.slice(0, 5); // Enforce max 5 limit

    // 4. Cleanup: Find images that were in the product but aren't in finalImages anymore
    const oldProduct = await Product.findById(req.params.id);
    if (oldProduct) {
      const imagesToRemove = oldProduct.images.filter(
        oldImg => !finalImages.some(newImg => newImg.public_id === oldImg.public_id)
      );
      
      imagesToRemove.forEach(img => {
        const filePath = path.join(__dirname, '..', 'uploads', img.public_id);
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Failed to delete orphaned file: ${filePath}`, err);
          else console.log(`Deleted orphaned file: ${filePath}`);
        });
      });
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

    // Delete actual files from disk
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        const filePath = path.join(__dirname, '..', 'uploads', img.public_id);
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Failed to delete file on product delete: ${filePath}`, err);
        });
      });
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