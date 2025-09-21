import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';
import { GrDocumentConfig } from 'react-icons/gr';
import { MdPeopleAlt } from "react-icons/md";
import { FaFileLines } from 'react-icons/fa6';
import { IoLogOut } from 'react-icons/io5';
import { IoMdLogIn } from 'react-icons/io';

export const Sidebar = ({ collapsed, toggleSidebar }) => {
  const { pathname } = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FaHome /> },
    {
      name: 'configure annonymization',
      path: '/configure-annonymization',
      icon: <GrDocumentConfig />,
    },
    {
      name: 'annonymization results',
      path: '/annonymization-results',
      icon: <GrDocumentConfig />,
    },
    {
      name: 'patients',
      path: '/patients',
      icon: <MdPeopleAlt />,
    },
    {
      name: 'Logout',
      path: '/logout',
      icon: <IoLogOut />
    }
  ];

  return (
    <aside
      className={`bg-[#f1f2f6] shadow-md rounded-xl min-h-[calc(100vh-100px)] p-4 text-left
        transition-all duration-500 ease-in-out
        ${collapsed ? 'w-[70px]' : 'w-72'}
      `}
    >
      {/* Top toggle icon */}
      <div className='flex items-center justify-end mb-8 mr-2'>
        {collapsed ? (
          <FaBars
            className='text-[#2f3542] cursor-pointer text-xl'
            onClick={toggleSidebar}
          />
        ) : (
          <FaTimes
            className='text-[#2f3542] cursor-pointer text-xl'
            onClick={toggleSidebar}
          />
        )}
      </div>

      {/* Nav Items */}
      <nav className='flex flex-col gap-4'>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-2 rounded-md overflow-hidden transform transition-transform duration-300 ${
              pathname === item.path
                ? 'bg-blue-100 text-[#3742fa] font-semibold'
                : 'text-[#2f3542] hover:text-[#3742fa] hover:bg-blue-100 hover:scale-105'
            }`}
          >
            <span className='min-w-[24px] text-[18px] flex justify-center items-center'>
              {item.icon}
            </span>

            <span
              className={`ml-4 inline-block capitalize transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap ${
                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}
              style={{
                transitionProperty: 'width, opacity',
                maxWidth: collapsed ? 0 : 200,
              }}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};