// src/validators/patient.validator.js
const { z } = require('zod');

const patientSchema = z.object({
  age: z.number().int().min(0).max(120),
  zip: z.string().min(2).max(20),
  diagnosis: z.string().min(1).max(255)
});

module.exports = { patientSchema };