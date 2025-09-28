import { Fragment, useState, useRef, useEffect } from "react";
import { IoSettings } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Adjust path as needed

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <Fragment>
      <div className="w-full h-[80px] bg-[#f1f2f6] rounded-xl shadow-md px-10 relative">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div>
            <Link to="/">
              <h2 className="text-2xl font-bold text-[#21808D] tracking-wide hover:scale-105 transition-transform duration-300">
                MIT Hospital
              </h2>
            </Link>
          </div>

          {/* Settings Icon with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div 
              className="p-3 rounded-full bg-[#3742fa1a] hover:bg-[#3742fa33] transition duration-300 cursor-pointer shadow-sm"
              onClick={handleSettingsClick}
            >
              <IoSettings size={22} className="text-[#21808D]" />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                {/* User Info */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition duration-150"
                >
                  <IoLogOutOutline className="mr-2" size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};