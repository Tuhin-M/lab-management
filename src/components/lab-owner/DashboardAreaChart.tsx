import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardAreaChartProps {
  data: any[];
  color?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 8, fontSize: 13, boxShadow: '0 2px 8px #0001' }}>
        <div><b>{label}</b></div>
        <div>Avg Score: <b>{payload[0].value}</b></div>
      </div>
    );
  }
  return null;
};

const DashboardAreaChart: React.FC<DashboardAreaChartProps> = ({ data, color = '#1FC37E' }) => (
  <ResponsiveContainer width="100%" height={200}>
    <AreaChart data={data} margin={{ top: 18, right: 24, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F2F2" />
      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} domain={[0, 100]} />
      <Tooltip content={<CustomTooltip />} />
      <Area
        type="monotone"
        dataKey="score"
        stroke={color}
        fillOpacity={1}
        fill="url(#colorScore)"
        strokeWidth={3}
        dot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 2 }}
        activeDot={{ r: 6 }}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default DashboardAreaChart;
