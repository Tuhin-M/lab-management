import React from "react";

interface DashboardCircularProgressProps {
  percent: number;
  color: string;
}

const DashboardCircularProgress: React.FC<DashboardCircularProgressProps> = ({ percent, color }) => {
  const radius = 44;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <svg width={radius * 2} height={radius * 2}>
      <circle
        stroke="#E5E7EB"
        fill="none"
        strokeWidth={stroke}
        cx={radius}
        cy={radius}
        r={normalizedRadius}
      />
      <circle
        stroke={color}
        fill="none"
        strokeWidth={stroke}
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fontSize="1.5rem"
        fill="#222"
        fontWeight={700}
      >
        {percent}%
      </text>
    </svg>
  );
};

export default DashboardCircularProgress;
