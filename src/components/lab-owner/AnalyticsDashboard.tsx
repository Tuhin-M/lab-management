import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AnalyticsDashboard = () => {
  const data = [
    { name: 'Mon', tests: 23, revenue: 4500 },
    { name: 'Tue', tests: 19, revenue: 3800 },
    { name: 'Wed', tests: 27, revenue: 5200 },
    { name: 'Thu', tests: 31, revenue: 6100 },
    { name: 'Fri', tests: 25, revenue: 4900 },
    { name: 'Sat', tests: 18, revenue: 3500 },
    { name: 'Sun', tests: 8, revenue: 1500 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">Weekly Analytics</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="tests" fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
