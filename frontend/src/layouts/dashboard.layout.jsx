import { Fragment, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Fragment>
      <div className='w-full min-h-screen p-4 space-y-4'>
        <div className='w-full'>
          <Navbar />
        </div>
        <div className='w-full flex gap-1'>
          {/* Sidebar container */}
          <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

          {/* Main content */}
          <div className='flex-1 pl-4'>
            <div className="w-full rounded-xl bg-[#f1f2f6]">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};