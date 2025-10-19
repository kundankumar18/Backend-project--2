const Category = require('../models/category');

/**
 * Get all categories
 * @route GET /api/categories
 * @access Public
 */
const getAllCategories = async (req, res) => {
    try {
        const { isActive, parentCategoryId } = req.query;

        // Build query
        const query = {};

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        if (parentCategoryId !== undefined) {
            query.parentCategoryId = parentCategoryId === 'null' ? null : parentCategoryId;
        }

        const categories = await Category.find(query).sort({ name: 1 });

        res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve categories',
            error: error.message,
        });
    }
};

/**
 * Get single category by ID
 * @route GET /api/categories/:categoryId
 * @access Public
 */
const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findOne({ categoryId });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve category',
            error: error.message,
        });
    }
};

/**
 * Create a new category
 * @route POST /api/categories
 * @access Private (Admin only)
 */
const createCategory = async (req, res) => {
    try {
        const { name, description, parentCategoryId } = req.body;

        const category = await Category.create({
            name,
            description,
            parentCategoryId: parentCategoryId || null,
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: error.message,
        });
    }
};

/**
 * Update category
 * @route PUT /api/categories/:categoryId
 * @access Private (Admin only)
 */
const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, description, parentCategoryId, isActive } = req.body;

        const category = await Category.findOne({ categoryId });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Update fields
        if (name !== undefined) category.name = name;
        if (description !== undefined) category.description = description;
        if (parentCategoryId !== undefined) category.parentCategoryId = parentCategoryId || null;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update category',
            error: error.message,
        });
    }
};

/**
 * Delete category
 * @route DELETE /api/categories/:categoryId
 * @access Private (Admin only)
 */
const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findOne({ categoryId });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Check if category has child categories
        const childCategories = await Category.find({ parentCategoryId: categoryId });

        if (childCategories.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with subcategories. Delete subcategories first.',
            });
        }

        await Category.deleteOne({ categoryId });

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: error.message,
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
