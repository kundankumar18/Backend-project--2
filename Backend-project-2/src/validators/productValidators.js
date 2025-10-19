const Joi = require('joi');

/**
 * Create product validation schema
 */
const createProductSchema = Joi.object({
    name: Joi.string().max(200).required().messages({
        'string.max': 'Product name cannot exceed 200 characters',
        'any.required': 'Product name is required',
    }),
    description: Joi.string().min(50).required().messages({
        'string.min': 'Description must be at least 50 characters',
        'any.required': 'Product description is required',
    }),
    price: Joi.number().min(0).precision(2).required().messages({
        'number.min': 'Price cannot be negative',
        'any.required': 'Price is required',
    }),
    discountPrice: Joi.number().min(0).precision(2).optional().messages({
        'number.min': 'Discount price cannot be negative',
    }),
    stock: Joi.number().integer().min(0).required().messages({
        'number.min': 'Stock cannot be negative',
        'any.required': 'Stock is required',
    }),
    sku: Joi.string().required().messages({
        'any.required': 'SKU is required',
    }),
    categoryId: Joi.string().required().messages({
        'any.required': 'Category is required',
    }),
    specifications: Joi.string().optional(), // JSON string
    tags: Joi.string().optional(), // JSON array string
});

/**
 * Update product validation schema
 */
const updateProductSchema = Joi.object({
    name: Joi.string().max(200).optional(),
    description: Joi.string().min(50).optional(),
    price: Joi.number().min(0).precision(2).optional(),
    discountPrice: Joi.number().min(0).precision(2).optional(),
    stock: Joi.number().integer().min(0).optional(),
    categoryId: Joi.string().optional(),
    specifications: Joi.string().optional(), // JSON string
    tags: Joi.string().optional(), // JSON array string
    isActive: Joi.boolean().optional(),
});

module.exports = {
    createProductSchema,
    updateProductSchema,
};
