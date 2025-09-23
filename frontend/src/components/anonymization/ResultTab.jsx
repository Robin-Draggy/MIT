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
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-b-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading anonymization results...</p>
    </div>
  );


  const { counts, config, data } = results;

  // ---- Compute Metrics ----
  const groupRows = (rows, selectedQIs) => {
    const map = new Map();
    for (const row of rows) {
      const key = selectedQIs.map((q) => row[q] ?? 'Unknown').join('__');
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    }
    return map;
  };

  const eqGroups = groupRows(data, config.selectedQIs || []);
  const recordsPreserved = data.length;
  const avgClassSize =
    eqGroups.size > 0 ? (recordsPreserved / eqGroups.size).toFixed(2) : 0;
  const kAnonymityPassed =
    Math.min(...Array.from(eqGroups.values()).map((g) => g.length)) >= config.k;

  // Table columns
  const tableColumns =
    data && data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          name: key,
          selector: (row) => row[key],
          sortable: true,
        }))
      : [];

  // Equivalence class bar chart data
  const eqClassData = Array.from(eqGroups.values()).map((g, idx) => ({
    name: `Class ${idx + 1}`,
    size: g.length,
  }));

  return (
    <div className='space-y-8 w-full'>
      {/* Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg rounded-xl p-6 flex flex-col justify-between hover:scale-105 transition-transform'>
          <span className='uppercase text-sm opacity-70'>Information Loss</span>
          <span className='text-3xl font-bold mt-2'>
            {(counts?.infoLoss * 100)?.toFixed(2) || 0}%
          </span>
        </div>
        <div className='bg-gradient-to-r from-red-500 to-red-400 text-white shadow-lg rounded-xl p-6 flex flex-col justify-between hover:scale-105 transition-transform'>
          <span className='uppercase text-sm opacity-70'>Suppression Rate</span>
          <span className='text-3xl font-bold mt-2'>
            {(counts?.suppressionRate * 100)?.toFixed(2) || 0}%
          </span>
        </div>
        <div className='bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg rounded-xl p-6 flex flex-col justify-between hover:scale-105 transition-transform'>
          <span className='uppercase text-sm opacity-70'>
            Equivalence Classes
          </span>
          <span className='text-3xl font-bold mt-2'>{eqGroups.size || 0}</span>
        </div>
        <div className='bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-lg rounded-xl p-6 flex flex-col justify-between hover:scale-105 transition-transform'>
          <span className='uppercase text-sm opacity-70'>
            Records Preserved
          </span>
          <span className='text-3xl font-bold mt-2'>{recordsPreserved}</span>
        </div>
      </div>

      {/* Equivalence Class Distribution Chart */}
      <div className='bg-white shadow-lg rounded-xl p-6'>
        <h3 className='text-xl font-semibold mb-6'>
          Equivalence Class Distribution
        </h3>
        <ResponsiveContainer width='100%' height={350}>
          <BarChart data={eqClassData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='size' fill='#3b82f6' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Privacy Analysis */}
      <div className='bg-white shadow-lg rounded-xl p-6'>
        <h3 className='text-xl font-semibold mb-6'>Privacy Analysis</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-gray-50 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition'>
            <span className='text-gray-500 text-sm'>K-Anonymity Status</span>
            <div className='text-lg font-bold mt-2'>
              {kAnonymityPassed ? 'Passed' : 'Failed'}
            </div>
          </div>
          <div className='bg-gray-50 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition'>
            <span className='text-gray-500 text-sm'>Privacy Level</span>
            <div className='text-lg font-bold mt-2'>{config.k}</div>
          </div>
          <div className='bg-gray-50 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition'>
            <span className='text-gray-500 text-sm'>Records Preserved</span>
            <div className='text-lg font-bold mt-2'>{recordsPreserved}</div>
          </div>
          <div className='bg-gray-50 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition'>
            <span className='text-gray-500 text-sm'>Average Class Size</span>
            <div className='text-lg font-bold mt-2'>{avgClassSize}</div>
          </div>
        </div>
      </div>

      {/* Anonymized Data Table */}
      <div className='bg-white shadow-lg rounded-xl p-6 flex flex-col'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-xl font-semibold'>Anonymized Data</h3>
          <button
            onClick={handleExport}
            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition'
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
