const mongoose = require('mongoose');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

const categorySchema = new mongoose.Schema(
    {
        categoryId: {
            type: String,
            default: uuidv4,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true,
            maxlength: [100, 'Category name cannot exceed 100 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        parentCategoryId: {
            type: String,
            default: null,
            ref: 'Category',
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

// Create indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });

// Auto-generate slug from name before saving
categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
