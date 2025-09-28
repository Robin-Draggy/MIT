import { Tab } from "@headlessui/react";
import { useState } from "react";
import { OverviewTab } from "../../components/overview-tab/Overview.tab";
import { DataUpload } from "../../components/data-upload/DataUpload";
import { ConfigureTab } from "../../components/anonymization/ConfigureTab";
import { exportResults } from "../../api";
import { ResultsTab } from "../../components/anonymization/ResultTab";

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
        <Tab.List className="flex space-x-1 rounded-xl bg-white p-2">
          {["Overview", "Data Upload", "Configure", "Results"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                 focus:outline-none focus:ring-2 ring-offset-2 
                 ring-offset-gray-200 ring-white ring-opacity-60 cursor-pointer ${
                   selected
                     ? "bg-[#21808D] shadow text-white"
                     : "text-gray-600 hover:bg-[#21808D] hover:text-white"
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
              columns={columns}
              rows={rows}
              goToConfigure={() => setSelectedIndex(2)}
            />
          </Tab.Panel>

          {/* Configure */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <ConfigureTab
              datasetId={datasetId}
              columns={columns}
              goToResults={() => setSelectedIndex(3)}
            />
          </Tab.Panel>

          {/* Results */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <ResultsTab datasetId={datasetId} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
