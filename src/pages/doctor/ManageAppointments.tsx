import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorDashboardData, updateAppointmentStatus } from "@/store/slices/doctorSlice";
import { RootState, AppDispatch } from "@/store";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Check, 
  X, 
  Clock,
  Calendar as CalendarIcon,
  Video,
  ExternalLink,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/common/Loader";
import { toast } from "sonner";

const ManageAppointments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, loading } = useSelector((state: RootState) => state.doctor);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchDoctorDashboardData());
  }, [dispatch]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await dispatch(updateAppointmentStatus({ id, status })).unwrap();
      toast.success(`Appointment marked as ${status}`);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch = appt.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || appt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading && appointments.length === 0) return <Loader fullScreen text="Loading appointments..." />;

  return (
    <div className="flex min-h-screen bg-slate-50/50 pt-20">
      <DoctorSidebar />

      <main className="flex-1 p-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Appointments</h1>
              <p className="text-slate-500 mt-1">View and handle your consultation schedule.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search patient..." 
                  className="pl-10 h-11 w-64 rounded-xl border-slate-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl h-11 gap-2">
                <Filter size={18} />
                Filters
              </Button>
            </div>
          </div>

          <Card className="border-slate-200/60 shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-sm font-semibold">
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-slate-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                                {appt.patient_name[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{appt.patient_name}</div>
                                <div className="text-xs text-slate-500">{appt.patient_phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">
                              {new Date(appt.appointment_date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock size={12} /> {appt.appointment_time}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="capitalize text-[10px] font-bold tracking-wider">
                              {appt.type === 'video' ? <Video size={12} className="mr-1 inline" /> : null}
                              {appt.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={appt.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">₹{appt.amount}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {appt.status === 'confirmed' && (
                                <>
                                  <Button 
                                    size="icon" 
                                    className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border-none shadow-none"
                                    onClick={() => navigate(`/doctor/prescription/${appt.id}`)}
                                    title="Create Prescription"
                                  >
                                    <FileText size={16} />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    className="h-8 w-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 border-none shadow-none"
                                    onClick={() => handleStatusUpdate(appt.id, 'completed')}
                                    title="Mark Completed"
                                  >
                                    <Check size={16} />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    className="h-8 w-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
                                    onClick={() => handleStatusUpdate(appt.id, 'cancelled')}
                                    title="Cancel"
                                  >
                                    <X size={16} />
                                  </Button>
                                </>
                              )}
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400">
                                <ExternalLink size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-slate-500 italic">
                          No appointments found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    confirmed: "bg-blue-50 text-blue-600 border-blue-100",
    completed: "bg-green-50 text-green-600 border-green-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <Badge variant="outline" className={cn("capitalize px-2 py-0.5 rounded-full font-bold", styles[status] || styles.pending)}>
      {status}
    </Badge>
  );
};

// Simplified cn for this component since I don't want to import logic
const cn = (...args: any[]) => args.filter(Boolean).join(' ');

export default ManageAppointments;
