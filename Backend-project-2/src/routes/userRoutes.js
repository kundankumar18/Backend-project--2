const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    changePassword,
} = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    updateProfileSchema,
    changePasswordSchema,
} = require('../validators/authValidators');

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

/**
 * @route   PUT /api/users/change-password
 * @desc    Change password
 * @access  Private
 */
router.put('/change-password', authenticate, validate(changePasswordSchema), changePassword);

module.exports = router;
