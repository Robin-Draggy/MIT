// src/utils/generalization.js

const ageLadder = [
  (age) => {
    if (age <= 9) return "[0-9]";
    if (age <= 19) return "[10-19]";
    if (age <= 29) return "[20-29]";
    if (age <= 39) return "[30-39]";
    if (age <= 49) return "[40-49]";
    if (age <= 59) return "[50-59]";
    if (age <= 69) return "[60-69]";
    if (age <= 79) return "[70-79]";
    if (age <= 89) return "[80-89]";
    return "[90+]";
  },
  (age) =>
    age <= 19
      ? "[0-19]"
      : age <= 39
      ? "[20-39]"
      : age <= 59
      ? "[40-59]"
      : age <= 79
      ? "[60-79]"
      : "[80+]",
  (age) => (age >= 60 ? "[60+]" : "[<60]"),
  (_age) => "*",
];

const zipLadder = [
  (zip) => (zip || "").toString().slice(0, 5).padEnd(5, "*"),
  (zip) => (zip || "").toString().slice(0, 3).padEnd(5, "*"),
  (zip) => (zip || "").toString().slice(0, 2).padEnd(5, "*"),
  (_zip) => "*",
];

function generalizeAge(age, level) {
  const l = Math.min(Math.max(0, level), ageLadder.length - 1);
  return ageLadder[l](age);
}

function generalizeZip(zip, level) {
  const l = Math.min(Math.max(0, level), zipLadder.length - 1);
  return zipLadder[l](zip);
}

export { ageLadder, zipLadder, generalizeAge, generalizeZip };
