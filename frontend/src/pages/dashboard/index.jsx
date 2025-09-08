// src/pages/Dashboard.jsx

import { FaFileUpload, FaCogs, FaChartBar } from 'react-icons/fa';
import { Card } from '../../components/cards/Card';
import { RecentProjectsTable } from '../../components/tables/RecentProjectsTable';

export const Dashboard = () => {
  return (
    <div className='w-full p-8 space-y-8 rounded-xl'>
      {/* Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card title='File Upload' icon={<FaFileUpload />}>
          {/* You can put a file input or instructions here */}
          <input
            type='file'
            className='mt-2 border border-gray-300 rounded p-1 w-40'
          />
        </Card>

        <Card title='Configure Anonymization' icon={<FaCogs />}>
          <div className='text-3xl font-bold text-blue-600'>5</div>
        </Card>

        <Card title='Reports & Analytics' icon={<FaChartBar />}>
          View detailed reports and analytics here.
        </Card>
      </div>

      {/* Recent Projects Table */}
      <div>
        <h2 className='text-xl font-semibold mb-4'>Recent Patients</h2>
        <RecentProjectsTable />
      </div>
    </div>
  );
};