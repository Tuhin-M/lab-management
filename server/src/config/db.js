
const prisma = require('../lib/prisma');

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL Connected via Prisma');
  } catch (error) {
    console.error(`Error connecting to PostgreSQL: ${error.message}`);
    // Don't exit process here if we want to allow the server to start (optional)
    // process.exit(1);
  }
};

module.exports = connectDB;
