const jwt = require('jsonwebtoken');

/**
 * Generate JWT access token
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT access token
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    });
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
    });
};

/**
 * Verify JWT access token
 * @param {String} token - JWT access token
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
};

/**
 * Verify JWT refresh token
 * @param {String} token - JWT refresh token
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
