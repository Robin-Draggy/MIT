import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const DashboardLayout = () => {

  return (
    <Fragment>
      <div className='w-full overflow-hidden min-h-screen p-4 space-y-4'>
        <div className='w-full'>
          <Navbar />
        </div>
        <div className='w-full'>
          {/* Main content */}
          <div className='f'>
            <div className="w-full rounded-xl bg-[#f1f2f6]">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};