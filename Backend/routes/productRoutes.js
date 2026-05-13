const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// GET all products
router.get('/', getProducts);

// GET a single product by ID
router.get('/:id', getProductById);

// POST a new product with image upload
router.post('/', upload.array('images', 5), addProduct);

// PUT an existing product (update)
router.put('/:id', upload.array('images', 5), updateProduct);

// DELETE a product
router.delete('/:id', deleteProduct);

module.exports = router;