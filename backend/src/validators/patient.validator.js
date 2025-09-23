// src/validators/patient.validator.js
const { z } = require("zod");

const patientSchema = z.object({
  patient_id: z.string().min(1, "Patient ID is required"),

  admission_date: z.string().date("Invalid admission date"),
  discharge_date: z.string().date("Invalid discharge date"),

  length_of_stay_days: z.number().int().nonnegative(),
  age: z.number().int().min(0).max(120),

  sex: z.enum(["Female", "Male", "Other"]),

  procedure_category: z.string().min(1),
  ward: z.string().min(1),

  severity_score_1_10: z.number().int().min(1).max(10),
  comorbidity_count: z.number().int().nonnegative(),

  complications_flag: z.union([z.literal(0), z.literal(1)]),
  days_to_stable: z.number().int().nonnegative(),

  treatment_cost_aud: z.number().nonnegative(),

  insurance_type: z.enum(["Public", "Private", "Self-pay"]),

  outcome: z.string().min(1),
  discharge_disposition: z.string().min(1),

  readmission_30d: z.union([z.literal(0), z.literal(1)]),
  mortality_flag: z.union([z.literal(0), z.literal(1)]),
});

module.exports = { patientSchema };
