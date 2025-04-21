import React from "react";

interface DashboardRevenueBarProps {
  collectedPercent: number; // e.g. 67
  pendingPercent: number;   // e.g. 33
  collectedColor?: string;
  pendingColor?: string;
}

const DashboardRevenueBar: React.FC<DashboardRevenueBarProps> = ({ collectedPercent, pendingPercent, collectedColor = '#1FC37E', pendingColor = '#F7B500' }) => (
  <div className="w-full">
    <div className="flex w-full h-6 rounded-full overflow-hidden shadow-sm">
      <div style={{ width: `${collectedPercent}%`, background: collectedColor }} className="h-full"></div>
      <div style={{ width: `${pendingPercent}%`, background: pendingColor }} className="h-full"></div>
    </div>
    <div className="flex justify-between mt-2 text-xs font-medium">
      <span style={{ color: collectedColor }}>Revenue Collected</span>
      <span style={{ color: pendingColor }}>Revenue Pending</span>
    </div>
  </div>
);

export default DashboardRevenueBar;
