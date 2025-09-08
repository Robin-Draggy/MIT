// src/components/RecentProjectsTable.jsx
import React from "react";
import { FaCheckCircle, FaSpinner, FaPauseCircle } from "react-icons/fa";

const statusMap = {
  Complete: <FaCheckCircle className="text-green-500" />,
  Processing: <FaSpinner className="animate-spin text-blue-500" />,
  Expired: <FaPauseCircle className="text-yellow-500" />,
};

const dummyProjects = [
  {
    name: "Sazzadur Rahman",
    status: "Complete",
    records: 80,
    lastModified: "2025-08-05",
  },
  {
    name: "Azizul Haque",
    status: "Processing",
    records: 5,
    lastModified: "2025-08-06",
  },
  {
    name: "Hania Amir",
    status: "Expired",
    records: 2,
    lastModified: "2025-08-01",
  },
];

export const RecentProjectsTable = () => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Project Name", "Status", "Records", "Last Modified"].map((head) => (
              <th
                key={head}
                className="px-6 py-3 text-left text-xs font-medium text-[#2f3542] uppercase tracking-wider"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {dummyProjects.map(({ name, status, records, lastModified }) => (
            <tr key={name} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap font-semibold">{name}</td>
              <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                {statusMap[status]}
                <span>{status}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{records}</td>
              <td className="px-6 py-4 whitespace-nowrap">{lastModified}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};