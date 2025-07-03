const express = require('express');
const router = express.Router();
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// GET all products
router.get('/', getProducts);

// GET a single product by ID
router.get('/:id', getProductById);

// POST a new product with image upload
router.post('/', addProduct);

// PUT an existing product
router.put('/:id', updateProduct);

// DELETE a product
router.delete('/:id', deleteProduct);

module.exports = router;