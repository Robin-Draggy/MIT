import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { patientSchema } from "../validators/patient.validator.js";
import { addPatient, getAnonymized } from "../controllers/patient.controller.js";

const router = Router();

// POST /api/patients
router.post("/", validate(patientSchema), addPatient);

// GET /api/patients/anonymized?k=3
router.get("/anonymized", getAnonymized);

export default router;
