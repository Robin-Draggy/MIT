// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const patientsRoutes = require('./routes/patients.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const logger = require('./logger');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '100kb' }));

// CORS: allow dev origins (can tighten in production)
app.use(cors({ origin: (origin, cb) => cb(null, true) }));

app.use(rateLimit({
  windowMs: config.security.rateLimitWindowMs || 60000,
  max: config.security.rateLimitMax || 120
}));

app.use('/api/patients', patientsRoutes);

app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use(errorMiddleware);

module.exports = app;