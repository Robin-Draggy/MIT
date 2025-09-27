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
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);

  const handleRunAnonymization = async () => {
    if (!datasetId) return alert('No dataset selected!');
    if (selectedQIs.length === 0)
      return alert('Please select at least one quasi-identifier!');
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:3000/api/datasets/${datasetId}/run`,
        { k: kValue, selectedQIs, requireLDiversity, l: lValue }
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

          
        </div>

        {/* Right: Selected QIs display */}
        <div className='flex-1 space-y-3 border border-gray-200 shadow-sm p-4 rounded-lg'>
          <h3 className='text-2xl font-bold text-gray-800 mb-2'>
            Generalization Settings
          </h3>
          {selectedQIs.length === 0 ? (
            <p className='text-gray-500'>
              Select quasi-identifiers to configure generalization levels
            </p>
          ) : (
            <div className='space-y-3'>
              {selectedQIs.map((qiName) => {
                const qi = QUASI_IDENTIFIERS.find((q) => q.name === qiName);
                return (
                  <div
                    key={qi.name}
                    className='bg-gray-50 p-3 rounded-lg shadow-sm flex flex-col hover:bg-gray-100 transition'
                  >
                    <span className='font-medium text-gray-700'>{qi.name}</span>
                    <span className='text-gray-500 text-sm'>{qi.details}</span>
                  </div>
                );
              })}

              <div className='w-full'>
                <button
                  onClick={handleRunAnonymization}
                  disabled={loading || selectedQIs.length === 0 || !datasetId}
                  className='w-full px-6 py-2 bg-[#21808D] text-white cursor-pointer rounded shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition'
                >
                  {loading ? 'Running...' : 'Apply K-Anonymity'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
