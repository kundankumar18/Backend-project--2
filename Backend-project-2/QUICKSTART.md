# 🚀 Quick Start Guide

## Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js v18+ installed (`node --version`)
- ✅ MongoDB installed and running (`mongod --version`)
- ✅ npm or yarn installed

## Step-by-Step Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy the example environment file:
```bash
cp .env.example .env
```

**Important:** Edit `.env` and update these values:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_ACCESS_SECRET` - A strong random secret (min 32 chars)
- `JWT_REFRESH_SECRET` - A different strong random secret

**Quick secret generation:**
```bash
# Generate secrets using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start MongoDB
Make sure MongoDB is running:
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Or run manually
mongod
```

### 4. Seed the Database (Optional but Recommended)
```bash
npm run seed
```

This creates:
- 3 sample users (admin, seller, customer)
- 6 categories
- 6 products

**Sample Credentials:**
```
Admin:    admin@ecommerce.com / Admin@123
Seller:   seller@ecommerce.com / Seller@123
Customer: customer@ecommerce.com / Customer@123
```

### 5. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000 in development mode
```

### 6. Test the API
Open your browser or Postman and test:
```
http://localhost:5000/health
```

You should get:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Testing with Postman

### Option 1: Import Collection
1. Open Postman
2. Click **Import**
3. Select `postman_collection.json` from the project root
4. The collection includes pre-configured requests with test scripts

### Option 2: Manual Testing
1. **Register a new user:**
   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json
   
   {
     "firstName": "Test",
     "lastName": "User",
     "email": "test@example.com",
     "password": "Test@123",
     "role": "seller"
   }
   ```

2. **Copy the `accessToken` from the response**

3. **Create a product:**
   ```
   POST http://localhost:5000/api/products
   Authorization: Bearer YOUR_ACCESS_TOKEN
   Content-Type: multipart/form-data
   
   name: Test Product
   description: A great product with detailed description...
   price: 99.99
   stock: 100
   sku: TEST-001
   categoryId: (get from /api/categories)
   ```

## Common Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed

# Check logs
# Server logs will appear in the console
```

## Project URLs

- **API Base:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health
- **Uploaded Images:** http://localhost:5000/uploads/products/

## Next Steps

1. ✅ **Explore the API** - Use Postman collection to test all endpoints
2. ✅ **Read Documentation** - Check `API_DOCUMENTATION.md` for detailed endpoint info
3. ✅ **Customize** - Modify models, add features, extend functionality
4. ✅ **Deploy** - Deploy to production (Heroku, AWS, DigitalOcean, etc.)

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` or kill the process using port 5000
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

### JWT Secret Error
```
Error: secretOrPrivateKey must have a value
```
**Solution:** Make sure `.env` file exists and contains JWT_ACCESS_SECRET and JWT_REFRESH_SECRET

### Validation Errors
All validation errors will be returned with detailed messages. Check the response body for specific field errors.

## Support

For issues, questions, or contributions:
- Check `README.md` for comprehensive documentation
- Review `API_DOCUMENTATION.md` for endpoint details
- Examine the code - it's well-commented!

---

**Happy Coding! 🎉**
