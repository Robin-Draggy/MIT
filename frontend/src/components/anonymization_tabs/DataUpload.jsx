import { useState } from "react";
import DataTable from "react-data-table-component";
import { uploadDataset } from "../../api"; // ✅ import function

export const DataUpload = ({ setDatasetId, setRows, setColumns, columns, rows, goToDataUpload }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file!");

    try {
      setLoading(true);
      const res = await uploadDataset(file); 

      setDatasetId(res.data.datasetId);
      setRows(res.data.rows || []);
      setColumns(res.data.columns || []);
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-gray-400 rounded-lg bg-green-100 cursor-pointer hover:bg-green-200 transition mb-4"
      >
        <p className="text-gray-700 text-lg text-center px-4">
          Drag and drop your CSV file here <br /> or click to browse
        </p>
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {file && (
        <div className="text-sm text-gray-700 mb-4 space-y-1">
          <p>
            <span className="font-semibold">File Name:</span> {file.name}
          </p>
          <p>
            <span className="font-semibold">File Size:</span>{" "}
            {(file.size / 1024).toFixed(2)} KB
          </p>
          <p>
            <span className="font-semibold">File Type:</span>{" "}
            {file.type || "CSV"}
          </p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="mt-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* Preview Table */}
      {rows && rows.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">📊 Preview</h2>
          <DataTable
            columns={
              Array.isArray(columns) && columns.length
                ? columns.map((c) => ({
                    name: c.name,
                    selector: (r) => r[c.name],
                  }))
                : []
            }
            data={rows}
            pagination
            paginationPerPage={10}
            highlightOnHover
            dense
          />
          <div>
            <button onClick={goToDataUpload} className="px-3 py-1 cursor-pointer bg-blue-700 font-semibold text-white rounded-lg">Let's Configure it</button>
          </div>
        </div>
      )}
    </div>
  );
};
