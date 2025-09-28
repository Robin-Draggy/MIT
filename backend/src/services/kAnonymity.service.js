// src/services/kAnonymity.service.js
const { generalizeAge, ageLadder } = require('../utils/generalizers');

/**
 * anonymizeK(records, opts)
 * - records: array of patient objects (raw rows)
 * - opts: { 
 *     k, 
 *     selectedQIs: ['age','sex',...], 
 *     requireLDiversity, 
 *     l,
 *     generalize: boolean, // NEW: allow generalization
 *     suppression: boolean  // NEW: allow suppression
 *   }
 *
 * Returns: { anonymized: [], suppressed: [], levels: { age }, metrics: { ... } }
 */
function anonymizeK(records = [], opts = {}) {
  const k = Number(opts.k) || 3;
  const selectedQIs = Array.isArray(opts.selectedQIs) && opts.selectedQIs.length > 0
    ? opts.selectedQIs
    : ['age', 'sex', 'procedure_category', 'ward'];

  let requireLDiversity = !!opts.requireLDiversity;
  const l = Number(opts.l) || 2;
  
  // NEW: Configuration options for generalization and suppression
  const allowGeneralization = opts.generalize !== false; // default to true if not specified
  const allowSuppression = opts.suppression !== false;   // default to true if not specified

  if (!Array.isArray(records) || records.length === 0) {
    return { 
      anonymized: [], 
      suppressed: [], 
      levels: { age: 0 }, 
      metrics: { 
        total: 0, 
        released: 0, 
        suppressed: 0, 
        suppressionRate: 0,
        strategy: 'none',
        info: 'No records to process'
      } 
    };
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
  let strategy = 'none';
  let info = '';

  // NEW: Apply generalization only if enabled
  if (allowGeneralization) {
    strategy = 'generalization';
    while (true) {
      const { violateKeys } = violates(current);
      if (violateKeys.length === 0) break;
      if (ageLevel < maxAge) {
        ageLevel += 1;
        current = records.map(project);
      } else {
        info = 'Max generalization reached';
        break; // cannot generalize further
      }
    }
  }

  // NEW: Apply suppression only if enabled
  const { violateKeys, groups } = violates(current);
  let suppressed = [];
  let anonymized = [];

  if (allowSuppression && violateKeys.length > 0) {
    if (strategy === 'none') strategy = 'suppression';
    else strategy = 'generalization+suppression';
    
    const suppressSet = new Set(violateKeys);
    for (const [key, arr] of groups.entries()) {
      if (suppressSet.has(key)) suppressed.push(...arr);
      else anonymized.push(...arr);
    }
  } else {
    // No suppression allowed or no violations found
    if (violateKeys.length === 0) {
      // All groups satisfy k-anonymity
      anonymized = [...current];
      suppressed = [];
      strategy = strategy === 'none' ? 'original' : strategy;
    } else {
      // Violations exist but suppression is disabled
      if (strategy === 'none') strategy = 'original';
      anonymized = [...current];
      suppressed = [];
      info = 'Suppression disabled - releasing all records despite k-anonymity violations';
    }
  }

  // NEW: Enhanced fallback logic with strategy awareness
  if (anonymized.length === 0 && suppressed.length > 0) {
    if (allowGeneralization) {
      // Try fully generalized fallback
      const fallbackLevel = maxAge;
      const fallbackProject = (rec) => ({
        id: rec.patient_id || rec.id || rec._id || null,
        patient_id: rec.patient_id,
        admission_date: rec.admission_date,
        discharge_date: rec.discharge_date,
        length_of_stay_days: rec.length_of_stay_days,
        age: generalizeAge(rec.age, fallbackLevel),
        sex: rec.sex || "Unknown",
        procedure_category: rec.procedure_category || "Unknown",
        ward: rec.ward || "Unknown",
        outcome: rec.outcome,
      });

      const fallback = suppressed.map(fallbackProject);
      strategy = 'fallback-generalization';
      info = 'Fully generalized fallback to avoid empty output';
      
      const metrics = {
        total: records.length,
        released: fallback.length,
        suppressed: 0,
        suppressionRate: 0,
        strategy,
        info
      };
      return { 
        anonymized: fallback, 
        suppressed: [], 
        levels: { age: fallbackLevel }, 
        metrics 
      };
    } else {
      // If generalization is also disabled, we have to suppress everything
      strategy = 'full-suppression';
      info = 'Both generalization and suppression strategies resulted in empty output';
    }
  }

  // Map anonymized/suppressed to output-friendly shape
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
    suppressionRate: outSuppressed.length / records.length,
    equivalenceClasses: Array.from(groups.values()).map(g => g.length),
    infoLoss: ageLevel / maxAge,
    kAnonymity: violateKeys.length === 0,
    privacyLevel: 1 - (outSuppressed.length / records.length),
    avgClassSize: groups.size > 0 ? outAnonymized.length / groups.size : 0,
    strategy,
    info: info || `Applied ${strategy}`
  };

  return {
    anonymized: outAnonymized,
    suppressed: outSuppressed,
    levels: { age: ageLevel },
    metrics
  };
}

module.exports = { anonymizeK };