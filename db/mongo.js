const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.log("⚠ No Mongo URI found. Skipping MongoDB connection.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 MongoDB Connected Successfully!");
  } catch (err) {
    console.error("🔴 MongoDB Connection Failed:", err.message);
  }
}

module.exports = connectDB;

