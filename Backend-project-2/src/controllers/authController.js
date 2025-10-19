const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require('../utils/jwt');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, phoneNumber } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
        }

        // Create new user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role: role || 'customer',
            phoneNumber,
        });

        // Generate tokens
        const tokenPayload = {
            userId: user.userId,
            email: user.email,
            role: user.role,
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Hash and save refresh token
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        user.refreshToken = hashedRefreshToken;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.toPublicJSON(),
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message,
        });
    }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user with password field
        const user = await User.findOne({ email }).select('+password +refreshToken');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Please contact support.',
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate tokens
        const tokenPayload = {
            userId: user.userId,
            email: user.email,
            role: user.role,
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Hash and save refresh token
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        user.refreshToken = hashedRefreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.toPublicJSON(),
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message,
        });
    }
};

/**
 * Logout user
 * @route POST /api/auth/logout
 * @access Private
 */
const logout = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Clear refresh token
        user.refreshToken = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message,
        });
    }
};

/**
 * Refresh access token
 * @route POST /api/auth/refresh-token
 * @access Public
 */
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required',
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user
        const user = await User.findOne({ userId: decoded.userId }).select('+refreshToken');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Verify stored refresh token
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

        if (!isRefreshTokenValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token',
            });
        }

        // Generate new access token
        const tokenPayload = {
            userId: user.userId,
            email: user.email,
            role: user.role,
        };

        const newAccessToken = generateAccessToken(tokenPayload);

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token refresh failed',
            error: error.message,
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    refreshAccessToken,
};
