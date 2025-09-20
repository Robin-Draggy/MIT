import { useEffect, useState } from 'react';
import { getAnonymized } from '../../api';
import { ReleasedSuppressedPie } from '../../components/charts/ReleasedSuppressedPie';
import { AgeDistributionBar } from '../../components/charts/AgeDistributionBar';
import { CustomDataTable } from '../../components/data-table';

export const AnnonymizationResults = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAnonymized(2, 1);
        setData(res.data.data);
        setStats(res.data.counts);
      } catch (err) {
        console.error('Error fetching anonymized data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  console.log('data', data);
  if (loading) return <p className='text-center mt-10'>Loading...</p>;

  if (!stats) return <p className='text-center mt-10'>No data available</p>;

  const columns = [
    { name: 'Patient ID', selector: (row) => row.patient_id, sortable: true },
    { name: 'Age', selector: (row) => row.ageRaw, sortable: true },
    { name: 'Sex', selector: (row) => row.sex, sortable: true },
    { name: 'Ward', selector: (row) => row.ward, sortable: true },
    { name: 'Outcome', selector: (row) => row.outcome, sortable: true },
  ];

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Anonymized Patient Data</h1>

      {/* Stats Cards */}
      <div className='grid grid-cols-3 gap-4'>
        <div className='p-4 bg-white rounded-lg shadow'>
          <p className='text-gray-500'>Total</p>
          <h2 className='text-xl font-semibold'>{stats.total}</h2>
        </div>
        <div className='p-4 bg-white rounded-lg shadow'>
          <p className='text-gray-500'>Released</p>
          <h2 className='text-xl font-semibold text-green-600'>
            {stats.released}
          </h2>
        </div>
        <div className='p-4 bg-white rounded-lg shadow'>
          <p className='text-gray-500'>Suppressed</p>
          <h2 className='text-xl font-semibold text-red-600'>
            {stats.suppressed}
          </h2>
        </div>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-2 gap-6'>
        <ReleasedSuppressedPie stats={stats} />
        <AgeDistributionBar data={data} />
      </div>

      {/* Data Table */}
      <div
        className='bg-white p-4 rounded-lg shadow overflow-auto'
        style={{ maxHeight: '500px' }}
      >
        <h2 className='text-lg font-semibold mb-2'>Anonymized Records</h2>
        <CustomDataTable columns={columns} data={data} loading={loading} />
      </div>
    </div>
  );
};
