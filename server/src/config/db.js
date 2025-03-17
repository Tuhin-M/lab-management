
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the MongoDB Atlas connection string from environment variables
    // Fall back to local MongoDB if not provided
    const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare-app';
    
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Log database name for verification
    console.log(`Database Name: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
