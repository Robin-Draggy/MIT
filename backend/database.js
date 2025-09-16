const mongoose = require('mongoose');
const config = require('./src/config');
const Patient = require('./src/models/patient.model');

async function main() {
  await mongoose.connect(config.db.uri);
  console.log('Connected to Mongo for seeding.');

  const sample = [
    { age: 25, zip: '12345', diagnosis: 'A' },
    { age: 26, zip: '12345', diagnosis: 'A' },
    { age: 27, zip: '12345', diagnosis: 'A' },
    { age: 50, zip: '99999', diagnosis: 'B' },
    { age: 65, zip: '12366', diagnosis: 'C' },
    { age: 67, zip: '12366', diagnosis: 'D' }
  ];

  await Patient.deleteMany({});
  await Patient.insertMany(sample);
  console.log('Seeded sample patients.');
  await mongoose.disconnect();
  console.log('Disconnected.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});