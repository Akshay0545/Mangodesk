const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI ;
  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || 'MANGODESK',
      // strictQuery defaults are fine on Mongoose 8,
      // but you can enable if you like:
      // autoIndex: true
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
