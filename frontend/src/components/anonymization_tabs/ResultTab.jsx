import DataTable from 'react-data-table-component';

export const ResultTab = ({ rows }) => {
  const columns = rows.length
    ? Object.keys(rows[0]).map(key => ({
        name: key,
        selector: row => row[key],
        sortable: true,
      }))
    : [];

  return (
    <div className='bg-white shadow rounded-lg p-6'>
      {rows.length === 0 ? (
        <p className='text-gray-500'>No anonymized data yet</p>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          pagination
          paginationPerPage={10}
          highlightOnHover
          dense
        />
      )}
    </div>
  );
};
