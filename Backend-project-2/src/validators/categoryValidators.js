const Joi = require('joi');

/**
 * Create category validation schema
 */
const createCategorySchema = Joi.object({
    name: Joi.string().max(100).required().messages({
        'string.max': 'Category name cannot exceed 100 characters',
        'any.required': 'Category name is required',
    }),
    description: Joi.string().max(500).optional(),
    parentCategoryId: Joi.string().optional().allow(null, ''),
});

/**
 * Update category validation schema
 */
const updateCategorySchema = Joi.object({
    name: Joi.string().max(100).optional(),
    description: Joi.string().max(500).optional(),
    parentCategoryId: Joi.string().optional().allow(null, ''),
    isActive: Joi.boolean().optional(),
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
