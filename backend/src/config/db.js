const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error after initial connect:', err.message);
    });
  } catch (error) {
    console.error('❌ MongoDB initial connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDB;
