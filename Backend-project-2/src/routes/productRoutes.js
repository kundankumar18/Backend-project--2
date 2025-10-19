const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const validate = require('../middlewares/validate');
const {
    createProductSchema,
    updateProductSchema,
} = require('../validators/productValidators');

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination, search, filtering
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/:productId
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:productId', getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Seller/Admin only)
 */
router.post(
    '/',
    authenticate,
    authorize('seller', 'admin'),
    upload.array('images', 10),
    validate(createProductSchema),
    createProduct
);

/**
 * @route   PUT /api/products/:productId
 * @desc    Update product
 * @access  Private (Owner/Admin only)
 */
router.put(
    '/:productId',
    authenticate,
    upload.array('images', 10),
    validate(updateProductSchema),
    updateProduct
);

/**
 * @route   DELETE /api/products/:productId
 * @desc    Delete product
 * @access  Private (Owner/Admin only)
 */
router.delete('/:productId', authenticate, deleteProduct);

module.exports = router;
