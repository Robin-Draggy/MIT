// src/db/mongoose.js
const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../logger');

async function connect() {
  const uri = config.db.uri;
  try {
    await mongoose.connect(uri, {
      // useNewUrlParser/useUnifiedTopology not required in mongoose v6+
      autoIndex: true
    });
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = { connect, mongoose };