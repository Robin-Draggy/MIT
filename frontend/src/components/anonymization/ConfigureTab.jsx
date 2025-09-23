// src/components/anonymization/ConfigureTab.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export const ConfigureTab = ({
  datasetId,
  columns = [],
  goToResults,
}) => {
  const [kValue, setKValue] = useState(3);
  const [selectedQIs, setSelectedQIs] = useState([]);
  const [requireLDiversity, setRequireLDiversity] = useState(false);
  const [lValue, setLValue] = useState(2);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Reset QIs selection if columns change
    setSelectedQIs([]);
  }, [columns]);

  const handleRunAnonymization = async () => {
    if (!datasetId) return alert('No dataset selected!');
    if (selectedQIs.length === 0)
      return alert('Please select at least one quasi-identifier!');

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:3000/api/datasets/${datasetId}/run`,
        {
          k: kValue,
          selectedQIs,
          requireLDiversity,
          l: lValue,
        }
      );

      setMetrics(res.data.counts);
      alert('Anonymization complete! Check Results tab.');

      if (goToResults) goToResults();
    } catch (err) {
      console.error(err);
      alert('Failed to run anonymization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6 bg-white rounded-lg shadow-lg flex flex-col space-y-6 max-w-3xl mx-auto'>
      <h2 className='text-2xl font-semibold text-gray-800'>
        Configure Anonymization
      </h2>

      {/* K-value Slider */}
      <div className='space-y-2'>
        <label className='block font-medium text-gray-700'>
          k-value: <span className='font-bold'>{kValue}</span>
        </label>
        <input
          type='range'
          min={2}
          max={10}
          value={kValue}
          onChange={(e) => setKValue(Number(e.target.value))}
          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600'
        />
        <div className='flex justify-between text-sm text-gray-500'>
          <span>2</span>
          <span>10</span>
        </div>
      </div>

      {/* Quasi-identifiers */}
      <div>
        <label className='block font-medium mb-2 text-gray-700'>
          Select Quasi-Identifiers
        </label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
          {columns.map((col) => (
            <label
              key={col.name}
              className='flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded shadow-sm cursor-pointer hover:bg-gray-100'
            >
              <input
                type='checkbox'
                checked={selectedQIs.includes(col.name)}
                onChange={() => {
                  if (selectedQIs.includes(col.name)) {
                    setSelectedQIs(selectedQIs.filter((c) => c !== col.name));
                  } else {
                    setSelectedQIs([...selectedQIs, col.name]);
                  }
                }}
                className='accent-blue-600'
              />
              <span className='text-gray-700'>{col.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* L-diversity */}
      <div className='flex items-center space-x-4'>
        <label className='flex items-center space-x-2 cursor-pointer'>
          <input
            type='checkbox'
            checked={requireLDiversity}
            onChange={(e) => setRequireLDiversity(e.target.checked)}
            className='accent-blue-600'
          />
          <span className='text-gray-700'>Require L-diversity</span>
        </label>
        {requireLDiversity && (
          <input
            type='number'
            min={2}
            value={lValue}
            onChange={(e) => setLValue(Number(e.target.value))}
            className='border rounded px-3 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
        )}
      </div>

      {/* Run Anonymization */}
      <button
        onClick={handleRunAnonymization}
        disabled={loading || selectedQIs.length === 0 || !datasetId}
        className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition'
      >
        {loading ? 'Running...' : 'Run Anonymization'}
      </button>
    </div>
  );
};
