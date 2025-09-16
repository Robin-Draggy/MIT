// src/controllers/patient.controller.js
import pool from '../db/pool.js';
import { anonymizeK } from '../services/kAnonymity.service.js';
import config from '../config/index.js';

export async function addPatient(req, res, next) {
  try {
    const { age, zip, diagnosis } = req.validated;

    const conn = await pool.getConnection();
    try {
      await conn.execute(
        'INSERT INTO patients (age, zip, diagnosis) VALUES (?, ?, ?)',
        [age, zip, diagnosis]
      );
    } finally {
      conn.release();
    }

    res.status(201).json({ message: 'Patient added' });
  } catch (err) {
    next(err);
  }
}

export async function getAnonymized(req, res, next) {
  try {
    const k = parseInt(req.query.k, 10) || config.privacy.defaultK;
    const l = parseInt(req.query.l, 10) || config.privacy.lDiversity;
    const requireLDiversity = config.privacy.enableLDiversity;

    const conn = await pool.getConnection();
    let rows;
    try {
      [rows] = await conn.query(
        'SELECT id, age, zip, diagnosis FROM patients'
      );
    } finally {
      conn.release();
    }

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
