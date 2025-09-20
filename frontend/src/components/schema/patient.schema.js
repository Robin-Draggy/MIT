import z from "zod";

export const patientSchema = z.object({
  patient_id: z.string().min(1, "Patient ID is required"),
  admission_date: z.string().min(1, "Admission date is required"),
  discharge_date: z.string().min(1, "Discharge date is required"),
  length_of_stay_days: z.coerce.number().int().nonnegative(),
  age: z.coerce.number().int().min(0).max(120),
  sex: z.enum(["Female", "Male", "Other"]),
  procedure_category: z.string().min(1),
  ward: z.string().min(1),
  severity_score_1_10: z.coerce.number().int().min(1).max(10),
  comorbidity_count: z.coerce.number().int().nonnegative(),
  complications_flag: z.coerce.number().int().refine((v) => [0, 1].includes(v)),
  days_to_stable: z.coerce.number().int().nonnegative(),
  treatment_cost_aud: z.coerce.number().nonnegative(),
  insurance_type: z.enum(["Public", "Private", "Self-pay"]),
  outcome: z.string().min(1),
  discharge_disposition: z.string().min(1),
  readmission_30d: z.coerce.number().int().refine((v) => [0, 1].includes(v)),
  mortality_flag: z.coerce.number().int().refine((v) => [0, 1].includes(v)),
});