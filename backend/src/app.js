// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const patientsRoutes = require('./routes/patients.routes');
const datasetsRoutes = require('./routes/datasets.routes');  
const errorMiddleware = require('./middlewares/error.middleware');


const app = express();

app.use(helmet());
app.use(express.json({ limit: '10mb' })); 
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

app.use(rateLimit({
  windowMs: config.security.rateLimitWindowMs || 60000,
  max: config.security.rateLimitMax || 120,
}));

// login
app.use("/api/auth", require('./routes/auth'));

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
