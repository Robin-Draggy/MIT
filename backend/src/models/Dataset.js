// src/models/Dataset.js
const mongoose = require('mongoose');

// Define a schema for a single column
const ColumnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, default: 'string' },
  },
  { _id: false } // don't generate _id for each column
);

const DatasetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uploadedBy: { type: String },
  uploadedAt: { type: Date, default: Date.now },

  // ✅ Columns guaranteed to be an array of objects
  columns: {
    type: [ColumnSchema],
    default: [],
    set: (val) => {
      // If val is a string (e.g., JSON from Postman), try to parse it
      if (typeof val === 'string') {
        try {
          val = JSON.parse(val);
        } catch (err) {
          return []; // fallback to empty
        }
      }

      // If val is not an array, force it to an array
      if (!Array.isArray(val)) {
        val = [val];
      }

      // Ensure each item is an object with { name, type }
      return val
        .map((col) => {
          if (typeof col === 'string') {
            return { name: col, type: 'string' };
          }
          return {
            name: col?.name || 'unknown',
            type: col?.type || 'string',
          };
        })
        .filter((c) => c.name); // remove empties
    },
  },

  rows: { type: [mongoose.Schema.Types.Mixed], default: [] },

  anonymized: {
    rows: { type: [mongoose.Schema.Types.Mixed], default: [] },
    config: mongoose.Schema.Types.Mixed,
    metrics: mongoose.Schema.Types.Mixed,
  },
});

module.exports = mongoose.model('Dataset', DatasetSchema);
