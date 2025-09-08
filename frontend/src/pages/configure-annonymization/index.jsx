import React from 'react';
import PreviewImpact from '../../components/selector/PreviewImpact';
import { QuasiIdentifierSelector } from '../../components/selector/QuasildentifierSelector';
import { PrivacyConfiguration } from '../../components/selector/PrivacyConfiguration';
import { AnonymizationMethod } from '../../components/selector/AnonymizationMethod';

export const ConfigureAnnonymization = () => {
  return (
    <div className="p-8 bg-white/10 rounded-lg space-y-6">
      <h2 className="text-lg font-semibold">Configure Anonymization - Step 2 of 4</h2>

      <div>
        <p>
          <strong>Dataset:</strong> <span className="text-[#2f3542]">patient_records_2024.csv (12,543 records)</span>
        </p>
      </div>

      <QuasiIdentifierSelector />
      <PrivacyConfiguration />
      <AnonymizationMethod />
      <PreviewImpact />

      <div className="flex justify-between pt-4">
        <button className="px-4 py-2 text-black bg-white shadow-lg hover:text-white rounded-lg cursor-pointer hover:bg-[#3742fa] transition">← Previous</button>
        <button className="px-4 py-2 text-black bg-white shadow-lg hover:text-white rounded-lg cursor-pointer hover:bg-[#3742fa] transition">Preview Results</button>
        <button className="px-4 py-2 text-black bg-white shadow-lg hover:text-white rounded-lg cursor-pointer hover:bg-[#3742fa] transition">Next →</button>
      </div>
    </div>
  );
};