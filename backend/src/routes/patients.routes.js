// src/routes/patients.routes.js
const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.middleware');
const { patientSchema } = require('../validators/patient.validator');
const controller = require('../controllers/patient.controller');

// 📌 Create patient
router.post('/', validate(patientSchema), controller.addPatient);

// 📌 Get anonymized patients
router.get('/anonymized', controller.getAnonymized);

// 📌 Get all patients
router.get('/', async (req, res, next) => {
  try {
    const patients = await require('../models/patient.model').find().lean();
    res.json(patients);
  } catch (err) {
    next(err);
  }
});

// 📌 Update patient
router.put('/:id', validate(patientSchema), controller.updatePatient);

// 📌 Delete patient
router.delete('/:id', controller.deletePatient);

module.exports = router;
