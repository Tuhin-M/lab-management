import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Phone, Home, Building2, Search, X } from "lucide-react";
import { labOwnerAPI } from "@/services/api";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Appointment {
  _id: string;
  patientName: string;
  phone?: string;
  homeCollection?: boolean;
  testName: string;
  date: string;
  time: string;
  status: "scheduled" | "sample_collected" | "in_progress" | "completed" | "cancelled" | string;
  paymentStatus: "paid" | "pending" | string;
  amount: number;
}

interface AppointmentsListProps {
  labId: string;
  appointments: Appointment[];
  onStatusChange: () => void;
  onSearch?: (query: string) => void;
  onFilter?: (filter: { status?: string; date?: string }) => void;
}

const AppointmentsList = ({ 
  labId, 
  appointments,
  onStatusChange,
  onSearch,
  onFilter
}: AppointmentsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (appointmentId: string, status: string) => {
    try {
      setUpdatingId(appointmentId);
      await labOwnerAPI.updateAppointmentStatus(appointmentId, status);
      toast.success(`Order status updated to "${status.replace('_', ' ')}"`);
      onStatusChange();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled':
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">Scheduled</Badge>;
      case 'sample_collected':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-semibold">Sample Collected</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-semibold">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-semibold">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{status.replace('_', ' ')}</Badge>;
    }
  };
  
  const getPaymentBadge = (status: string) => {
    return status === 'paid' 
      ? <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-medium">Paid</Badge> 
      : <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-medium">Pending</Badge>;
  };

  // Client-side filtering for immediate snappy responsiveness
  const filteredAppointments = appointments.filter((apt) => {
    // Search query matches patient, phone, or test
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesPatient = apt.patientName.toLowerCase().includes(q);
      const matchesPhone = apt.phone?.toLowerCase().includes(q);
      const matchesTest = apt.testName.toLowerCase().includes(q);
      if (!matchesPatient && !matchesPhone && !matchesTest) return false;
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "scheduled" && (apt.status === "scheduled" || apt.status === "confirmed")) {
        // match
      } else if (apt.status !== statusFilter) {
        return false;
      }
    }

    // Date filter
    if (selectedDate) {
      const aptDate = new Date(apt.date).toISOString().split('T')[0];
      const filterDateStr = format(selectedDate, "yyyy-MM-dd");
      if (aptDate !== filterDateStr) return false;
    }

    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Patient Appointments & Orders</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {filteredAppointments.length} {filteredAppointments.length === 1 ? 'order' : 'orders'} found
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search patient, test, phone..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="pl-9 h-9 text-xs rounded-xl bg-white border-slate-200"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status selector */}
          <Select 
            value={statusFilter} 
            onValueChange={(value) => {
              setStatusFilter(value);
              onFilter?.({ status: value });
            }}
          >
            <SelectTrigger className="w-[140px] h-9 text-xs rounded-xl bg-white border-slate-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="sample_collected">Sample Collected</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`h-9 text-xs rounded-xl border-slate-200 bg-white ${selectedDate ? 'text-primary border-primary/50' : 'text-slate-600'}`}
              >
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                <span>{selectedDate ? format(selectedDate, "dd MMM yyyy") : "Date"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar 
                mode="single" 
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  onFilter?.({ date: date?.toISOString() });
                }}
              />
              {selectedDate && (
                <div className="p-2 border-t text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs w-full text-slate-600"
                    onClick={() => setSelectedDate(undefined)}
                  >
                    Clear Date Filter
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="text-xs font-bold text-slate-700 py-3.5">Patient Details</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 py-3.5">Prescribed Tests</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 py-3.5">Schedule</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 py-3.5">Mode</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 py-3.5">Amount</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 py-3.5">Payment</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 py-3.5">Status</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 py-3.5 text-right">Update Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                  <p className="font-semibold text-sm">No appointments matching current filters</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting search or date filters</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-3.5">
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">{appointment.patientName}</span>
                      {appointment.phone && (
                        <span className="text-xs text-slate-500 inline-flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {appointment.phone}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-medium text-slate-800 text-sm max-w-[220px] block truncate" title={appointment.testName}>
                      {appointment.testName}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="text-xs">
                      <span className="font-semibold text-slate-800 block">
                        {new Date(appointment.date).toLocaleDateString(undefined, { dateStyle: "medium" })}
                      </span>
                      <span className="text-slate-500 font-mono mt-0.5 block">{appointment.time || "Regular hours"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    {appointment.homeCollection ? (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[11px] gap-1">
                        <Home className="w-3 h-3" /> Home Visit
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[11px] gap-1">
                        <Building2 className="w-3 h-3" /> Lab Center
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 font-bold text-slate-900 text-sm">
                    ₹{appointment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {getPaymentBadge(appointment.paymentStatus)}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {getStatusBadge(appointment.status)}
                  </TableCell>
                  <TableCell className="py-3.5 text-right">
                    <Select 
                      disabled={updatingId === appointment._id}
                      defaultValue={appointment.status === "confirmed" ? "scheduled" : appointment.status}
                      onValueChange={(value) => handleStatusChange(appointment._id, value)}
                    >
                      <SelectTrigger className="w-[145px] h-8 text-xs font-semibold rounded-lg bg-white border-slate-200 ml-auto">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="sample_collected">Sample Collected</SelectItem>
                        <SelectItem value="in_progress">Testing in Progress</SelectItem>
                        <SelectItem value="completed">Completed / Ready</SelectItem>
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
    </div>
  );
};

export default AppointmentsList;
export type { Appointment };
