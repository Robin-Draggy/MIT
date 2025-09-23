import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export const ReleasedSuppressedPie = ({ stats }) => {
  const data = [
    { name: "Released", value: stats.released },
    { name: "Suppressed", value: stats.suppressed },
  ];
  const COLORS = ["#4ade80", "#f87171"];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Released vs Suppressed</h2>
      <PieChart width={350} height={250}>
        <Pie data={data} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};
