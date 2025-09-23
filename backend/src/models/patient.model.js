// src/models/patient.model.js
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patient_id: {
      type: String,
      required: true,
      unique: true,
    },

    admission_date: {
      type: Date,
      required: true,
    },
    discharge_date: {
      type: Date,
      required: true,
    },

    length_of_stay_days: {
      type: Number,
      required: true,
      min: 0,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },

    sex: {
      type: String,
      enum: ["Female", "Male", "Other"],
      required: true,
    },

    procedure_category: {
      type: String,
      required: true,
    },

    ward: {
      type: String,
      required: true,
    },

    severity_score_1_10: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    comorbidity_count: {
      type: Number,
      required: true,
      min: 0,
    },

    complications_flag: {
      type: Number,
      enum: [0, 1], // binary
      required: true,
    },

    days_to_stable: {
      type: Number,
      required: true,
      min: 0,
    },

    treatment_cost_aud: {
      type: Number,
      required: true,
      min: 0,
    },

    insurance_type: {
      type: String,
      enum: ["Public", "Private", "Self-pay"],
      required: true,
    },

    outcome: {
      type: String,
      required: true,
    },

    discharge_disposition: {
      type: String,
      required: true,
    },

    readmission_30d: {
      type: Number,
      enum: [0, 1], // binary
      required: true,
    },

    mortality_flag: {
      type: Number,
      enum: [0, 1], // binary
      required: true,
    },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

module.exports = mongoose.model("Patient", patientSchema);
