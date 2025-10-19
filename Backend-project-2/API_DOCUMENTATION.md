# API Endpoints Documentation

## Overview
Base URL: `http://localhost:5000/api`

All authenticated endpoints require an `Authorization` header:
```
Authorization: Bearer {accessToken}
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**POST** `/auth/register`

**Access:** Public

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "customer",           // Optional: customer, seller, admin
  "phoneNumber": "1234567890"   // Optional
}
```

**Validation:**
- firstName: 2-50 characters, required
- lastName: 2-50 characters, required
- email: Valid email format, required, unique
- password: Minimum 8 characters, required
- phoneNumber: 10-15 digits

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "userId": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "customer",
      "phoneNumber": "1234567890",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1..."
  }
}
```

---

### 1.2 Login
**POST** `/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 1.3 Logout
**POST** `/auth/logout`

**Access:** Private (Authenticated users)

**Headers:** `Authorization: Bearer {accessToken}`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 1.4 Refresh Token
**POST** `/auth/refresh-token`

**Access:** Public

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1..."
  }
}
```

---

## 2. Product Endpoints

### 2.1 Get All Products (with Pagination & Filtering)
**GET** `/products`

**Access:** Public

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Items per page
- `search` (string) - Search in name, description, tags
- `sortBy` (string, default: createdAt) - Field to sort by
- `order` (string, default: desc) - Sort order: asc or desc
- `categoryId` (string) - Filter by category ID
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `isActive` (boolean) - Filter by active status

**Example:**
```
GET /products?page=1&limit=20&search=laptop&sortBy=price&order=asc&minPrice=500&maxPrice=3000
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "productId": "uuid",
        "name": "MacBook Pro",
        "slug": "macbook-pro",
        "description": "...",
        "price": 2499.99,
        "discountPrice": 2299.99,
        "stock": 50,
        "sku": "MBP-001",
        "categoryId": { ... },
        "sellerId": { ... },
        "images": ["url1", "url2"],
        "specifications": { ... },
        "tags": ["laptop", "apple"],
        "rating": 4.8,
        "isActive": true,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 100,
      "limit": 20
    }
  }
}
```

---

### 2.2 Get Single Product
**GET** `/products/:productId`

**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": { ... }
}
```

---

### 2.3 Create Product
**POST** `/products`

**Access:** Private (Seller/Admin only)

**Headers:** 
- `Authorization: Bearer {accessToken}`
- `Content-Type: multipart/form-data`

**Form Data:**
```
name: MacBook Pro
description: High-performance laptop... (min 50 characters)
price: 2499.99
discountPrice: 2299.99 (optional, must be less than price)
stock: 50
sku: MBP-001 (unique)
categoryId: category-uuid
specifications: {"Brand": "Apple", "RAM": "16GB"} (JSON string)
tags: ["laptop", "apple"] (JSON array string)
images: [file1, file2, ...] (max 10 files)
```

**File Upload Validation:**
- Max file size: 5MB (configurable)
- Allowed types: image/jpeg, image/jpg, image/png, image/webp
- Max files: 10

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { ... }
}
```

---

### 2.4 Update Product
**PUT** `/products/:productId`

**Access:** Private (Product owner or Admin)

**Headers:** 
- `Authorization: Bearer {accessToken}`
- `Content-Type: multipart/form-data`

**Form Data:** (All fields optional)
```
name: Updated Name
description: Updated description...
price: 2199.99
stock: 75
isActive: false
...
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You are not authorized to update this product"
}
```

---

### 2.5 Delete Product
**DELETE** `/products/:productId`

**Access:** Private (Product owner or Admin)

**Headers:** `Authorization: Bearer {accessToken}`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 3. Category Endpoints

### 3.1 Get All Categories
**GET** `/categories`

**Access:** Public

**Query Parameters:**
- `isActive` (boolean) - Filter by active status
- `parentCategoryId` (string) - Filter by parent category (use "null" for root categories)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "categoryId": "uuid",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices",
      "parentCategoryId": null,
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 3.2 Get Single Category
**GET** `/categories/:categoryId`

**Access:** Public

---

### 3.3 Create Category
**POST** `/categories`

**Access:** Private (Admin only)

**Request Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "parentCategoryId": null  // Optional: for subcategories
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": { ... }
}
```

---

### 3.4 Update Category
**PUT** `/categories/:categoryId`

**Access:** Private (Admin only)

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "isActive": false
}
```

---

### 3.5 Delete Category
**DELETE** `/categories/:categoryId`

**Access:** Private (Admin only)

**Note:** Cannot delete categories with subcategories

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cannot delete category with subcategories. Delete subcategories first."
}
```

---

## 4. User Profile Endpoints

### 4.1 Get Profile
**GET** `/users/profile`

**Access:** Private (Authenticated users)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "userId": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer",
    "phoneNumber": "1234567890",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 4.2 Update Profile
**PUT** `/users/profile`

**Access:** Private (Authenticated users)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "9876543210"
}
```

**Note:** Email and role cannot be updated via this endpoint

---

### 4.3 Change Password
**PUT** `/users/change-password`

**Access:** Private (Authenticated users)

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}
```

**Validation:**
- newPassword must be minimum 8 characters
- newPassword must be different from currentPassword

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## Common Error Responses

### 400 Bad Request (Validation Error)
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "First name must be at least 2 characters",
    "Email is required"
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error",
  "stack": "..." // Only in development mode
}
```

---

## Role-Based Access Control

| Endpoint           | Public | Customer | Seller | Admin |
| ------------------ | ------ | -------- | ------ | ----- |
| Register/Login     | ✅      | ✅        | ✅      | ✅     |
| Get Products       | ✅      | ✅        | ✅      | ✅     |
| Create Product     | ❌      | ❌        | ✅      | ✅     |
| Update Own Product | ❌      | ❌        | ✅      | ✅     |
| Update Any Product | ❌      | ❌        | ❌      | ✅     |
| Delete Own Product | ❌      | ❌        | ✅      | ✅     |
| Delete Any Product | ❌      | ❌        | ❌      | ✅     |
| Get Categories     | ✅      | ✅        | ✅      | ✅     |
| Create Category    | ❌      | ❌        | ❌      | ✅     |
| Update Category    | ❌      | ❌        | ❌      | ✅     |
| Delete Category    | ❌      | ❌        | ❌      | ✅     |
| Get Profile        | ❌      | ✅        | ✅      | ✅     |
| Update Profile     | ❌      | ✅        | ✅      | ✅     |
| Change Password    | ❌      | ✅        | ✅      | ✅     |

---

## Rate Limiting
- **Window:** 15 minutes
- **Max Requests:** 100 per IP address
- **Applies to:** All `/api/*` routes

---

## Token Expiry
- **Access Token:** 15 minutes
- **Refresh Token:** 7 days

Use the `/auth/refresh-token` endpoint to get a new access token when it expires.
