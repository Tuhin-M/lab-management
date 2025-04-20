const cors = require('cors');

const corsOptions = {
  origin: process.env.CLIENT_URL || "https://preview--lab-management.lovable.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
