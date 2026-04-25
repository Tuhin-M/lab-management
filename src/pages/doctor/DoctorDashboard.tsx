import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorDashboardData } from "@/store/slices/doctorSlice";
import { RootState, AppDispatch } from "@/store";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Video,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/common/Loader";

const DoctorDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, prescriptions, stats, loading } = useSelector((state: RootState) => state.doctor);
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchDoctorDashboardData());
  }, [dispatch]);

  if (loading) return <Loader fullScreen text="Loading dashboard..." />;

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed').slice(0, 5);

  return (
    <div className="flex min-h-screen bg-slate-50/50 pt-20">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <DoctorSidebar />

      <main className="flex-1 p-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Welcome back, Dr. {user?.name || 'Doctor'}
              </h1>
              <p className="text-slate-500 mt-1">Here's your schedule for today.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl h-11">
                Download Report
              </Button>
              <Button 
                className="rounded-xl h-11 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                onClick={() => navigate('/doctor/prescription/new')}
              >
                New Consultation
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard 
              icon={<Calendar className="text-blue-500" />} 
              label="Today's Appts" 
              value={stats.totalAppointments} 
              trend="+12%" 
            />
            <StatsCard 
              icon={<Users className="text-primary" />} 
              label="New Patients" 
              value={stats.pendingAppointments} 
              trend="+5%" 
            />
            <StatsCard 
              icon={<CheckCircle2 className="text-green-500" />} 
              label="Completed" 
              value={stats.completedAppointments} 
              trend="+8%" 
            />
            <StatsCard 
              icon={<TrendingUp className="text-orange-500" />} 
              label="Total Revenue" 
              value={`₹${stats.totalRevenue}`} 
              trend="+15%" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Appointments */}
            <Card className="lg:col-span-2 border-slate-200/60 shadow-sm overflow-hidden rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-white/50 px-6 py-4">
                <CardTitle className="text-lg font-bold">Upcoming Appointments</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary font-bold">View All</Button>
              </CardHeader>
              <CardContent className="p-0">
                {upcomingAppointments.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {upcomingAppointments.map((appt) => (
                      <div key={appt.id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {appt.patient_name?.[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{appt.patient_name}</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock size={12} /> {appt.appointment_time}
                              </span>
                              <span className="flex items-center gap-1 lowercase">
                                <Video size={12} /> {appt.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 capitalize">
                            {appt.status}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="rounded-xl text-primary hover:bg-primary/10 flex items-center gap-2"
                            onClick={() => navigate(`/doctor/prescription/${appt.id}`)}
                          >
                            <FileText size={14} /> Prescribe
                          </Button>
                          <Button size="icon" variant="ghost" className="rounded-xl text-slate-400">
                            <MoreVertical size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-500 italic">No upcoming appointments found.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity / Quick Actions */}
            <div className="space-y-6">
              <Card className="border-slate-200/60 shadow-sm rounded-3xl overflow-hidden bg-primary text-white">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-lg">Quick Consultation</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Start a fast-track consultation for walk-in patients.
                  </p>
                  <Button 
                    className="w-full bg-white text-primary hover:bg-slate-50 font-bold rounded-xl h-11"
                    onClick={() => navigate('/doctor/prescription/new')}
                  >
                    Start Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Recent Prescriptions</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-4">
                    {prescriptions && prescriptions.length > 0 ? (
                      prescriptions.slice(0, 4).map((p) => (
                        <div key={p.id} className="flex items-center justify-between text-sm">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">{p.diagnosis || 'General Checkup'}</span>
                            <span className="text-xs text-slate-500">{new Date(p.created_at).toLocaleDateString()}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(`/doctor/prescription/${p.appointment_id}`)}>
                            <FileText size={14} className="text-primary" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No prescriptions generated yet.</p>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-6 rounded-xl text-xs h-10" onClick={() => navigate('/doctor/appointments')}>
                    View All Appointments
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend: string;
}

const StatsCard = ({ icon, label, value, trend }: StatsCardProps) => (
  <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl">
          {icon}
        </div>
        <Badge variant="secondary" className="bg-green-50 text-green-600 border-green-100 text-[10px]">
          {trend}
        </Badge>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

export default DoctorDashboard;
