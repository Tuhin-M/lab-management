import React, { ReactNode } from "react";
import { TestTube2, Building2, DollarSign } from 'lucide-react';
import { Calendar } from 'react-feather';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LabOverviewCardProps {
  totalLabs: number;
  totalAppointments: number;
  totalTests: number;
  totalRevenue: number;
}

interface OverviewCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: string;
  className?: string;
}

const LabOverviewCard = ({
  totalLabs,
  totalAppointments,
  totalTests,
  totalRevenue
}: LabOverviewCardProps) => {
  const isPositive = totalRevenue > 0;
  
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50">
          <Building2 className="h-6 w-6 text-blue-500" />
        </div>
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : '-'}{totalRevenue}%
        </span>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">Total Labs</h3>
        <p className="mt-1 text-2xl font-semibold">{totalLabs}</p>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">Appointments</h3>
        <p className="mt-1 text-2xl font-semibold">{totalAppointments}</p>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">Tests Conducted</h3>
        <p className="mt-1 text-2xl font-semibold">{totalTests}</p>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
        <p className="mt-1 text-2xl font-semibold">₹{totalRevenue.toLocaleString()}</p>
      </div>
    </div>
  );
};

const OverviewCard = ({
  title,
  value,
  icon,
  change = '+0%',
  className
}: OverviewCardProps) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50">
          {icon}
        </div>
        <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

const cards = [
  {
    title: "Total Labs",
    value: 10,
    icon: <Building2 className="h-6 w-6 text-blue-500" />,
    change: "+0%",
    className: "bg-blue-100"
  },
  {
    title: "Appointments",
    value: 20,
    icon: <Calendar className="h-6 w-6 text-green-500" />,
    change: "+0%",
    className: "bg-green-100"
  },
  {
    title: "Tests Conducted",
    value: 30,
    icon: <TestTube2 className="h-6 w-6 text-purple-500" />,
    change: "+0%",
    className: "bg-purple-100"
  },
  {
    title: "Total Revenue",
    value: 40000,
    icon: <DollarSign className="h-6 w-6 text-amber-500" />,
    change: "+0%",
    className: "bg-amber-100"
  },
];

export default LabOverviewCard;
