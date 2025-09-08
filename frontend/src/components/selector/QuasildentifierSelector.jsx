import React from 'react';

const identifiers = [
  'Age', 'Gender', 'ZIP Code', 'Income',
  'Education', 'Occupation', 'Diagnosis',
  'Treatment', 'Admission Date'
];

export const QuasiIdentifierSelector = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h3 className="font-medium mb-2">Select Quasi-Identifiers:</h3>
      <div className="grid grid-cols-3 gap-2">
        {identifiers.map((label) => (
          <label key={label} className="inline-flex items-center gap-2">
            <input type="checkbox" className="accent-[#3742fa]" defaultChecked={['Age', 'Gender', 'ZIP Code', 'Income', 'Education', 'Diagnosis', 'Admission Date'].includes(label)} />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};