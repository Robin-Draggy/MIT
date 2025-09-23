import DataTable from 'react-data-table-component';

export const CustomDataTable = ({
  columns,
  data,
  loading,
  noDataMessage,
  totalCount,
  limitPerPage = 15,
  handlePageChange,
}) => {
  return (
    <div className=' w-full'>
      {/* Enable horizontal scroll */}
      <div className='overflow-x-auto w-full'>
        {/* Table should expand but also scroll on small screens */}
        <div className='w-[200px] xl:w-full'>
          <DataTable
            noHeader
            responsive={false}
            pagination
            paginationServer
            data={data}
            columns={columns}
            progressPending={loading}
            paginationPerPage={limitPerPage}
            paginationComponentOptions={{
              noRowsPerPage: true,
              rangeSeparatorText: 'out of',
            }}
            progressComponent={<TablePreloader />}
            onChangePage={handlePageChange}
            paginationTotalRows={totalCount}
          />
        </div>
      </div>
    </div>
  );
};

// Custom loader component
const TablePreloader = () => {
  return (
    <div className='p-4 w-full mx-auto dark:bg-dark-light'>
      <div className='h-2 bg-slate-200 dark:bg-dark mb-2 animate-pulse rounded-full w-[80%]' />
      <div className='h-2 bg-slate-200 dark:bg-dark mb-2 animate-pulse rounded-full w-[70%]' />
      <div className='h-2 bg-slate-200 dark:bg-dark mb-2 animate-pulse rounded-full w-[60%]' />
      <div className='h-2 bg-slate-200 dark:bg-dark mb-2 animate-pulse rounded-full w-[50%]' />
      <div className='h-2 bg-slate-200 dark:bg-dark mb-2 animate-pulse rounded-full w-[40%]' />
      <div className='h-2 bg-slate-200 dark:bg-dark mb-2 animate-pulse rounded-full w-[30%]' />
      <div className='h-2 bg-slate-200 dark:bg-dark mb-2 animate-pulse rounded-full w-[20%]' />
      <div className='h-2 bg-slate-200 dark:bg-dark mb-2 animate-pulse rounded-full w-[10%]' />
    </div>
  );
};

