
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar, Beaker, DollarSign } from "lucide-react";

interface LabOverviewCardProps {
  totalLabs: number;
  totalAppointments: number;
  totalTests: number;
  totalRevenue: number;
}

const LabOverviewCard = ({
  totalLabs,
  totalAppointments,
  totalTests,
  totalRevenue
}: LabOverviewCardProps) => {
  const cards = [
    {
      title: "Total Labs",
      value: totalLabs,
      icon: Building,
      color: "text-blue-500 bg-blue-100",
    },
    {
      title: "Appointments",
      value: totalAppointments,
      icon: Calendar,
      color: "text-green-500 bg-green-100",
    },
    {
      title: "Tests Conducted",
      value: totalTests,
      icon: Beaker,
      color: "text-purple-500 bg-purple-100",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-amber-500 bg-amber-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`rounded-full p-2 ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LabOverviewCard;
