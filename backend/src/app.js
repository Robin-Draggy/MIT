import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import config from "./config/index.js";
import patientsRoutes from "./routes/patients.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import * as logger from "./logger.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "100kb" }));

// For development; restrict in production
app.use(cors({ origin: (origin, cb) => cb(null, true) }));

app.use(
  rateLimit({
    windowMs: config.security.rateLimitWindowMs || 60000,
    max: config.security.rateLimitMax || 120,
  })
);

app.use("/api/patients", patientsRoutes);

app.get("/health", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

app.use(errorMiddleware);

export default app;
