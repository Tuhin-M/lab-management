
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { labOwnerAPI } from "@/services/api";
import { toast } from "sonner";

interface Appointment {
  _id: string;
  patientName: string;
  testName: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  paymentStatus: "paid" | "pending";
  amount: number;
}

interface AppointmentsListProps {
  labId: string;
  appointments: Appointment[];
  onStatusChange: () => void;
}

const AppointmentsList = ({ 
  labId, 
  appointments,
  onStatusChange 
}: AppointmentsListProps) => {
  
  const handleStatusChange = async (appointmentId: string, status: string) => {
    try {
      await labOwnerAPI.updateAppointmentStatus(appointmentId, status);
      toast.success(`Appointment status updated to ${status}`);
      onStatusChange();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPaymentBadge = (status: string) => {
    return status === 'paid' 
      ? <Badge className="bg-green-100 text-green-800 border-green-300">Paid</Badge> 
      : <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
  };

  return (
    <div className="bg-white rounded-md shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Recent Appointments</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient Name</TableHead>
              <TableHead>Test</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.testName}</TableCell>
                  <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>₹{appointment.amount}</TableCell>
                  <TableCell>{getPaymentBadge(appointment.paymentStatus)}</TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={appointment.status}
                      onValueChange={(value) => handleStatusChange(appointment._id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {appointments.length > 0 && (
        <div className="flex justify-end p-4 border-t">
          <Button variant="outline" size="sm">View All</Button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
