// src/utils/generalizers.js

// Age ladder: level 0 = exact age, level 1 = fixed 10-year buckets (10–100)
const ageLadder = [
  // Level 0: exact age
  (age) => (age == null ? "Unknown" : String(age)),

  // Level 1: fixed buckets
  (age) => {
    if (age == null) return "Unknown";
    const a = Number(age);

    if (a < 10) return "[0-9]";
    if (a <= 19) return "[10-19]";
    if (a <= 29) return "[20-29]";
    if (a <= 39) return "[30-39]";
    if (a <= 49) return "[40-49]";
    if (a <= 59) return "[50-59]";
    if (a <= 69) return "[60-69]";
    if (a <= 79) return "[70-79]";
    if (a <= 89) return "[80-89]";
    if (a <= 100) return "[90-100]";
    return "[100+]"; // fallback for ages > 100
  }
];

function generalizeAge(age, level) {
  const lev = Math.max(0, Math.min(level, ageLadder.length - 1));
  return ageLadder[lev](age);
}

module.exports = { generalizeAge, ageLadder };
