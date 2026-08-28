const express = require('express');
const router = express.Router();
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { verifyToken } = require('../middleware/auth');

// Public endpoints (shoppers)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected endpoints (admin only - requires valid JWT)
router.post('/', verifyToken, addProduct);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;