// src/controllers/dataset.controller.js
const csv = require("csvtojson");
const Dataset = require("../models/Dataset");

async function uploadDataset(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Parse CSV into JSON rows
    const rows = await csv().fromFile(req.file.path);

    if (!rows.length) {
      return res.status(400).json({ error: "CSV is empty" });
    }

    // Extract columns (keys of first row)
    const columns = Object.keys(rows[0]).map((col) => ({
      name: col,
      type: "string", // or add logic to detect number/date
    }));

    // Create dataset
    const dataset = new Dataset({
      name: req.file.originalname,
      uploadedBy: "test-user", // replace with actual user if you have auth
      columns,
      rows,
    });

    await dataset.save();

    res.status(201).json({
      message: "Dataset uploaded successfully",
      datasetId: dataset._id,
      columns: dataset.columns,
      totalRows: dataset.rows.length,
    });
  } catch (err) {
    next(err);
  }
}
