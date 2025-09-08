import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const PrivacyMetrics = () => {
  const anonymityData = [
    { name: "Achieved", value: 5 },
    { name: "Remaining", value: 0 },
  ];

  const infoLossData = [
    { name: "Loss", value: 14.2 },
    { name: "Acceptable", value: 20 - 14.2 },
  ];

  const utilityData = [
    { name: "Score", value: 85.8 },
    { name: "Remaining", value: 100 - 85.8 },
  ];

  return (
    <div className="mb-6 rounded-md">
      <h3 className="text-base font-semibold mb-2">Privacy Metrics:</h3>
      <div className="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* K-Anonymity Gauge */}
        <div className="text-center">
          <h4 className="font-semibold mb-2 text-black">K-Anonymity Level</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={anonymityData} innerRadius={60} outerRadius={80} dataKey="value" startAngle={180} endAngle={0}>
                <Cell fill="#4ade80" />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="text-black font-bold">5 / Target 5</p>
        </div>

        {/* Information Loss */}
        <div className="text-center">
          <h4 className="font-semibold mb-2 text-black">Information Loss</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[{ name: "Loss", value: 14.2 }]}>
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[0, 20]} />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-black font-bold">14.2% (Acceptable &lt; 20%)</p>
        </div>

        {/* Data Utility Score */}
        <div className="text-center">
          <h4 className="font-semibold mb-2 text-black">Data Utility Score</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={utilityData} innerRadius={60} outerRadius={80} dataKey="value">
                <Cell fill="#60a5fa" />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="text-black font-bold">85.8% (Good &gt; 80%)</p>
        </div>

      </div>
    </div>
  );
};