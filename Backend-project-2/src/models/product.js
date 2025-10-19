const mongoose = require('mongoose');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            default: uuidv4,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Product name cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            minlength: [50, 'Description must be at least 50 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
            validate: {
                validator: function (value) {
                    return /^\d+(\.\d{1,2})?$/.test(value.toString());
                },
                message: 'Price must have at most 2 decimal places',
            },
        },
        discountPrice: {
            type: Number,
            min: [0, 'Discount price cannot be negative'],
            validate: {
                validator: function (value) {
                    return value < this.price;
                },
                message: 'Discount price must be less than regular price',
            },
        },
        stock: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        categoryId: {
            type: String,
            required: [true, 'Category is required'],
            ref: 'Category',
        },
        sellerId: {
            type: String,
            required: [true, 'Seller ID is required'],
            ref: 'User',
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: function (arr) {
                    return arr.length <= 10;
                },
                message: 'Cannot upload more than 10 images',
            },
        },
        specifications: {
            type: Map,
            of: String,
            default: {},
        },
        tags: {
            type: [String],
            default: [],
        },
        rating: {
            type: Number,
            min: [0, 'Rating cannot be less than 0'],
            max: [5, 'Rating cannot be more than 5'],
            default: 0,
            validate: {
                validator: function (value) {
                    return /^\d+(\.\d{1})?$/.test(value.toString());
                },
                message: 'Rating must have at most 1 decimal place',
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for better query performance
productSchema.index({ name: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ sellerId: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Text index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Auto-generate slug from name before saving
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
