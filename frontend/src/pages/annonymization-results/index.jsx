import { Tab } from "@headlessui/react";
import { useState } from "react";
import { OverviewTab } from "../../components/overview-tab/Overview.tab";

export const AnnonymizationResults = () => {
  const [selectedIndex, setSelectedIndex] = useState(0); // 0 = Overview tab

  return (
    <div className="w-full px-4 py-6">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        {/* Tabs */}
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1">
          {["Overview", "Data Upload", "Configure", "Results"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-200 ring-white ring-opacity-60 ${
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
            {/* Pass setSelectedIndex down so OverviewTab can change tabs */}
            <OverviewTab goToDataUpload={() => setSelectedIndex(1)} />
          </Tab.Panel>

          {/* Data Upload */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Data Upload</h2>
            <p className="mt-2 text-gray-600">
              Upload your dataset here for anonymization.
            </p>
          </Tab.Panel>

          {/* Configure */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Configure</h2>
            <p className="mt-2 text-gray-600">
              Set anonymization parameters, choose techniques, and configure
              settings here.
            </p>
          </Tab.Panel>

          {/* Results */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">Results</h2>
            <p className="mt-2 text-gray-600">
              View anonymization results, download processed data, or review
              reports here.
            </p>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
