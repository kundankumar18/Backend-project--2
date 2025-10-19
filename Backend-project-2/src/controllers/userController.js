const User = require('../models/user');
const bcrypt = require('bcryptjs');

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: user.toPublicJSON(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve profile',
            error: error.message,
        });
    }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber } = req.body;

        const user = await User.findOne({ userId: req.user.userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update allowed fields
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user.toPublicJSON(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message,
        });
    }
};

/**
 * Change password
 * @route PUT /api/users/change-password
 * @access Private
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Find user with password field
        const user = await User.findOne({ userId: req.user.userId }).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        // Check if new password is different
        const isSamePassword = await bcrypt.compare(newPassword, user.password);

        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'New password must be different from current password',
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error.message,
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
};
