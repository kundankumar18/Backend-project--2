const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            default: uuidv4,
            unique: true,
            required: true,
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            minlength: [2, 'First name must be at least 2 characters'],
            maxlength: [50, 'First name cannot exceed 50 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            minlength: [2, 'Last name must be at least 2 characters'],
            maxlength: [50, 'Last name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't include password in queries by default
        },
        role: {
            type: String,
            enum: {
                values: ['customer', 'seller', 'admin'],
                message: 'Role must be either customer, seller, or admin',
            },
            default: 'customer',
        },
        phoneNumber: {
            type: String,
            trim: true,
            match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

// Create index on email for faster lookups
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.toPublicJSON = function () {
    return {
        userId: this.userId,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        role: this.role,
        phoneNumber: this.phoneNumber,
        isActive: this.isActive,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
