
# Healthcare App Backend

This is the Node.js backend API for the Healthcare App.

## Features

- User authentication with JWT
- Doctor appointment management
- Lab test booking
- User profile management
- Blog posts API

## MongoDB Setup

The application requires MongoDB. You can either:
1. Use MongoDB Atlas (recommended for production)
2. Use a local MongoDB installation (recommended for development)

### Local MongoDB Setup (Recommended for Development)
1. Download and install MongoDB Community Edition from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service:
   - **Windows**: MongoDB should run as a service automatically after installation
   - **macOS**: Run `brew services start mongodb-community` (if installed with Homebrew)
   - **Linux**: Run `sudo systemctl start mongod`
3. Verify MongoDB is running:
   - Run `mongo` or `mongosh` in your terminal/command prompt
   - You should see the MongoDB shell prompt

## Environment Setup

1. Create a `.env` file in the root of the server directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/healthcare-app

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
```

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Seed the database with sample data:
   ```
   npm run seed
   ```

3. Run the server:
   ```
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

4. The server will be running at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/specialties` - Get all specialties

### Labs
- `GET /api/labs` - Get all labs
- `GET /api/labs/:id` - Get lab by ID
- `GET /api/tests` - Get all tests

### Appointments
- `POST /api/appointments` - Book an appointment
- `GET /api/appointments/:id` - Get appointment details
- `DELETE /api/appointments/:id` - Cancel appointment

### User
- `GET /api/user/appointments` - Get user's appointments
- `GET /api/user/test-bookings` - Get user's test bookings

### Blog
- `GET /api/blog/posts` - Get all blog posts
- `GET /api/blog/posts/:id` - Get blog post by ID
- `GET /api/blog/categories` - Get blog categories

## Testing

Run tests with:
```
npm test
```
