const Joi = require('joi');

/**
 * User registration validation schema
 */
const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().messages({
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name cannot exceed 50 characters',
        'any.required': 'First name is required',
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name cannot exceed 50 characters',
        'any.required': 'Last name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'Password is required',
    }),
    role: Joi.string().valid('customer', 'seller', 'admin').optional(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).optional().messages({
        'string.pattern.base': 'Please provide a valid phone number (10-15 digits)',
    }),
});

/**
 * User login validation schema
 */
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
    }),
});

/**
 * Refresh token validation schema
 */
const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        'any.required': 'Refresh token is required',
    }),
});

/**
 * Update profile validation schema
 */
const updateProfileSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
});

/**
 * Change password validation schema
 */
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required',
    }),
    newPassword: Joi.string().min(8).required().messages({
        'string.min': 'New password must be at least 8 characters',
        'any.required': 'New password is required',
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    updateProfileSchema,
    changePasswordSchema,
};
