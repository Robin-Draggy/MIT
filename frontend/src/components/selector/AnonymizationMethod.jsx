import React from 'react';

export const AnonymizationMethod = () => {
  return (
    <div>
      <h3 className="font-medium">Anonymization Method:</h3>
      <div className="flex gap-6 mt-2">
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="method" className="accent-[#3742fa]" defaultChecked />
          Generalization
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="method" className="accent-[#3742fa]" />
          Suppression
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="radio" name="method" className="accent-[#3742fa]" />
          Combined Approach
        </label>
      </div>
    </div>
  );
};