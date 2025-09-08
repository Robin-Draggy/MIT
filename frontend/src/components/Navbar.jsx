import { Fragment } from "react";
import { IoSettings } from "react-icons/io5";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <Fragment>
      <div className="w-full h-[80px] bg-[#f1f2f6] rounded-xl shadow-md px-10">
        {/* Use justify-between and items-center */}
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div>
            <Link to="/">
              <h2 className="text-2xl font-bold text-[#3742fa] tracking-wide hover:scale-105 transition-transform duration-300">
                MIT Hospital
              </h2>
            </Link>
          </div>

          {/* Settings Icon */}
          <div>
            <div className="p-3 rounded-full bg-[#3742fa1a] hover:bg-[#3742fa33] transition duration-300 cursor-pointer shadow-sm">
              <IoSettings size={22} className="text-[#3742fa]" />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};