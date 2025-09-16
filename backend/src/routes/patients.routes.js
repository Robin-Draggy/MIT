// src/routes/patients.routes.js
const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.middleware');
const { patientSchema } = require('../validators/patient.validator');
const controller = require('../controllers/patient.controller');

// POST /api/patients
router.post('/', validate(patientSchema), controller.addPatient);

// GET /api/patients/anonymized?k=3
router.get('/anonymized', controller.getAnonymized);

module.exports = router;