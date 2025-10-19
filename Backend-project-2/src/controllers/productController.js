const Product = require('../models/product');

/**
 * Get all products with pagination, search, and filtering
 * @route GET /api/products
 * @access Public
 */
const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            sortBy = 'createdAt',
            order = 'desc',
            categoryId,
            minPrice,
            maxPrice,
            isActive,
        } = req.query;

        // Build query
        const query = {};

        // Search by name, description, or tags
        if (search) {
            query.$text = { $search: search };
        }

        // Filter by category
        if (categoryId) {
            query.categoryId = categoryId;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filter by active status
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        // Execute query
        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit))
            .populate('categoryId', 'name slug')
            .populate('sellerId', 'firstName lastName email');

        // Get total count
        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: {
                products,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / Number(limit)),
                    totalProducts: total,
                    limit: Number(limit),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve products',
            error: error.message,
        });
    }
};

/**
 * Get single product by ID
 * @route GET /api/products/:productId
 * @access Public
 */
const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findOne({ productId })
            .populate('categoryId', 'name slug description')
            .populate('sellerId', 'firstName lastName email phoneNumber');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve product',
            error: error.message,
        });
    }
};

/**
 * Create a new product
 * @route POST /api/products
 * @access Private (Seller/Admin)
 */
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            stock,
            sku,
            categoryId,
            specifications,
            tags,
        } = req.body;

        // Get seller ID from authenticated user
        const sellerId = req.user.userId;

        // Handle uploaded images
        const images = req.files ? req.files.map((file) => `/uploads/products/${file.filename}`) : [];

        // Create product
        const product = await Product.create({
            name,
            description,
            price,
            discountPrice,
            stock,
            sku,
            categoryId,
            sellerId,
            images,
            specifications: specifications ? JSON.parse(specifications) : {},
            tags: tags ? JSON.parse(tags) : [],
        });

        // Populate references
        await product.populate('categoryId', 'name slug');
        await product.populate('sellerId', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message,
        });
    }
};

/**
 * Update product
 * @route PUT /api/products/:productId
 * @access Private (Owner/Admin)
 */
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find product
        const product = await Product.findOne({ productId });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check ownership (admin can update any product)
        if (req.user.role !== 'admin' && product.sellerId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this product',
            });
        }

        // Update fields
        const allowedUpdates = [
            'name',
            'description',
            'price',
            'discountPrice',
            'stock',
            'categoryId',
            'specifications',
            'tags',
            'isActive',
        ];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (field === 'specifications' || field === 'tags') {
                    product[field] = JSON.parse(req.body[field]);
                } else {
                    product[field] = req.body[field];
                }
            }
        });

        // Handle new images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file) => `/uploads/products/${file.filename}`);
            product.images = [...product.images, ...newImages];
        }

        await product.save();

        // Populate references
        await product.populate('categoryId', 'name slug');
        await product.populate('sellerId', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message,
        });
    }
};

/**
 * Delete product
 * @route DELETE /api/products/:productId
 * @access Private (Owner/Admin)
 */
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find product
        const product = await Product.findOne({ productId });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check ownership (admin can delete any product)
        if (req.user.role !== 'admin' && product.sellerId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this product',
            });
        }

        await Product.deleteOne({ productId });

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message,
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
