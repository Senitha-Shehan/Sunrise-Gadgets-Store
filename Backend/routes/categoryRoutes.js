const express = require('express');
const router = express.Router();
const { getCategories, addCategory, deleteCategory } = require('../controllers/categoryController');
const { verifyToken } = require('../middleware/auth');

// Public: GET all categories
router.get('/', getCategories);

// Protected: POST a new category (admin only)
router.post('/', verifyToken, addCategory);

// Protected: DELETE a category (admin only)
router.delete('/:id', verifyToken, deleteCategory);

module.exports = router;

