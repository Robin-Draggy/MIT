import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export const NotFound = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-[6rem] font-bold text-[#3742fa] leading-none">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
        Oops! Page not found
      </h2>
      <p className="text-center text-gray-500 max-w-md mb-6">
        The page you're looking for doesn't exist or has been moved. Please check the URL or return to the dashboard.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-white bg-[#3742fa] hover:bg-[#2f35c3] px-6 py-3 rounded-lg transition-all"
      >
        <FaArrowLeft size={18} />
        Back to Dashboard
      </Link>
    </div>
  );
};