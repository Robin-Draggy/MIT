// src/models/Dataset.js
const mongoose = require('mongoose');

const DatasetSchema = new mongoose.Schema({
  name: { type: String },
  uploadedBy: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  columns: [{ name: String, type: String }],
  rows: { type: [mongoose.Schema.Types.Mixed], default: [] }, // raw JSON rows from CSV
  anonymized: {
    rows: { type: [mongoose.Schema.Types.Mixed], default: [] },
    config: mongoose.Schema.Types.Mixed,
    metrics: mongoose.Schema.Types.Mixed,
  },
});

module.exports = mongoose.model('Dataset', DatasetSchema);
