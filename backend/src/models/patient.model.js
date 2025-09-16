// src/models/patient.model.js
const { Schema, model } = require('mongoose');

const patientSchema = new Schema({
  age: { type: Number, required: true, min: 0, max: 120 },
  zip: { type: String, required: true },
  diagnosis: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Indexes helpful for queries (similar to SQL indexes)
patientSchema.index({ age: 1 });
patientSchema.index({ zip: 1 });
patientSchema.index({ diagnosis: 1 });

module.exports = model('Patient', patientSchema);