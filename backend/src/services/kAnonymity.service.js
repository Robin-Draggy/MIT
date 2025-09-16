// src/services/kAnonymity.service.js
const { generalizeAge, generalizeZip, ageLadder, zipLadder } = require('../utils/generalizers');

/**
 * anonymizeK(records, opts)
 * - records: array of { _id or id, age, zip, diagnosis }
 * - opts: { k, requireLDiversity, l }
 *
 * Returns: { anonymized: [], suppressed: [], levels: { age, zip } }
 */
function anonymizeK(records, opts = {}) {
  const k = opts.k || 3;
  const requireLDiversity = !!opts.requireLDiversity;
  const l = opts.l || 2;

  if (!Array.isArray(records) || records.length === 0) {
    return { anonymized: [], suppressed: [], levels: { age: 0, zip: 0 } };
  }

  let ageLevel = 0;
  let zipLevel = 0;
  const maxAge = ageLadder.length - 1;
  const maxZip = zipLadder.length - 1;

  function project(rec) {
    return {
      id: rec._id || rec.id,
      ageRaw: rec.age,
      age: generalizeAge(rec.age, ageLevel),
      zipRaw: rec.zip,
      zip: generalizeZip(rec.zip, zipLevel),
      diagnosis: rec.diagnosis
    };
  }

  function groupRows(rows) {
    const map = new Map();
    for (const r of rows) {
      const key = `${r.age}__${r.zip}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return map;
  }

  function violates(rows) {
    const g = groupRows(rows);
    const violateKeys = [];
    for (const [key, arr] of g.entries()) {
      if (arr.length < k) { violateKeys.push(key); continue; }
      if (requireLDiversity) {
        const distinct = new Set(arr.map(x => x.diagnosis)).size;
        if (distinct < l) violateKeys.push(key);
      }
    }
    return { violateKeys, groups: g };
  }

  let current = records.map(project);

  while (true) {
    const { violateKeys } = violates(current);
    if (violateKeys.length === 0) break;

    // Heuristic: increment QI with more distinct raw values first
    // compute distinct counts per QI
    const distinctAges = new Set(records.map(r => r.age)).size;
    const distinctZips = new Set(records.map(r => r.zip)).size;

    let progressed = false;

    if ((distinctAges >= distinctZips && ageLevel < maxAge) || zipLevel >= maxZip) {
      ageLevel += 1;
      progressed = true;
    } else if (zipLevel < maxZip) {
      zipLevel += 1;
      progressed = true;
    }

    current = records.map(project);

    if (!progressed) break; // cannot generalize further
  }

  // final suppression for remaining violating groups
  const { violateKeys, groups } = violates(current);
  const suppressed = [];
  const anonymized = [];
  const suppressSet = new Set(violateKeys);
  for (const [key, arr] of groups.entries()) {
    if (suppressSet.has(key)) suppressed.push(...arr);
    else anonymized.push(...arr);
  }

  // Return anonymized and suppressed items (without raw internal fields)
  const mapOut = (r) => ({
    id: r.id,
    age: r.age,
    zip: r.zip,
    diagnosis: r.diagnosis
  });

  return {
    anonymized: anonymized.map(mapOut),
    suppressed: suppressed.map(mapOut),
    levels: { age: ageLevel, zip: zipLevel }
  };
}

module.exports = { anonymizeK };