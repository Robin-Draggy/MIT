// src/utils/generalizers.js

// Age ladder: level 0 = exact age, 1 = 10-year buckets, 2 = 20-year buckets, 3 = Any
const ageLadder = [
  (age) => (age == null ? "Unknown" : String(age)), // level 0 exact
  (age) => {
    if (age == null) return "Unknown";
    const a = Number(age);
    const lo = Math.floor(a / 10) * 10;
    return `[${lo}-${lo + 9}]`;
  },
  (age) => {
    if (age == null) return "Unknown";
    const a = Number(age);
    if (a < 30) return "[<30]";
    if (a < 60) return "[30-59]";
    return "[60+]";
  },
  (age) => "[Any Age]",
];

function generalizeAge(age, level) {
  const lev = Math.max(0, Math.min(level, ageLadder.length - 1));
  return ageLadder[lev](age);
}

module.exports = { generalizeAge, ageLadder };
