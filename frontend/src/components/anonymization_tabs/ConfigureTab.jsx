import { useState } from 'react';
import axios from 'axios';

export const ConfigureTab = ({ datasetId, columns, onApply }) => {
  const [kValue, setKValue] = useState(3);
  const [selectedQIs, setSelectedQIs] = useState([]);

  const quasiIdentifiers = columns.map(col => col.name);

  const handleCheckboxChange = (qi) => {
    if (selectedQIs.includes(qi)) setSelectedQIs(selectedQIs.filter(i => i !== qi));
    else setSelectedQIs([...selectedQIs, qi]);
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {/* Left Panel */}
      <div className='bg-white shadow rounded-lg p-6'>
        <h2 className='text-xl font-semibold mb-4'>K-Anonymity Settings</h2>
        <div className='mb-6'>
          <label className='block mb-2 font-medium'>
            Select k-value: <span className='font-bold'>{kValue}</span>
          </label>
          <input
            type='range'
            min={1}
            max={10}
            value={kValue}
            onChange={e => setKValue(Number(e.target.value))}
            className='w-full accent-blue-600'
          />
        </div>

        <div>
          <label className='block mb-2 font-medium'>Select Quasi-Identifiers:</label>
          <div className='flex flex-col space-y-2'>
            {quasiIdentifiers.map(qi => (
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

      {/* Right Panel */}
      <div className='bg-white shadow rounded-lg p-6 flex flex-col'>
        <h2 className='text-xl font-semibold mb-4'>Generalization Settings</h2>
        <div className='mb-4'>
          <p className='font-medium mb-2'>Selected Quasi-Identifiers:</p>
          {selectedQIs.length > 0 ? (
            <ul className='list-disc list-inside text-gray-700'>
              {selectedQIs.map(qi => <li key={qi}>{qi}</li>)}
            </ul>
          ) : (
            <p className='text-gray-500'>No quasi-identifiers selected</p>
          )}
        </div>

        <button
          onClick={() => onApply({ k: kValue, selectedQIs })}
          className='mt-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition'
        >
          Apply K-Anonymization
        </button>
      </div>
    </div>
  );
};
