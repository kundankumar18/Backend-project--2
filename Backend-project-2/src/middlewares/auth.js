const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/user');

/**
 * Verify JWT token and authenticate user
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyAccessToken(token);

        // Check if user exists and is active
        const user = await User.findOne({ userId: decoded.userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated',
            });
        }

        // Attach user to request
        req.user = {
            userId: user.userId,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: error.message,
        });
    }
};

/**
 * Authorize user based on roles
 * @param  {...String} allowedRoles - Roles that are allowed to access the route
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.',
            });
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize,
};
