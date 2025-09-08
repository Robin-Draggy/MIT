import React from 'react';

export const PrivacyConfiguration = () => {
  return (
    <div>
      <h3 className="font-medium">Privacy Configuration:</h3>
      <p className="text-sm text-[#2f3542]">K-Anonymity Value: <span className="font-bold text-[#3742fa]">[5]</span> ← Each group will have at least 5 records</p>
    </div>
  );
};