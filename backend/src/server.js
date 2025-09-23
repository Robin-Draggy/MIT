// src/server.js
const app = require('./app');
const config = require('./config');
const logger = require('./logger');
const db = require('./db/mongoose');

const port = config.port || 3000;

(async () => {
  try {
    await db.connect();
    app.listen(port, () => logger.info(`Server listening on port ${port}`));
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
})();