// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const patientsRoutes = require('./routes/patients.routes');
const datasetsRoutes = require('./routes/datasets.routes');  
const errorMiddleware = require('./middlewares/error.middleware');
const logger = require('./logger');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10mb' })); // bumped to 10mb since CSVs can be larger

// ✅ CORS: allow all origins for now (tighten in prod if needed)
app.use(cors({ origin: (origin, cb) => cb(null, true) }));

app.use(rateLimit({
  windowMs: config.security.rateLimitWindowMs || 60000,
  max: config.security.rateLimitMax || 120,
}));

// ✅ Mount routers
app.use('/api/patients', patientsRoutes);
app.use('/api/datasets', datasetsRoutes); 

// ✅ Health check
app.get('/health', (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

// ✅ Error middleware
app.use(errorMiddleware);

module.exports = app;
