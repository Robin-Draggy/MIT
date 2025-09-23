import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export const AgeDistributionBar = ({ data }) => {
  const ageDist = Object.values(
    data.reduce((acc, rec) => {
      acc[rec.ageRaw] = acc[rec.ageRaw] || { age: rec.ageRaw, count: 0 };
      acc[rec.ageRaw].count++;
      return acc;
    }, {})
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Age Distribution (Released)</h2>
      <BarChart width={400} height={250} data={ageDist}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="age" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#60a5fa" />
      </BarChart>
    </div>
  );
};
