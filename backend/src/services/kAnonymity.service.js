// src/services/kAnonymity.service.js
const { generalizeAge, ageLadder } = require('../utils/generalizers');

/**
 * anonymizeK(records, opts)
 * - records: array of patient objects
 * - opts: { k, requireLDiversity, l }
 *
 * Returns: { anonymized: [], suppressed: [], levels: { age } }
 */
function anonymizeK(records, opts = {}) {
  const k = opts.k || 3;
  const requireLDiversity = !!opts.requireLDiversity;
  const l = opts.l || 2;

  if (!Array.isArray(records) || records.length === 0) {
    return { anonymized: [], suppressed: [], levels: { age: 0 } };
  }

  let ageLevel = 0;
  const maxAge = ageLadder.length - 1;

  function project(rec) {
    return {
      id: rec._id || rec.id,
      ageRaw: rec.age,
      age: generalizeAge(rec.age, ageLevel),
      sex: rec.sex,
      ward: rec.ward,
      patient_id: rec.patient_id,
      admission_date: rec.admission_date,
      discharge_date: rec.discharge_date,
      length_of_stay_days: rec.length_of_stay_days,
      procedure_category: rec.procedure_category,
      severity_score_1_10: rec.severity_score_1_10,
      comorbidity_count: rec.comorbidity_count,
      complications_flag: rec.complications_flag,
      days_to_stable: rec.days_to_stable,
      treatment_cost_aud: rec.treatment_cost_aud,
      insurance_type: rec.insurance_type,
      outcome: rec.outcome,
      discharge_disposition: rec.discharge_disposition,
      readmission_30d: rec.readmission_30d,
      mortality_flag: rec.mortality_flag
    };
  }

  function groupRows(rows) {
    const map = new Map();
    for (const r of rows) {
      const key = `${r.age}__${r.sex}__${r.ward}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return map;
  }

  function violates(rows) {
    const g = groupRows(rows);
    const violateKeys = [];
    for (const [key, arr] of g.entries()) {
      if (arr.length < k) {
        violateKeys.push(key);
        continue;
      }
      if (requireLDiversity) {
        const distinctOutcomes = new Set(arr.map(x => x.outcome)).size;
        if (distinctOutcomes < l) violateKeys.push(key);
      }
    }
    return { violateKeys, groups: g };
  }

  let current = records.map(project);

  // Keep generalizing age until constraints are satisfied or max level reached
  while (true) {
    const { violateKeys } = violates(current);
    if (violateKeys.length === 0) break;

    if (ageLevel < maxAge) {
      ageLevel += 1;
      current = records.map(project);
    } else {
      break; // cannot generalize further
    }
  }

  const { violateKeys, groups } = violates(current);
  const suppressed = [];
  const anonymized = [];
  const suppressSet = new Set(violateKeys);
  for (const [key, arr] of groups.entries()) {
    if (suppressSet.has(key)) suppressed.push(...arr);
    else anonymized.push(...arr);
  }

  // --- Fallback: if everything is suppressed, release fully generalized dataset ---
  if (anonymized.length === 0 && suppressed.length > 0) {
    const generalized = suppressed.map(r => ({
      id: r.id,
      age: "[Any Age]",
      sex: "Any",
      ward: "Any",
      patient_id: r.patient_id,
      admission_date: r.admission_date,
      discharge_date: r.discharge_date,
      outcome: "Any"
    }));
    return {
      anonymized: generalized,
      suppressed: [],
      levels: { age: maxAge }
    };
  }

  return {
    anonymized,
    suppressed,
    levels: { age: ageLevel }
  };
}

module.exports = { anonymizeK };
