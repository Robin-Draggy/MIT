// src/db/mongoose.js
const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../logger');

async function connect() {
  const uri = config.db.uri;
  try {
    await mongoose.connect(uri, {
      autoIndex: true, // build indexes automatically
      serverSelectionTimeoutMS: 5000, // fail fast if cluster not reachable
    });
    logger.info(`✅ Connected to MongoDB at ${uri}`);
  } catch (err) {
    logger.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = { connect, mongoose };
