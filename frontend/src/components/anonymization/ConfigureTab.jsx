import { useState, useEffect } from 'react';
import axios from 'axios';

export const ConfigureTab = ({ datasetId, onApply }) => {
  const [kValue, setKValue] = useState(3);
  const [selectedQIs, setSelectedQIs] = useState([]);
  const [quasiIdentifiers, setQuasiIdentifiers] = useState([]);

  // Fetch dataset columns from backend
  useEffect(() => {
    if (!datasetId) return;

    const fetchDataset = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/datasets/${datasetId}/results`);
        console.log("first", res)
        if (res.data && res.data.columns) {
          // columns in backend: array of objects { name, type }
          setQuasiIdentifiers(res.data.columns.map(col => col.name));
        } else {
          // fallback: use keys from first row if columns missing
          if (res.data.data.length > 0) {
            setQuasiIdentifiers(Object.keys(res.data.data[0]));
          }
        }
      } catch (err) {
        console.error('Failed to fetch dataset columns:', err);
      }
    };

    fetchDataset();
  }, [datasetId]);

  const handleCheckboxChange = (qi) => {
    if (selectedQIs.includes(qi)) {
      setSelectedQIs(selectedQIs.filter((item) => item !== qi));
    } else {
      setSelectedQIs([...selectedQIs, qi]);
    }
  };

  const handleApply = () => {
    if (selectedQIs.length === 0) {
      alert('Please select at least one quasi-identifier!');
      return;
    }
    onApply({ k: kValue, selectedQIs });
  };

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>⚙️ Configure Anonymization</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Left: k-value + quasi-identifiers */}
        <div className='bg-white shadow rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>K-Anonymity Settings</h2>

          {/* K-value */}
          <div className='mb-6'>
            <label className='block mb-2 font-medium'>
              Select k-value: <span className='font-bold'>{kValue}</span>
            </label>
            <input
              type='range'
              min={1}
              max={10}
              value={kValue}
              onChange={(e) => setKValue(Number(e.target.value))}
              className='w-full accent-blue-600'
            />
          </div>

          {/* Quasi-identifiers checkboxes */}
          <div>
            <label className='block mb-2 font-medium'>Select Quasi-Identifiers:</label>
            <div className='flex flex-col space-y-2'>
              {quasiIdentifiers.length === 0 && (
                <p className='text-gray-500'>No quasi-identifiers available</p>
              )}
              {quasiIdentifiers.map((qi) => (
                <label key={qi} className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    checked={selectedQIs.includes(qi)}
                    onChange={() => handleCheckboxChange(qi)}
                    className='accent-blue-600'
                  />
                  <span>{qi}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: generalization settings */}
        <div className='bg-white shadow rounded-lg p-6 flex flex-col'>
          <h2 className='text-xl font-semibold mb-4'>Generalization Settings</h2>

          <div className='mb-4'>
            <p className='font-medium mb-2'>Selected Quasi-Identifiers:</p>
            {selectedQIs.length > 0 ? (
              <ul className='list-disc list-inside text-gray-700'>
                {selectedQIs.map((qi) => (
                  <li key={qi}>{qi}</li>
                ))}
              </ul>
            ) : (
              <p className='text-gray-500'>No quasi-identifiers selected</p>
            )}
          </div>

          <button
            onClick={handleApply}
            className='mt-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition'
          >
            Apply K-Anonymization
          </button>
        </div>
      </div>
    </div>
  );
};
