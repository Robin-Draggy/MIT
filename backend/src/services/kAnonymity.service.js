import { generalizeAge, generalizeZip, ageLadder, zipLadder } from "../utils/generalizers.js";

/**
 * Anonymize records using iterative generalization hierarchy.
 * - records: array of { id, age, zip, diagnosis }
 * - opts: { k, requireLDiversity, l }
 *
 * Returns: { anonymized: [], suppressed: [], levels: { age, zip } }
 */

export function anonymizeK(records, opts = {}) {
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
      id: rec.id,
      age: generalizeAge(rec.age, ageLevel),
      zip: generalizeZip(rec.zip, zipLevel),
      diagnosis: rec.diagnosis,
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
      if (arr.length < k) {
        violateKeys.push(key);
        continue;
      }
      if (requireLDiversity) {
        const distinct = new Set(arr.map((x) => x.diagnosis)).size;
        if (distinct < l) violateKeys.push(key);
      }
    }
    return { violateKeys, groups: g };
  }

  let current = records.map(project);

  while (true) {
    const { violateKeys } = violates(current);
    if (violateKeys.length === 0) break;

    // Heuristic: try increasing the QI with more distinct values first
    let progressed = false;
    if (ageLevel < maxAge) {
      ageLevel += 1;
      progressed = true;
    } else if (zipLevel < maxZip) {
      zipLevel += 1;
      progressed = true;
    }

    current = records.map(project);
    if (!progressed) break; // cannot generalize further
  }

  // Final suppression for remaining violating groups
  const { violateKeys, groups } = violates(current);
  const suppressed = [];
  const anonymized = [];
  const suppressSet = new Set(violateKeys);

  for (const [key, arr] of groups.entries()) {
    if (suppressSet.has(key)) suppressed.push(...arr);
    else anonymized.push(...arr);
  }

  return { anonymized, suppressed, levels: { age: ageLevel, zip: zipLevel } };
}
