// src/routes/datasets.js
const express = require('express');
const multer = require('multer');
const Papa = require('papaparse');
const { Parser } = require('json2csv');
const Dataset = require('../models/Dataset');
const { anonymizeK } = require('../services/kAnonymity.service');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload CSV
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const csvText = req.file.buffer.toString('utf8');
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    const rows = parsed.data.map((r) => ({
      ...r,
      age: r.age !== undefined && r.age !== '' ? Number(r.age) : null,
      length_of_stay_days: r.length_of_stay_days
        ? Number(r.length_of_stay_days)
        : null,
      treatment_cost_aud: r.treatment_cost_aud
        ? Number(r.treatment_cost_aud)
        : null,
    }));

    // Build columns
    let columns = Object.keys(rows[0] || {}).map((name) => ({
      name: String(name),
      type: 'string',
    }));

    // 🛑 Debugging logs
    console.log("🔎 Type of columns:", typeof columns);
    console.log("🔎 Is Array?", Array.isArray(columns));
    console.log("🔎 First column:", columns[0]);

    const ds = new Dataset({
      name: req.file.originalname,
      columns,
      rows,
    });

    await ds.save();
    res.json({ datasetId: ds._id });
  } catch (err) {
    next(err);
  }
});


// Run anonymization
router.post('/:id/run', async (req, res, next) => {
  try {
    const ds = await Dataset.findById(req.params.id);
    if (!ds) return res.status(404).json({ message: 'Dataset not found' });

    const {
      k = 3,
      selectedQIs = ['age', 'sex', 'procedure_category', 'ward'],
      requireLDiversity = false,
      l = 2,
    } = req.body;

    const { anonymized, suppressed, levels, metrics } = anonymizeK(ds.rows, {
      k,
      selectedQIs,
      requireLDiversity,
      l,
    });

    ds.anonymized = {
      rows: anonymized,
      config: { k, selectedQIs, requireLDiversity, l, levels },
      metrics,
    };

    await ds.save();

    res.json({
      message: 'Anonymization complete',
      counts: {
        total: metrics.total,
        released: metrics.released,
        suppressed: metrics.suppressed,
      },
      metrics,
      config: ds.anonymized.config,
    });
  } catch (err) {
    next(err);
  }
});

// Get anonymized results & counts
router.get('/:id/results', async (req, res, next) => {
  try {
    const ds = await Dataset.findById(req.params.id).lean();
    if (!ds) return res.status(404).json({ message: 'Dataset not found' });
    res.json({
      datasetId: ds._id,
      name: ds.name,
      counts: ds.anonymized?.metrics || {
        total: ds.rows.length,
        released: 0,
        suppressed: ds.rows.length,
      },
      data: ds.anonymized?.rows || [],
      config: ds.anonymized?.config || null,
    });
  } catch (err) {
    next(err);
  }
});

// Export anonymized as CSV
router.get('/:id/export', async (req, res, next) => {
  try {
    const ds = await Dataset.findById(req.params.id).lean();
    if (!ds) return res.status(404).json({ message: 'Dataset not found' });

    const rows = ds.anonymized?.rows || [];
    if (!rows.length)
      return res.status(400).json({ message: 'No anonymized data to export' });

    const parser = new Parser();
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${ds.name || 'dataset'}-anonymized.csv`);
    return res.send(csv);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
