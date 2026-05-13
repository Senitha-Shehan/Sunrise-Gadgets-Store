const Product = require('../models/Product');
const upload = require('../middleware/upload');
const cloudinary = require('cloudinary').v2;

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
    console.log('=== ADD PRODUCT REQUEST ===');
    console.log('Body keys:', Object.keys(req.body));
    console.log('Files received:', req.files?.length || 0);
    
    const { name, brand, category, description, price, originalPrice, quantity, inStock, newArrival, included, specs } = req.body;
    
    console.log('1. Validating fields...');
    // Validate required fields
    if (!name || !name.trim()) return res.status(400).json({ error: 'Product name is required' });
    if (!brand || !brand.trim()) return res.status(400).json({ error: 'Brand is required' });
    if (!category || !category.trim()) return res.status(400).json({ error: 'Category is required' });
    if (!description || !description.trim()) return res.status(400).json({ error: 'Description is required' });
    if (!price || parseFloat(price) <= 0) return res.status(400).json({ error: 'Valid price is required' });
    console.log('✓ Field validation passed');
    
    console.log('2. Checking files...');
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      console.error('No files received in request');
      return res.status(400).json({ error: 'Please upload at least one image file' });
    }
    console.log(`✓ ${req.files.length} file(s) received`);
    
    console.log('3. Processing images...');
    // Process multiple images from Cloudinary
    const images = req.files.map(file => {
      console.log('  Processing file:', file.originalname);
      return {
        url: file.path,      // Cloudinary URL
        public_id: file.filename // Cloudinary Public ID
      };
    });
    console.log('✓ Images processed:', images.length);
    
    console.log('4. Processing included items...');
    // Process included items (split by comma if it's a string)
    const includedItems = typeof included === 'string' ? 
      included.split(',').map(item => item.trim()).filter(item => item) : 
      (Array.isArray(included) ? included : []);
    console.log('✓ Included items:', includedItems.length);
    
    console.log('5. Processing specs...');
    // Process specs (parse JSON string from FormData)
    let parsedSpecs = [];
    if (specs) {
      try { 
        parsedSpecs = JSON.parse(specs); 
        console.log('✓ Specs parsed:', parsedSpecs.length);
      } catch (e) { 
        console.error('Error parsing specs:', e.message); 
      }
    }
    
    console.log('6. Creating product document...');
    const newProduct = new Product({ 
      name: name.trim(), 
      brand: brand.trim(),
      category: category.trim(),
      description: description.trim(), 
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      quantity: parseInt(quantity) || 0,
      images,
      inStock: inStock === 'true' || inStock === true,
      newArrival: newArrival === 'true' || newArrival === true,
      included: includedItems,
      specs: parsedSpecs
    });
    console.log('✓ Product document created');
    
    console.log('7. Saving to database...');
    const savedProduct = await newProduct.save();
    console.log('✓ Product saved successfully:', savedProduct._id);
    console.log('=== END ADD PRODUCT ===');
    
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('❌ ERROR in addProduct:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: error.message || 'Could not create product',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { name, brand, category, description, price, originalPrice, quantity, inStock, newArrival, included, specs } = req.body;
    
    // Validate required fields
    if (!name || !name.trim()) return res.status(400).json({ error: 'Product name is required' });
    if (!brand || !brand.trim()) return res.status(400).json({ error: 'Brand is required' });
    if (!category || !category.trim()) return res.status(400).json({ error: 'Category is required' });
    if (!description || !description.trim()) return res.status(400).json({ error: 'Description is required' });
    if (!price || parseFloat(price) <= 0) return res.status(400).json({ error: 'Valid price is required' });
    
    let updateData = {
      name: name.trim(),
      brand: brand.trim(),
      category: category.trim(),
      description: description.trim(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      quantity: parseInt(quantity) || 0,
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

    // 2. Add new uploads from Cloudinary
    const newImages = (req.files && req.files.length > 0) ? req.files.map(file => ({
      url: file.path,      // Cloudinary URL
      public_id: file.filename // Cloudinary Public ID
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

    // Validate at least one image exists
    if (finalImages.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    updateData.images = finalImages.slice(0, 5); // Enforce max 5 limit

    // 4. Cleanup: Delete images from Cloudinary that were removed
    const oldProduct = await Product.findById(req.params.id);
    if (oldProduct) {
      const imagesToRemove = oldProduct.images.filter(
        oldImg => !finalImages.some(newImg => newImg.public_id === oldImg.public_id)
      );
      
      for (const img of imagesToRemove) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
          console.log(`Deleted image from Cloudinary: ${img.public_id}`);
        } catch (err) {
          console.error(`Failed to delete Cloudinary image: ${img.public_id}`, err);
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Product updated successfully:', updatedProduct._id);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      error: error.message || 'Could not update product',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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

    // Delete actual files from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (err) {
          console.error(`Failed to delete Cloudinary image on product delete: ${img.public_id}`, err);
        }
      }
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