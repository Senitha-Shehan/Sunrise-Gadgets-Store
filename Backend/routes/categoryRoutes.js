const express = require('express');
const router = express.Router();
const { getCategories, addCategory, deleteCategory } = require('../controllers/categoryController');

// GET all categories
router.get('/', getCategories);

// POST a new category
router.post('/', addCategory);

// DELETE a category
router.delete('/:id', deleteCategory);

module.exports = router;
