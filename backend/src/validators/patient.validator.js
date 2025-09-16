import { z } from "zod";

export const patientSchema = z.object({
  age: z.number().min(0).max(120),
  zip: z.string().min(3),
  diagnosis: z.string().min(1),
});