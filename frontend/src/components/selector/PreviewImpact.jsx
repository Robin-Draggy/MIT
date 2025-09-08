import React from 'react';

const PreviewImpact = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mt-4">
      <h3 className="font-medium mb-2">Preview Impact:</h3>
      <p><strong>Original:</strong> Age=34, ZIP=12345, Diagnosis=Diabetes</p>
      <p><strong>Anonymized:</strong> Age=30-39, ZIP=123**, Diagnosis=Endocrine</p>
      <p><strong>Information Loss Estimate:</strong> ~15%</p>
    </div>
  );
};

export default PreviewImpact;