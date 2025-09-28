// src/components/anonymization/ResultsTab.jsx
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { exportResults, getResults } from '../../api';

export const ResultsTab = ({ datasetId }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch anonymization results
  const fetchResults = async () => {
    if (!datasetId) return;
    try {
      setLoading(true);
      const res = await getResults(datasetId);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [datasetId]);

  // Export CSV
  const handleExport = async () => {
    if (!results) return;
    try {
      const res = await exportResults(datasetId, '_blank');
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${results.name || 'anonymized'}-data.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (!results)
    return (
      <div className='flex flex-col items-center justify-center h-64'>
        <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent border-b-transparent rounded-full animate-spin'></div>
        <p className='mt-4 text-gray-600 font-medium'>
          Loading anonymization results...
        </p>
      </div>
    );

  const { counts, config, data } = results;

  // Use counts data from backend instead of recalculating
  const {
    avgClassSize,
    equivalenceClasses,
    infoLoss,
    kAnonymity: backendKAnonymity,
    privacyLevel,
    released,
    suppressed,
    suppressionRate,
    total
  } = counts;

  // Table columns (filter out sensitive fields)
  const hiddenFields = ['id', 'patient_id'];

  const tableColumns =
    data && data.length > 0
      ? Object.keys(data[0])
          .filter((key) => !hiddenFields.includes(key)) // exclude sensitive keys
          .map((key) => ({
            name: key,
            selector: (row) => row[key],
            sortable: true,
          }))
      : [];

  // Prepare equivalence class data for chart using backend data
  const eqClassData = equivalenceClasses.map((size, idx) => ({
    name: `Class ${idx + 1}`,
    size: size,
  }));

  return (
    <div className='space-y-8 w-full'>
      {/* Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white text-black shadow-lg rounded-xl p-3 flex flex-col justify-center items-center hover:scale-105 transition-transform'>
          <span className='uppercase text-lg font-semibold opacity-70'>
            Information Loss
          </span>
          <span className='text-3xl font-bold mt-2 text-[#21808D]'>
            {(infoLoss * 100)?.toFixed(2)}%
          </span>
        </div>
        <div className='bg-white text-black shadow-lg rounded-xl p-3 flex flex-col justify-center items-center hover:scale-105 transition-transform'>
          <span className='uppercase text-lg font-semibold opacity-70'>
            Suppression Rate
          </span>
          <span className='text-3xl font-bold mt-2 text-[#21808D]'>
            {(suppressionRate * 100)?.toFixed(2)}%
          </span>
        </div>
        <div className='bg-white text-black shadow-lg rounded-xl p-3 flex flex-col justify-center items-center hover:scale-105 transition-transform'>
          <span className='uppercase text-lg font-semibold opacity-70'>
            Equivalence Classes
          </span>
          <span className='text-3xl font-bold mt-2 text-[#21808D]'>
            {equivalenceClasses.length}
          </span>
        </div>
        <div className='bg-white text-black shadow-lg rounded-xl p-3 flex flex-col justify-center items-center hover:scale-105 transition-transform'>
          <span className='uppercase text-lg font-semibold opacity-70'>
            Avg Class Size
          </span>
          <span className='text-3xl font-bold mt-2 text-[#21808D]'>
            {avgClassSize?.toFixed(2)}
          </span>
        </div>
      </div>

      <div className='flex flex-col md:flex-row items-stretch justify-center gap-6 w-full'>
        {/* Equivalence Class Distribution Chart */}
        <div className='bg-white shadow-lg rounded-xl p-6 flex-1 flex flex-col'>
          <h3 className='text-xl font-semibold mb-6 text-center md:text-left'>
            Equivalence Class Distribution
          </h3>
          <ResponsiveContainer width='100%' height={350}>
            <BarChart data={eqClassData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`Size: ${value}`, '']}
                labelFormatter={(label) => `Equivalence Class ${label.split(' ')[1]}`}
              />
              <Bar dataKey='size' fill='#3b82f6' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Privacy Analysis */}
        <div className='bg-white shadow-lg rounded-xl p-6 flex-1 flex flex-col'>
          <h3 className='text-xl font-semibold mb-6 text-center md:text-left'>
            Privacy Analysis
          </h3>
          <div className='space-y-4'>
            <div className='bg-[#F4E5D8] flex items-center justify-between rounded-lg p-4 shadow-sm hover:shadow-md transition'>
              <span className='text-gray-500 text-sm md:text-md font-semibold'>
                K-Anonymity Status
              </span>
              <div className={`text-md font-bold ${backendKAnonymity ? 'text-green-600' : 'text-red-600'}`}>
                {backendKAnonymity ? 'Passed' : 'Failed'}
              </div>
            </div>
            <div className='bg-[#F4E5D8] flex items-center justify-between rounded-lg p-4 shadow-sm hover:shadow-md transition'>
              <span className='text-gray-500 text-sm md:text-md font-semibold'>
                Target K-Anonymity
              </span>
              <div className='text-md md:text-lg font-bold text-[#21808D]'>
                {config.k}
              </div>
            </div>
            <div className='bg-[#F4E5D8] flex items-center justify-between rounded-lg p-4 shadow-sm hover:shadow-md transition'>
              <span className='text-gray-500 text-sm md:text-md font-semibold'>
                Records Released
              </span>
              <div className='text-md md:text-lg font-bold text-[#21808D]'>
                {released} / {total}
              </div>
            </div>
            <div className='bg-[#F4E5D8] flex items-center justify-between rounded-lg p-4 shadow-sm hover:shadow-md transition'>
              <span className='text-gray-500 text-sm md:text-md font-semibold'>
                Records Suppressed
              </span>
              <div className='text-md md:text-lg font-bold text-[#21808D]'>
                {suppressed}
              </div>
            </div>
            <div className='bg-[#F4E5D8] flex items-center justify-between rounded-lg p-4 shadow-sm hover:shadow-md transition'>
              <span className='text-gray-500 text-sm md:text-md font-semibold'>
                Privacy Level
              </span>
              <div className='text-md md:text-lg font-bold text-[#21808D]'>
                {(privacyLevel * 100)?.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white text-black shadow-lg rounded-xl p-3 flex flex-col justify-center items-center hover:scale-105 transition-transform'>
          <span className='uppercase text-lg font-semibold opacity-70'>
            Total Records
          </span>
          <span className='text-3xl font-bold mt-2 text-[#21808D]'>
            {total}
          </span>
        </div>
        <div className='bg-white text-black shadow-lg rounded-xl p-3 flex flex-col justify-center items-center hover:scale-105 transition-transform'>
          <span className='uppercase text-lg font-semibold opacity-70'>
            Records Released
          </span>
          <span className='text-3xl font-bold mt-2 text-[#21808D]'>
            {released}
          </span>
        </div>
        <div className='bg-white text-black shadow-lg rounded-xl p-3 flex flex-col justify-center items-center hover:scale-105 transition-transform'>
          <span className='uppercase text-lg font-semibold opacity-70'>
            Records Suppressed
          </span>
          <span className='text-3xl font-bold mt-2 text-[#21808D]'>
            {suppressed}
          </span>
        </div>
      </div>

      {/* Anonymized Data Table */}
      <div className='bg-white shadow-lg rounded-xl p-6 flex flex-col'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-xl font-semibold'>Anonymized Data</h3>
          <button
            onClick={handleExport}
            className='px-4 py-2 bg-[#21808D] text-white rounded-lg shadow-md transition hover:bg-[#1a6a75]'
          >
            Export CSV
          </button>
        </div>
        <div className='overflow-x-auto'>
          <DataTable
            columns={tableColumns}
            data={data}
            pagination
            paginationPerPage={10}
            highlightOnHover
            dense
          />
        </div>
      </div>
    </div>
  );
};