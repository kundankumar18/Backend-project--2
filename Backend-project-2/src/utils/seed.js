require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});

        // Create users
        console.log('👥 Creating users...');
        const users = await User.create([
            {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@ecommerce.com',
                password: 'Admin@123',
                role: 'admin',
                phoneNumber: '1234567890',
            },
            {
                firstName: 'John',
                lastName: 'Seller',
                email: 'seller@ecommerce.com',
                password: 'Seller@123',
                role: 'seller',
                phoneNumber: '9876543210',
            },
            {
                firstName: 'Jane',
                lastName: 'Customer',
                email: 'customer@ecommerce.com',
                password: 'Customer@123',
                role: 'customer',
                phoneNumber: '5555555555',
            },
        ]);

        console.log(`✅ Created ${users.length} users`);

        // Create categories
        console.log('📁 Creating categories...');
        const categories = await Category.create([
            {
                name: 'Electronics',
                description: 'Electronic devices and accessories',
            },
            {
                name: 'Computers & Laptops',
                description: 'Desktop computers, laptops, and accessories',
            },
            {
                name: 'Mobile Phones',
                description: 'Smartphones and mobile accessories',
            },
            {
                name: 'Clothing',
                description: 'Fashion and apparel',
            },
            {
                name: 'Books',
                description: 'Books, magazines, and reading materials',
            },
            {
                name: 'Home & Kitchen',
                description: 'Home appliances and kitchen essentials',
            },
        ]);

        console.log(`✅ Created ${categories.length} categories`);

        // Get seller user
        const seller = users.find((u) => u.role === 'seller');

        // Create products
        console.log('📦 Creating products...');
        const products = await Product.create([
            {
                name: 'MacBook Pro 16-inch M3 Max',
                description:
                    'Apple MacBook Pro with M3 Max chip, 16-inch Liquid Retina XDR display, 36GB RAM, 1TB SSD. Perfect for professional video editing, 3D rendering, and software development. Features exceptional battery life and stunning display.',
                price: 3499.99,
                discountPrice: 3299.99,
                stock: 25,
                sku: 'MBPM3MAX16-001',
                categoryId: categories[1].categoryId,
                sellerId: seller.userId,
                specifications: {
                    Brand: 'Apple',
                    Processor: 'M3 Max',
                    RAM: '36GB',
                    Storage: '1TB SSD',
                    Display: '16-inch Liquid Retina XDR',
                    Graphics: 'Integrated M3 Max GPU',
                },
                tags: ['laptop', 'apple', 'macbook', 'professional', 'm3'],
                rating: 4.8,
            },
            {
                name: 'iPhone 15 Pro Max',
                description:
                    'Latest iPhone with A17 Pro chip, titanium design, 6.7-inch Super Retina XDR display, advanced camera system with 5x optical zoom. Capture stunning photos and videos with the most powerful iPhone ever.',
                price: 1199.99,
                stock: 50,
                sku: 'IPHONE15PM-256',
                categoryId: categories[2].categoryId,
                sellerId: seller.userId,
                specifications: {
                    Brand: 'Apple',
                    Storage: '256GB',
                    Display: '6.7-inch Super Retina XDR',
                    Processor: 'A17 Pro',
                    Camera: 'Triple camera system',
                },
                tags: ['smartphone', 'iphone', 'apple', '5g'],
                rating: 4.9,
            },
            {
                name: 'Sony WH-1000XM5 Wireless Headphones',
                description:
                    'Industry-leading noise canceling wireless headphones with Auto NC Optimizer, crystal clear hands-free calling, and up to 30 hours battery life. Premium comfort and exceptional sound quality for music lovers.',
                price: 399.99,
                discountPrice: 349.99,
                stock: 100,
                sku: 'SONY-WH1000XM5',
                categoryId: categories[0].categoryId,
                sellerId: seller.userId,
                specifications: {
                    Brand: 'Sony',
                    Type: 'Over-Ear',
                    'Noise Canceling': 'Yes',
                    'Battery Life': '30 hours',
                    Connectivity: 'Bluetooth 5.2',
                },
                tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
                rating: 4.7,
            },
            {
                name: 'Dell XPS 15 Gaming Laptop',
                description:
                    'Powerful gaming and content creation laptop with Intel Core i9 13th Gen, NVIDIA RTX 4070, 32GB RAM, 1TB NVMe SSD. Stunning 15.6-inch 4K OLED display delivers vivid colors and deep blacks.',
                price: 2499.99,
                stock: 15,
                sku: 'DELLXPS15-RTX4070',
                categoryId: categories[1].categoryId,
                sellerId: seller.userId,
                specifications: {
                    Brand: 'Dell',
                    Processor: 'Intel Core i9 13th Gen',
                    RAM: '32GB DDR5',
                    Storage: '1TB NVMe SSD',
                    Graphics: 'NVIDIA RTX 4070',
                    Display: '15.6-inch 4K OLED',
                },
                tags: ['laptop', 'gaming', 'dell', 'rtx'],
                rating: 4.6,
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description:
                    'Premium Android smartphone with 200MP camera, S Pen included, 6.8-inch Dynamic AMOLED display, Snapdragon 8 Gen 3 processor. Ultimate productivity and creativity in your pocket.',
                price: 1299.99,
                discountPrice: 1199.99,
                stock: 40,
                sku: 'SAMS24ULTRA-512',
                categoryId: categories[2].categoryId,
                sellerId: seller.userId,
                specifications: {
                    Brand: 'Samsung',
                    Storage: '512GB',
                    Display: '6.8-inch Dynamic AMOLED',
                    Processor: 'Snapdragon 8 Gen 3',
                    Camera: '200MP main camera',
                },
                tags: ['smartphone', 'samsung', 'galaxy', 'android'],
                rating: 4.8,
            },
            {
                name: 'The Complete Guide to Programming',
                description:
                    'Comprehensive programming guide covering modern development practices, algorithms, data structures, and best practices. Perfect for beginners and intermediate developers looking to level up their skills.',
                price: 49.99,
                discountPrice: 39.99,
                stock: 200,
                sku: 'BOOK-PROG-2024',
                categoryId: categories[4].categoryId,
                sellerId: seller.userId,
                specifications: {
                    Author: 'Tech Publishing',
                    Pages: '850',
                    Publisher: 'TechBooks Inc',
                    Language: 'English',
                    Format: 'Paperback',
                },
                tags: ['books', 'programming', 'education', 'coding'],
                rating: 4.5,
            },
        ]);

        console.log(`✅ Created ${products.length} products`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Sample Credentials:');
        console.log('Admin: admin@ecommerce.com / Admin@123');
        console.log('Seller: seller@ecommerce.com / Seller@123');
        console.log('Customer: customer@ecommerce.com / Customer@123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed Error:', error);
        process.exit(1);
    }
};

// Run seed
connectDB().then(seedData);
