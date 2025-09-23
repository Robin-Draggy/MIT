// src/services/kAnonymity.service.js
const { generalizeAge, ageLadder } = require('../utils/generalizers');

/**
 * anonymizeK(records, opts)
 * - records: array of patient objects (raw rows)
 * - opts: { k, selectedQIs: ['age','sex',...], requireLDiversity, l }
 *
 * Returns: { anonymized: [], suppressed: [], levels: { age }, metrics: { total, released, suppressed, suppressionRate } }
 */
function anonymizeK(records = [], opts = {}) {
  const k = Number(opts.k) || 3;
  const selectedQIs = Array.isArray(opts.selectedQIs) && opts.selectedQIs.length > 0
    ? opts.selectedQIs
    : ['age', 'sex', 'procedure_category', 'ward'];

  let requireLDiversity = !!opts.requireLDiversity;
  const l = Number(opts.l) || 2;

  if (!Array.isArray(records) || records.length === 0) {
    return { anonymized: [], suppressed: [], levels: { age: 0 }, metrics: { total: 0, released: 0, suppressed: 0, suppressionRate: 0 } };
  }

  // If l-diversity requested but 'outcome' not present in records, disable it
  if (requireLDiversity && records.every(r => r.outcome === undefined)) {
    requireLDiversity = false;
  }

  let ageLevel = 0;
  const maxAge = ageLadder.length - 1;

  // project record according to current generalization levels
  function project(rec) {
    const out = {
      id: rec.patient_id || rec.id || rec._id || null,
      // keep raw dates and patient_id for output
      patient_id: rec.patient_id,
      admission_date: rec.admission_date,
      discharge_date: rec.discharge_date,
      length_of_stay_days: rec.length_of_stay_days,
      ageRaw: rec.age,
      age: generalizeAge(rec.age, ageLevel),
      sex: rec.sex || "Unknown",
      procedure_category: rec.procedure_category || "Unknown",
      ward: rec.ward || "Unknown",
      severity_score_1_10: rec.severity_score_1_10,
      comorbidity_count: rec.comorbidity_count,
      complications_flag: rec.complications_flag,
      days_to_stable: rec.days_to_stable,
      treatment_cost_aud: rec.treatment_cost_aud,
      insurance_type: rec.insurance_type,
      outcome: rec.outcome,
      discharge_disposition: rec.discharge_disposition,
      readmission_30d: rec.readmission_30d,
      mortality_flag: rec.mortality_flag,
    };

    // Build key parts for selected QIs (use projected age for 'age' QI)
    out._keyParts = selectedQIs.map(q => {
      if (q === 'age') return out.age;
      return (out[q] !== undefined ? String(out[q]) : "Unknown");
    });

    return out;
  }

  function groupRows(rows) {
    const map = new Map();
    for (const r of rows) {
      const key = r._keyParts.join('__');
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
        const distinct = new Set(arr.map(x => x.outcome)).size;
        if (distinct < l) violateKeys.push(key);
      }
    }
    return { violateKeys, groups: g };
  }

  let current = records.map(project);
  // iterative generalization only on age (you can extend to other QIs later)
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

  // final grouping and split anonymized/suppressed
  const { violateKeys, groups } = violates(current);
  const suppressed = [];
  const anonymized = [];
  const suppressSet = new Set(violateKeys);
  for (const [key, arr] of groups.entries()) {
    if (suppressSet.has(key)) suppressed.push(...arr);
    else anonymized.push(...arr);
  }

  // If everything suppressed, fallback: return fully generalized rows (no suppression)
  if (anonymized.length === 0 && suppressed.length > 0) {
    const fallback = suppressed.map(r => ({
      id: r.id,
      patient_id: r.patient_id,
      admission_date: r.admission_date,
      discharge_date: r.discharge_date,
      length_of_stay_days: r.length_of_stay_days,
      age: "[Any Age]",
      sex: "Any",
      procedure_category: "Any",
      ward: "Any",
      outcome: "Any",
    }));
    const metrics = {
      total: records.length,
      released: fallback.length,
      suppressed: 0,
      suppressionRate: 0,
      info: "fallback - fully generalized to avoid empty output"
    };
    return { anonymized: fallback, suppressed: [], levels: { age: maxAge }, metrics };
  }

  // Map anonymized/suppressed to output-friendly shape (hide raw internals)
  const mapOut = (r) => ({
    id: r.id,
    patient_id: r.patient_id,
    admission_date: r.admission_date,
    discharge_date: r.discharge_date,
    length_of_stay_days: r.length_of_stay_days,
    age: r.age,
    sex: r.sex,
    procedure_category: r.procedure_category,
    ward: r.ward,
    outcome: r.outcome,
  });

  const outAnonymized = anonymized.map(mapOut);
  const outSuppressed = suppressed.map(mapOut);

  const metrics = {
    total: records.length,
    released: outAnonymized.length,
    suppressed: outSuppressed.length,
    suppressionRate: outSuppressed.length / records.length
  };

  return {
    anonymized: outAnonymized,
    suppressed: outSuppressed,
    levels: { age: ageLevel },
    metrics: {
    total: records.length,
    released: outAnonymized.length,
    suppressed: outSuppressed.length,
    suppressionRate: outSuppressed.length / records.length,
    equivalenceClasses: Array.from(groups.values()).map(g => g.length), // size of each class
    infoLoss: ageLevel / maxAge, // simple approximation
    kAnonymity: violateKeys.length === 0,
    privacyLevel: 1 - (outSuppressed.length / records.length),
    avgClassSize: outAnonymized.length / groups.size,
  }
  };
}

module.exports = { anonymizeK };
