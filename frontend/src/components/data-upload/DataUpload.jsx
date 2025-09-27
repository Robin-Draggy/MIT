// src/pages/DataUploadPage.jsx
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { uploadDataset } from '../../api';

export const DataUpload = ({
  setDatasetId,
  setColumns,
  setRows,
  columns,
  rows,
  goToConfigure,
}) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file select
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload to backend
  const handleUpload = async () => {
    if (!file) return alert('Please select a CSV file!');

    try {
      setLoading(true);
      const res = await uploadDataset(file);
      console.log(res);
      setDatasetId(res.data.datasetId);
      setRows(res.data.data || []);
      setColumns(res.data.columns || []);
    } catch (err) {
      console.error(err);
      alert('Upload failed!');
    } finally {
      setLoading(false);
    }
  };

  // Columns for DataTable
  const tableColumns =
    Array.isArray(columns) && columns.length > 0
      ? columns.map((col) => ({
          name: col.name, // 👈 use the name key
          selector: (row) => {
            const value = row[col.name];
            if (typeof value === 'object' && value !== null) {
              return JSON.stringify(value);
            }
            return value ?? '';
          },
          sortable: true,
        }))
      : [];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#F5DDE5', // your desired background color
        color: '#ffffff', // text color
        fontWeight: 'bold',
        fontSize: '14px',
      },
    },
  };

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Upload Dataset</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* File Upload Card */}
        <div className='bg-white shadow rounded-lg p-6 flex flex-col'>
          <div className='mb-4'>
            <label
              htmlFor='file-upload'
              className={`flex flex-col items-center justify-center h-72 border-2 border-dashed rounded-lg cursor-pointer transition
        ${
          dragActive
            ? 'border-blue-500 bg-green-200'
            : 'border-gray-400 bg-green-100'
        }
      `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Icon */}
              <div className='text-6xl mb-4'>📂</div>
              {/* Instruction text */}
              <p className='text-gray-700 text-xl font-bold text-center px-4'>
                Drag and drop your CSV file here <br />
              </p>
              <p className='text-gray-700 text-lg text-center'>
                or click to browse
              </p>
              <input
                id='file-upload'
                type='file'
                accept='.csv'
                onChange={handleFileChange}
                className='hidden'
                customStyles={customStyles}
              />
            </label>
          </div>

          {/* Selected file info */}
          {file && (
            <div className='space-y-4'>
              <div className='flex flex-col text-gray-700'>
                <h2 className='text-2xl font-bold'>Sample Dataasets</h2>
                <button 
                onClick={goToConfigure}
                className='border px-3 py-2 capitalize rounded-lg cursor-pointer'>
                  Load Paitent sample data
                </button>
              </div>
              <div className='text-sm text-gray-700 mb-4 space-y-3 p-4 border border-gray-300 rounded-lg bg-[#F6E3D9]'>
                <h2 className='text-2xl font-bold'>File Information</h2>
                <div className='flex justify-between items-center px-2 py-3 border-gray-200 bg-[#ECCDBA] rounded-lg'>
                  <p className='text-md font-semibold'>File Name: </p>
                  <span className='font-semibold text-[#21808D]'>
                    {file.name}
                  </span>
                </div>
                <div className='flex justify-between items-center px-2 py-3 border-gray-200 bg-[#ECCDBA] rounded-lg'>
                  <p className='text-md font-semibold'>File Size: </p>
                  <span className='font-semibold text-[#21808D]'>
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
                <div className='flex justify-between items-center px-2 py-3 border-gray-200 bg-[#ECCDBA] rounded-lg'>
                  <p className='text-md font-semibold'>File Type: </p>
                  <span className='font-semibold text-[#21808D]'>
                    {file.type || 'CSV'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className='mt-auto px-4 py-2 bg-[#21808D] cursor-pointer text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition'
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {/* Data Preview Card */}
        <div className='bg-white shadow rounded-lg p-6 flex flex-col'>
          <h2 className='text-xl font-semibold mb-4'>Data Preview</h2>
          {rows.length === 0 ? (
            <div className=' text-gray-500'>
              <div className='border px-3 py-2 rounded-lg'>
                <p>Upload a file to see data preview</p>
              </div>
            </div>
          ) : (
            <div className='flex flex-col'>
              <DataTable
                columns={tableColumns}
                data={rows}
                pagination
                paginationPerPage={10}
                highlightOnHover
                dense
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
