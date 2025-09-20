// src/controllers/patient.controller.js
const Patient = require('../models/patient.model');
const { anonymizeK } = require('../services/kAnonymity.service');
const config = require('../config');

async function addPatient(req, res, next) {
  try {
    const patientData = req.validated;
    const p = new Patient(patientData);
    await p.save();
    res.status(201).json({ message: 'Patient added successfully', patient: p });
  } catch (err) {
    next(err);
  }
}

async function getAnonymized(req, res, next) {
  try {
    const k = parseInt(req.query.k, 10) || config.privacy.defaultK;
    const l = parseInt(req.query.l, 10) || config.privacy.lDiversity;
    const requireLDiversity = config.privacy.enableLDiversity;

    // Fetch quasi-identifiers: age, sex, ward, plus all other fields for output
    const rows = await Patient.find(
      {},
      {
        age: 1,
        sex: 1,
        ward: 1,
        patient_id: 1,
        admission_date: 1,
        discharge_date: 1,
        length_of_stay_days: 1,
        procedure_category: 1,
        severity_score_1_10: 1,
        comorbidity_count: 1,
        complications_flag: 1,
        days_to_stable: 1,
        treatment_cost_aud: 1,
        insurance_type: 1,
        outcome: 1,
        discharge_disposition: 1,
        readmission_30d: 1,
        mortality_flag: 1,
      }
    ).lean();

    const { anonymized, suppressed, levels } = anonymizeK(rows, {
      k,
      requireLDiversity,
      l,
    });

    res.json({
      k,
      l: requireLDiversity ? l : null,
      generalizationLevels: levels,
      counts: {
        total: rows.length,
        released: anonymized.length,
        suppressed: suppressed.length,
      },
      data: anonymized,
    });
  } catch (err) {
    next(err);
  }
}


// ✅ Update patient
async function updatePatient(req, res, next) {
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      req.validated,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient updated successfully', patient: updated });
  } catch (err) {
    next(err);
  }
}

// ✅ Delete patient
async function deletePatient(req, res, next) {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addPatient,
  getAnonymized,
  updatePatient,
  deletePatient,
};
