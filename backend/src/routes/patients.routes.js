import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { patientSchema } from "../validators/patient.validator.js";
import * as controller from "../controllers/patient.controller.js";

const router = Router();

// POST /api/patients
router.post("/", validate(patientSchema), controller.addPatient);

// GET /api/patients/anonymized?k=3
router.get("/anonymized", controller.getAnonymized);

export default router;
