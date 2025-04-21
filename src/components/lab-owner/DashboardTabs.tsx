import React from "react";

interface DashboardTabsProps {
  value: string;
  onChange: (val: string) => void;
  options?: string[];
}

const defaultOptions = ["D", "W", "M", "Y", "Custom Time"];

const DashboardTabs: React.FC<DashboardTabsProps> = ({ value, onChange, options = defaultOptions }) => (
  <div className="flex items-center gap-2 mt-2 mb-4">
    {options.map((opt) => (
      <button
        key={opt}
        className={`px-3 py-1 rounded-md font-medium text-sm border transition-colors duration-150 ${
          value === opt
            ? "bg-[#F5F7FA] border-[#1FC37E] text-[#1FC37E]"
            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
        }`}
        style={{ minWidth: 38 }}
        onClick={() => onChange(opt)}
      >
        {opt}
      </button>
    ))}
  </div>
);

export default DashboardTabs;
