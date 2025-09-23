import { Tab } from "@headlessui/react";
import { useState } from "react";
import { OverviewTab } from "../../components/overview-tab/Overview.tab";
import { DataUpload } from "../../components/data-upload/DataUpload";
import { ConfigureTab } from "../../components/anonymization/ConfigureTab";
import { exportResults } from "../../api";

export const AnnonymizationResults = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 🔹 Global state for the flow
  const [datasetId, setDatasetId] = useState(null);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [results, setResults] = useState(null);

  return (
    <div className="w-full px-4 py-6">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        {/* Tabs */}
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1">
          {["Overview", "Data Upload", "Configure", "Results"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                 focus:outline-none focus:ring-2 ring-offset-2 
                 ring-offset-gray-200 ring-white ring-opacity-60 ${
                   selected
                     ? "bg-white shadow text-blue-600"
                     : "text-gray-600 hover:bg-white/[0.5] hover:text-blue-600"
                 }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        {/* Panels */}
        <Tab.Panels className="mt-4">
          {/* Overview */}
          <Tab.Panel className="rounded-xl p-6 shadow">
            <OverviewTab goToDataUpload={() => setSelectedIndex(1)} />
          </Tab.Panel>

          {/* Data Upload */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <DataUpload
              setDatasetId={setDatasetId}
              setColumns={setColumns}
              setRows={setRows}
              goToConfigure={() => setSelectedIndex(2)}
            />
          </Tab.Panel>

          {/* Configure */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <ConfigureTab
              datasetId={datasetId}
              setResults={setResults}
              goToResults={() => setSelectedIndex(3)}
            />
          </Tab.Panel>

          {/* Results */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Results</h2>

            {results ? (
              <div className="mt-4">
                <p className="text-gray-700">
                  <strong>Total:</strong> {results.counts.total} |{" "}
                  <strong>Released:</strong> {results.counts.released} |{" "}
                  <strong>Suppressed:</strong> {results.counts.suppressed}
                </p>

                <button
                  onClick={() => exportResults(datasetId)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                  Download Anonymized CSV
                </button>
              </div>
            ) : (
              <p className="mt-2 text-gray-600">
                Run anonymization in the Configure tab to see results here.
              </p>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
