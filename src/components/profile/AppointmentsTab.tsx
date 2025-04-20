
import React from "react";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

// Demo appointment data
const appointments = [
  {
    id: 1,
    type: "Lab Test",
    name: "Complete Blood Count (CBC)",
    date: "2023-06-15",
    time: "10:30 AM",
    status: "Completed",
    lab: "HealthPlus Diagnostics"
  },
  {
    id: 2,
    type: "Doctor",
    name: "Dr. Rahul Sharma - Cardiologist",
    date: "2023-07-22",
    time: "4:00 PM",
    status: "Upcoming",
    location: "Apollo Hospital"
  },
  {
    id: 3,
    type: "Lab Test",
    name: "Lipid Profile",
    date: "2023-08-10",
    time: "9:00 AM",
    status: "Scheduled",
    lab: "Metropolis Labs"
  }
];

const AppointmentsTab = () => {
  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="p-4 hover:bg-accent/50 transition-colors">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">{appointment.type}</div>
              <div className="font-medium">{appointment.name}</div>
              <div className="text-sm mt-1">
                {appointment.type === "Lab Test" ? appointment.lab : appointment.location}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1 text-sm">
                <Calendar className="h-3 w-3" />
                <span>{new Date(appointment.date).toLocaleDateString()}</span>
              </div>
              <div className="text-sm">{appointment.time}</div>
              <span className={`inline-flex px-2 py-1 mt-1 text-xs rounded-full ${
                appointment.status === "Completed" 
                  ? "bg-green-100 text-green-800" 
                  : appointment.status === "Upcoming" 
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {appointment.status}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentsTab;
