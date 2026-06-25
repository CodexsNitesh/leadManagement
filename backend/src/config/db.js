const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB Atlas using Mongoose.
 * Exits process on failure since the app cannot function without a DB connection.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Modern mongoose (8.x) no longer needs useNewUrlParser/useUnifiedTopology,
      // they are defaults now, but kept here as explicit documentation.
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error after initial connect:', err.message);
    });
  } catch (error) {
    console.error('❌ MongoDB initial connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;