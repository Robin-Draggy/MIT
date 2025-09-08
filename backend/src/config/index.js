// src/config/index.js
import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "health_data",
  },
  security: {
    corsOrigins: (process.env.CORS_ORIGINS || "")
      .split(",")
      .filter(Boolean),
    rateLimitWindowMs: parseInt(
      process.env.RATE_LIMIT_WINDOW_MS || "60000",
      10
    ),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "120", 10),
  },
  privacy: {
    defaultK: parseInt(process.env.DEFAULT_K || "3", 10),
    enableLDiversity:
      (process.env.ENABLE_L_DIVERSITY || "false") === "true",
    lDiversity: parseInt(process.env.L_DIVERSITY || "2", 10),
  },
};

export default config;
