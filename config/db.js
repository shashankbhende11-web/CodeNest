// =============================================================
// DATABASE CONFIGURATION
// Handles MongoDB connection using Mongoose
// Future: Add connection pooling, replica set support
// =============================================================

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Options for future scalability (already set as defaults in Mongoose 6+)
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
