import React from "react";

interface LegendItem {
  label: string;
  color: string;
}

interface DashboardLegendProps {
  items: LegendItem[];
}

const DashboardLegend: React.FC<DashboardLegendProps> = ({ items }) => (
  <div className="flex flex-col gap-2 mt-2">
    {items.map((item) => (
      <div key={item.label} className="flex items-center gap-2 text-xs">
        <span style={{ background: item.color, width: 12, height: 12, borderRadius: 4, display: 'inline-block' }} />
        <span>{item.label}</span>
      </div>
    ))}
  </div>
);

export default DashboardLegend;
