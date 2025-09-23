import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { DataUpload } from '../../components/anonymization_tabs/DataUpload';
import { ConfigureTab } from '../../components/anonymization_tabs/ConfigureTab';
import { ResultTab } from '../../components/anonymization_tabs/ResultTab';

export const AnonymizationApp = () => {
  const [datasetId, setDatasetId] = useState(null);       // dataset ID from backend
  const [rows, setRows] = useState([]);                   // raw uploaded data
  const [columns, setColumns] = useState([]);             // column info
  const [anonymizedRows, setAnonymizedRows] = useState([]); // anonymized data

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>📊 K-Anonymization Tool</h1>
      <Tab.Group>
        <Tab.List className='flex space-x-2 mb-6 border-b'>
          <Tab className={({ selected }) => selected ? 'pb-2 border-b-2 border-blue-600 font-semibold' : 'pb-2 text-gray-500'}>
            Upload
          </Tab>
          <Tab className={({ selected }) => selected ? 'pb-2 border-b-2 border-blue-600 font-semibold' : 'pb-2 text-gray-500'}>
            Configure
          </Tab>
          <Tab className={({ selected }) => selected ? 'pb-2 border-b-2 border-blue-600 font-semibold' : 'pb-2 text-gray-500'}>
            Result
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* ----------------- Upload Tab ----------------- */}
          <Tab.Panel>
            <DataUpload
              setDatasetId={setDatasetId}
              setRows={setRows}
              setColumns={setColumns}
              rows={rows}
            />
          </Tab.Panel>

          {/* ----------------- Configure Tab ----------------- */}
          <Tab.Panel>
            <ConfigureTab
              datasetId={datasetId}
              columns={columns}
              onApply={async ({ k, selectedQIs }) => {
                if (!datasetId) return;

                try {
                  const res = await axios.post(
                    `http://localhost:3000/api/datasets/${datasetId}/run`,
                    { k, selectedQIs }
                  );

                  // Update anonymized rows to show in Result tab
                  setAnonymizedRows(res.data.data || []);
                } catch (err) {
                  console.error(err);
                  alert('Anonymization failed!');
                }
              }}
            />
          </Tab.Panel>

          {/* ----------------- Result Tab ----------------- */}
          <Tab.Panel>
            <ResultTab rows={anonymizedRows} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
