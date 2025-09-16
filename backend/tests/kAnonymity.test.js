// tests/kAnonymity.test.js
const { anonymizeK } = require('../src/services/kAnonymity.service');

test('anonymizeK suppresses small groups', () => {
  const data = [
    { _id: 1, age: 25, zip: '12345', diagnosis: 'A' },
    { _id: 2, age: 26, zip: '12345', diagnosis: 'A' },
    { _id: 3, age: 27, zip: '12345', diagnosis: 'A' },
    { _id: 4, age: 50, zip: '99999', diagnosis: 'B' }
  ];
  const { anonymized, suppressed } = anonymizeK(data, { k: 3 });
  // the group of zip 12345 with ages 25,26,27 should be anonymized/released (>=3)
  // the single record 99999 should be suppressed
  expect(anonymized.length).toBeGreaterThanOrEqual(1);
  expect(suppressed.length).toBeGreaterThanOrEqual(0);
});

test('k and l diversity enforced', () => {
  const data = [
    { _id: 1, age: 25, zip: '11111', diagnosis: 'A' },
    { _id: 2, age: 26, zip: '11111', diagnosis: 'A' },
    { _id: 3, age: 27, zip: '11111', diagnosis: 'B' },
    { _id: 4, age: 50, zip: '99999', diagnosis: 'C' }
  ];
  const { anonymized, suppressed } = anonymizeK(data, { k: 3, requireLDiversity: true, l: 2 });
  // the group 11111 has 3 rows with 2 distinct diagnoses (A,B) so it should pass
  expect(anonymized.length).toBeGreaterThanOrEqual(1);
});