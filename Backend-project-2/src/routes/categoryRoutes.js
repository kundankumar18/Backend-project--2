const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createCategorySchema,
    updateCategorySchema,
} = require('../validators/categoryValidators');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', getAllCategories);

/**
 * @route   GET /api/categories/:categoryId
 * @desc    Get single category by ID
 * @access  Public
 */
router.get('/:categoryId', getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private (Admin only)
 */
router.post(
    '/',
    authenticate,
    authorize('admin'),
    validate(createCategorySchema),
    createCategory
);

/**
 * @route   PUT /api/categories/:categoryId
 * @desc    Update category
 * @access  Private (Admin only)
 */
router.put(
    '/:categoryId',
    authenticate,
    authorize('admin'),
    validate(updateCategorySchema),
    updateCategory
);

/**
 * @route   DELETE /api/categories/:categoryId
 * @desc    Delete category
 * @access  Private (Admin only)
 */
router.delete('/:categoryId', authenticate, authorize('admin'), deleteCategory);

module.exports = router;
