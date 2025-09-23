// src/components/anonymization/ResultsTab.jsx
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { exportResults, getResults } from "../../api";

export const ResultsTab = ({ datasetId }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch anonymization results
  const fetchResults = async () => {
    if (!datasetId) return;
    try {
      setLoading(true);
      const res = await getResults(datasetId);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [datasetId]);

  // Export CSV
  const handleExport = async () => {
    if (!results) return;
    try {
      const res = await exportResults(datasetId, "_blank");
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${results.name || "anonymized"}-data.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (!results) return <p>Loading anonymization results...</p>;

  const { counts, config, data } = results;

  // ---- Compute Metrics ----
  const groupRows = (rows, selectedQIs) => {
    const map = new Map();
    for (const row of rows) {
      const key = selectedQIs.map(q => row[q] ?? "Unknown").join("__");
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    }
    return map;
  };

  const eqGroups = groupRows(data, config.selectedQIs || []);
  const recordsPreserved = data.length;
  const avgClassSize = eqGroups.size > 0 ? (recordsPreserved / eqGroups.size).toFixed(2) : 0;
  const kAnonymityPassed = Math.min(...Array.from(eqGroups.values()).map(g => g.length)) >= config.k;

  // Table columns
  const tableColumns =
    data && data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          name: key,
          selector: (row) => row[key],
          sortable: true,
        }))
      : [];

  // Equivalence class bar chart data
  const eqClassData = Array.from(eqGroups.values()).map((g, idx) => ({
    name: `Class ${idx + 1}`,
    size: g.length,
  }));

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4 flex flex-col">
          <span className="text-gray-500">Information Loss</span>
          <span className="text-2xl font-bold">{(counts?.infoLoss * 100)?.toFixed(2) || 0}%</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col">
          <span className="text-gray-500">Suppression Rate</span>
          <span className="text-2xl font-bold">{(counts?.suppressionRate * 100)?.toFixed(2) || 0}%</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col">
          <span className="text-gray-500">Equivalence Classes</span>
          <span className="text-2xl font-bold">{eqGroups.size || 0}</span>
        </div>
      </div>

      {/* Equivalence Class Distribution Chart */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Equivalence Class Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eqClassData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="size" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Privacy Analysis */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Privacy Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <span className="text-gray-500">K-Anonymity Status</span>
            <div>{kAnonymityPassed ? "Passed" : "Failed"}</div>
          </div>
          <div>
            <span className="text-gray-500">Privacy Level</span>
            <div>{config.k}</div>
          </div>
          <div>
            <span className="text-gray-500">Records Preserved</span>
            <div>{recordsPreserved}</div>
          </div>
          <div>
            <span className="text-gray-500">Average Class Size</span>
            <div>{avgClassSize}</div>
          </div>
        </div>
      </div>

      {/* Anonymized Data Table */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Anonymized Data</h3>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Export CSV
          </button>
        </div>
        <DataTable
          columns={tableColumns}
          data={data}
          pagination
          paginationPerPage={10}
          highlightOnHover
          dense
        />
      </div>
    </div>
  );
};
