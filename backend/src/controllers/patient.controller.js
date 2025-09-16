// src/controllers/patient.controller.js
const Patient = require('../models/patient.model');
const { anonymizeK } = require('../services/kAnonymity.service');
const config = require('../config');

async function addPatient(req, res, next) {
  try {
    const { age, zip, diagnosis } = req.validated;
    const p = new Patient({ age, zip, diagnosis });
    await p.save();
    res.status(201).json({ message: 'Patient added' });
  } catch (err) {
    next(err);
  }
}

async function getAnonymized(req, res, next) {
  try {
    const k = parseInt(req.query.k, 10) || config.privacy.defaultK;
    const l = parseInt(req.query.l, 10) || config.privacy.lDiversity;
    const requireLDiversity = config.privacy.enableLDiversity;

    const rows = await Patient.find({}, { age: 1, zip: 1, diagnosis: 1 }).lean();

    const { anonymized, suppressed, levels } = anonymizeK(rows, { k, requireLDiversity, l });

    res.json({
      k,
      l: requireLDiversity ? l : null,
      generalizationLevels: levels,
      counts: { total: rows.length, released: anonymized.length, suppressed: suppressed.length },
      data: anonymized
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { addPatient, getAnonymized };