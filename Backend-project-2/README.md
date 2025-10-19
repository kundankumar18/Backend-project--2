# E-Commerce API

A production-grade RESTful API for an E-Commerce Product Catalog with CRUD operations, JWT authentication, role-based authorization, and MongoDB database integration.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - Password hashing with bcrypt
  - Role-based access control (Admin, Seller, Customer)
  
- **Product Management**
  - Full CRUD operations
  - Image upload support (up to 10 images per product)
  - Advanced search, filtering, and pagination
  - Product specifications and tags
  
- **Category Management**
  - Hierarchical category structure
  - Admin-only category management
  
- **User Profile Management**
  - View and update profile
  - Change password functionality
  
- **Security**
  - Helmet.js for security headers
  - CORS configuration
  - Rate limiting (100 requests per 15 minutes)
  - Input validation with Joi
  
## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend-project-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   
   MONGODB_URI=mongodb://localhost:27017/ecommerce-api
   
   JWT_ACCESS_SECRET=your_jwt_access_secret_key_here_min_32_chars
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_min_32_chars
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   
   CORS_ORIGIN=http://localhost:3000
   
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp
   ```

4. **Seed the database** (Optional)
   ```bash
   npm run seed
   ```
   
   This will create sample users, categories, and products. Use these credentials to test:
   - Admin: `admin@ecommerce.com` / `Admin@123`
   - Seller: `seller@ecommerce.com` / `Seller@123`
   - Customer: `customer@ecommerce.com` / `Customer@123`

5. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "customer",
  "phoneNumber": "1234567890"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`

#### Refresh Access Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

**Response:** `200 OK`

---

### Product Endpoints

#### Get All Products (with pagination, search, filtering)
```http
GET /api/products?page=1&limit=20&search=laptop&sortBy=price&order=desc&categoryId=xxx&minPrice=100&maxPrice=5000
```

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 20) - Items per page
- `search` - Search term for name, description, tags
- `sortBy` (default: createdAt) - Field to sort by
- `order` (default: desc) - Sort order (asc/desc)
- `categoryId` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `isActive` - Filter by active status

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 100,
      "limit": 20
    }
  }
}
```

#### Get Single Product
```http
GET /api/products/:productId
```

**Response:** `200 OK`

#### Create Product (Seller/Admin only)
```http
POST /api/products
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

name: MacBook Pro
description: High-performance laptop for professionals...
price: 2499.99
discountPrice: 2299.99
stock: 50
sku: MBP-2024-001
categoryId: xxx-xxx-xxx
specifications: {"Brand": "Apple", "RAM": "16GB"}
tags: ["laptop", "apple", "professional"]
images: [file1, file2, ...]
```

**Response:** `201 Created`

#### Update Product (Owner/Admin only)
```http
PUT /api/products/:productId
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Response:** `200 OK`

#### Delete Product (Owner/Admin only)
```http
DELETE /api/products/:productId
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`

---

### Category Endpoints

#### Get All Categories
```http
GET /api/categories?isActive=true&parentCategoryId=null
```

**Response:** `200 OK`

#### Get Single Category
```http
GET /api/categories/:categoryId
```

**Response:** `200 OK`

#### Create Category (Admin only)
```http
POST /api/categories
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "parentCategoryId": null
}
```

**Response:** `201 Created`

#### Update Category (Admin only)
```http
PUT /api/categories/:categoryId
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`

#### Delete Category (Admin only)
```http
DELETE /api/categories/:categoryId
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`

---

### User Profile Endpoints

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer {accessToken}
```

**Response:** `200 OK`

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "9876543210"
}
```

**Response:** `200 OK`

#### Change Password
```http
PUT /api/users/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}
```

**Response:** `200 OK`

---

## 🗂️ Project Structure

```
Backend-project-2/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── auth.js              # Authentication & authorization
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── upload.js            # Multer file upload
│   │   └── validate.js          # Joi validation middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   └── seed.js              # Database seeding
│   ├── validators/
│   │   ├── authValidators.js
│   │   ├── categoryValidators.js
│   │   └── productValidators.js
│   └── server.js                # Application entry point
├── uploads/
│   └── products/                # Uploaded product images
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Security Features

1. **JWT Authentication**
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Tokens stored securely with bcrypt hashing

2. **Password Security**
   - Bcrypt hashing with salt rounds
   - Minimum 8 characters required
   - Password validation

3. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Prevents brute force attacks

4. **Input Validation**
   - Joi schema validation
   - Sanitization of user inputs
   - Type checking and constraints

5. **Security Headers**
   - Helmet.js for HTTP headers
   - CORS configuration
   - XSS protection

## 🧪 Testing with Postman

1. Import the Postman collection (see `postman_collection.json`)
2. Set up environment variables:
   - `baseURL`: http://localhost:5000/api
   - `accessToken`: (auto-populated after login)
   - `refreshToken`: (auto-populated after login)
   - `userId`, `productId`, `categoryId`: (use as needed)

3. Test sequence:
   - Register a new user
   - Login to get tokens
   - Create categories (as admin)
   - Create products (as seller)
   - Test search and filtering
   - Update profile
   - Test authorization on protected routes

## 📝 Database Schema

### Users Collection
- userId (UUID, unique)
- firstName, lastName (String, required)
- email (String, unique, indexed)
- password (String, bcrypt hashed)
- role (enum: customer, seller, admin)
- phoneNumber (String, optional)
- isActive (Boolean)
- refreshToken (String, hashed)
- timestamps

### Categories Collection
- categoryId (UUID, unique)
- name (String, unique, indexed)
- slug (String, unique, auto-generated)
- description (Text)
- parentCategoryId (UUID, optional)
- isActive (Boolean)
- timestamps

### Products Collection
- productId (UUID, unique)
- name (String, required)
- slug (String, unique, auto-generated)
- description (Text, min 50 chars)
- price, discountPrice (Decimal)
- stock (Integer)
- sku (String, unique)
- categoryId, sellerId (References)
- images (Array of URLs)
- specifications (Map/Object)
- tags (Array)
- rating (Decimal, 0-5)
- isActive (Boolean)
- timestamps

## 🚨 Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

ISC

## 👨‍💻 Author

Your Name

---

**Happy Coding! 🎉**
