import { useState } from 'react';
import axios from 'axios';

const QUASI_IDENTIFIERS = [
  { name: 'age', details: 'Age of the patient in years' },
  { name: 'sex', details: 'Patient gender' },
  { name: 'procedure_category', details: 'Type of medical procedure' },
  { name: 'ward', details: 'Hospital ward' },
];

export const ConfigureTab = ({ datasetId, goToResults }) => {
  const [kValue, setKValue] = useState(3);
  const [selectedQIs, setSelectedQIs] = useState([]);
  const [requireLDiversity, setRequireLDiversity] = useState(false);
  const [lValue, setLValue] = useState(2);

  // FIXED: Better default values - at least one method should be enabled
  const [useGeneralization, setUseGeneralization] = useState(true);
  const [useSuppression, setUseSuppression] = useState(true);

  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);

  const handleRunAnonymization = async () => {
    if (!datasetId) return alert('No dataset selected!');
    if (selectedQIs.length === 0)
      return alert('Please select at least one quasi-identifier!');

    // FIXED: Validate that at least one method is enabled
    if (!useGeneralization && !useSuppression) {
      return alert('Please enable at least one anonymization method (Generalization or Suppression)');
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:3000/api/datasets/${datasetId}/run`,
        {
          k: kValue,
          selectedQIs,
          requireLDiversity,
          l: lValue,
          // FIXED: Match backend parameter names
          generalize: useGeneralization,
          suppression: useSuppression,
        }
      );
      setMetrics(res.data.counts);
      goToResults?.();
    } catch (err) {
      console.error(err);
      alert('Failed to run anonymization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6 bg-white rounded-lg max-w-6xl mx-auto'>
      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Left: Controls */}
        <div className='flex-1 space-y-6 border border-gray-200 shadow-sm p-4 rounded-lg'>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            Anonymization Parameters
          </h2>

          {/* K-value Slider */}
          <div className='space-y-2'>
            <label className='block font-medium text-gray-700'>
              k-value (Anonymity level)
            </label>
            <div className='flex gap-2 items-center'>
              <input
                type='range'
                min={2}
                max={10}
                value={kValue}
                onChange={(e) => setKValue(Number(e.target.value))}
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#21808D]'
              />
              <div className='flex justify-end text-lg font-bold text-[#21808D]'>
                <span>{kValue}</span>
              </div>
            </div>
          </div>

          {/* Quasi-identifiers */}
          <div>
            <label className='block font-medium mb-2 text-gray-700'>
              Select Quasi-Identifiers
            </label>
            <div className='grid grid-cols-1 gap-3'>
              {QUASI_IDENTIFIERS.map((qi) => (
                <label
                  key={qi.name}
                  className='flex items-center space-x-2 px-3 py-2 rounded cursor-pointer hover:bg-gray-100'
                >
                  <input
                    type='checkbox'
                    checked={selectedQIs.includes(qi.name)}
                    onChange={() => {
                      if (selectedQIs.includes(qi.name)) {
                        setSelectedQIs(
                          selectedQIs.filter((c) => c !== qi.name)
                        );
                      } else {
                        setSelectedQIs([...selectedQIs, qi.name]);
                      }
                    }}
                    className='accent-blue-600'
                  />
                  <span className='text-gray-700'>{qi.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* FIXED: L-diversity controls */}
          <div className='space-y-3 p-3 border border-gray-200 rounded-lg'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={requireLDiversity}
                onChange={() => setRequireLDiversity(!requireLDiversity)}
                className='accent-blue-600'
              />
              <span className='font-medium text-gray-700'>Enable L-Diversity</span>
            </label>
            
            {requireLDiversity && (
              <div className='space-y-2 ml-6'>
                <label className='block text-sm font-medium text-gray-700'>
                  L-value (Diversity level)
                </label>
                <input
                  type='number'
                  min={2}
                  max={5}
                  value={lValue}
                  onChange={(e) => setLValue(Number(e.target.value))}
                  className='w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <p className='text-xs text-gray-500'>
                  Minimum distinct sensitive values per group
                </p>
              </div>
            )}
          </div>

          {/* FIXED: Generalization & Suppression with better UX */}
          <div className='space-y-3 p-3 border border-gray-200 rounded-lg'>
            <label className='block font-medium text-gray-700'>
              Anonymization Methods
            </label>
            <div className='flex flex-col gap-3'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={useGeneralization}
                  onChange={() => setUseGeneralization(!useGeneralization)}
                  className='accent-blue-600'
                />
                <span className='text-gray-700'>
                  Generalization (Age grouping)
                </span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={useSuppression}
                  onChange={() => setUseSuppression(!useSuppression)}
                  className='accent-blue-600'
                />
                <span className='text-gray-700'>
                  Suppression (Remove risky records)
                </span>
              </label>
            </div>
            
            {/* FIXED: Warning when both methods are disabled */}
            {!useGeneralization && !useSuppression && (
              <p className='text-sm text-red-600 mt-2'>
                ⚠️ At least one method must be enabled
              </p>
            )}
            
            {/* FIXED: Help text */}
            <p className='text-xs text-gray-500 mt-2'>
              <strong>Generalization</strong>: Groups ages into ranges (e.g., 20-29, 30-39)<br/>
              <strong>Suppression</strong>: Removes records that cannot meet k-anonymity
            </p>
          </div>
        </div>

        {/* Right: Selected QIs display */}
        <div className='flex-1 space-y-3 border border-gray-200 shadow-sm p-4 rounded-lg'>
          <h3 className='text-2xl font-bold text-gray-800 mb-2'>
            Configuration Summary
          </h3>
          
          <div className='space-y-4'>
            {/* Configuration Summary */}
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h4 className='font-semibold text-gray-700 mb-2'>Current Settings:</h4>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>• <strong>k-value</strong>: {kValue}</li>
                <li>• <strong>Quasi-identifiers</strong>: {selectedQIs.length > 0 ? selectedQIs.join(', ') : 'None selected'}</li>
                <li>• <strong>L-diversity</strong>: {requireLDiversity ? `Enabled (l=${lValue})` : 'Disabled'}</li>
                <li>• <strong>Generalization</strong>: {useGeneralization ? 'Enabled' : 'Disabled'}</li>
                <li>• <strong>Suppression</strong>: {useSuppression ? 'Enabled' : 'Disabled'}</li>
              </ul>
            </div>

            {/* Run Button */}
            <div className='w-full'>
              <button
                onClick={handleRunAnonymization}
                disabled={loading || selectedQIs.length === 0 || !datasetId || (!useGeneralization && !useSuppression)}
                className='w-full px-6 py-3 bg-[#21808D] text-white cursor-pointer rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-[#1a6d78]'
              >
                {loading ? 'Running Anonymization...' : 'Apply K-Anonymity'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};