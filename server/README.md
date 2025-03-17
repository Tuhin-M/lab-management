
# Healthcare App Backend

This is the Node.js backend API for the Healthcare App.

## Features

- User authentication with JWT
- Doctor appointment management
- Lab test booking
- User profile management
- Blog posts API

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

3. Run the server:
   ```
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

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
