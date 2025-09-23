// src/components/anonymization/ConfigureTab.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export const ConfigureTab = ({
  datasetId,
  columns = [],
  goToResults, // optional function to switch to Results tab
}) => {
  const [kValue, setKValue] = useState(3);
  const [selectedQIs, setSelectedQIs] = useState([]);
  const [requireLDiversity, setRequireLDiversity] = useState(false);
  const [lValue, setLValue] = useState(2);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Reset QIs selection if columns change
    setSelectedQIs([]);
  }, [columns]);

  const handleRunAnonymization = async () => {
    if (!datasetId) return alert("No dataset selected!");
    if (selectedQIs.length === 0)
      return alert("Please select at least one quasi-identifier!");

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:3000/api/datasets/${datasetId}/run`,
        {
          k: kValue,
          selectedQIs,
          requireLDiversity,
          l: lValue,
        }
      );

      setMetrics(res.data.counts);
      alert("Anonymization complete! Check Results tab.");

      if (goToResults) goToResults(); // optionally switch to Results tab
    } catch (err) {
      console.error(err);
      alert("Failed to run anonymization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow flex flex-col space-y-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">Configure Anonymization</h2>

      {/* K-value */}
      <div>
        <label className="block font-medium mb-1">k-value</label>
        <input
          type="number"
          min={2}
          value={kValue}
          onChange={(e) => setKValue(Number(e.target.value))}
          className="border rounded px-3 py-1 w-24"
        />
      </div>

      {/* Quasi-identifiers */}
      <div>
        <label className="block font-medium mb-1">Select Quasi-Identifiers</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {columns.map((col) => (
            <label key={col.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedQIs.includes(col.name)}
                onChange={() => {
                  if (selectedQIs.includes(col.name)) {
                    setSelectedQIs(selectedQIs.filter((c) => c !== col.name));
                  } else {
                    setSelectedQIs([...selectedQIs, col.name]);
                  }
                }}
              />
              <span>{col.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* L-diversity */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={requireLDiversity}
          onChange={(e) => setRequireLDiversity(e.target.checked)}
        />
        <span>Require L-diversity</span>
        {requireLDiversity && (
          <input
            type="number"
            min={2}
            value={lValue}
            onChange={(e) => setLValue(Number(e.target.value))}
            className="border rounded px-2 py-1 w-20"
          />
        )}
      </div>

      {/* Run Anonymization */}
      <button
        onClick={handleRunAnonymization}
        disabled={loading || selectedQIs.length === 0 || !datasetId}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Running..." : "Run Anonymization"}
      </button>

      {/* Metrics */}
      {metrics && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <p>Total Rows: {metrics.total}</p>
          <p>Released: {metrics.released}</p>
          <p>Suppressed: {metrics.suppressed}</p>
        </div>
      )}
    </div>
  );
};
