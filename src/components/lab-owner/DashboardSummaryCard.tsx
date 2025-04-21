import React from "react";

interface DashboardSummaryCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: string; // e.g. '#F7B500'
}

const DashboardSummaryCard: React.FC<DashboardSummaryCardProps> = ({ icon, value, label, color }) => (
  <div
    className="flex flex-col items-center justify-center rounded-full px-6 py-4 shadow-md bg-white"
    style={{ borderRadius: 32, minWidth: 170, minHeight: 80, boxShadow: '0 2px 12px 0 #0000000a', border: `1px solid ${color}33` }}
  >
    <div className="flex items-center mb-1">
      <span style={{ background: color + '22', color, borderRadius: '50%', padding: 6, marginRight: 8, display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span className="font-bold text-xl" style={{ color }}>{value}</span>
    </div>
    <div className="text-xs text-gray-600 font-medium text-center">{label}</div>
  </div>
);

export default DashboardSummaryCard;
