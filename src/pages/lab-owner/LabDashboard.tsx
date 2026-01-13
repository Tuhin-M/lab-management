import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData, deleteLab, addLab } from "@/store/slices/labSlice";
import { RootState, AppDispatch } from "@/store";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  Bell,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  CreditCard,
  Package,
  BarChart3,
  Settings,
  ClipboardList,
  LifeBuoy,
  LayoutDashboard, // Added from instruction
  FlaskConical, // Added from instruction
  User // Added from instruction
} from "lucide-react";

import Sidebar from "@/components/lab-owner/Sidebar";
import LabsList from "@/components/lab-owner/LabsList";
import { LabOnboardingModal } from "@/components/lab-owner/LabOnboardingModal";
import type { LabCreateRequest } from "@/components/lab-owner/LabOnboardingModal";
import TeamManagement from "@/components/lab-owner/TeamManagement";
import { AppointmentCalendar } from "@/components/lab-owner/AppointmentCalendar";
import BillingDashboard from "@/components/lab-owner/BillingDashboard"; // Added

// Common Components
import { Button } from "@/components/common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Loader } from "@/components/common/Loader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Lab Owner Components
import DashboardSummaryCard from "@/components/lab-owner/DashboardSummaryCard";
import DashboardTabs from "@/components/lab-owner/DashboardTabs";
import DashboardCircularProgress from "@/components/lab-owner/DashboardCircularProgress";
import DashboardLegend from "@/components/lab-owner/DashboardLegend";
import DashboardRevenueBar from "@/components/lab-owner/DashboardRevenueBar";
import DashboardAreaChart from "@/components/lab-owner/DashboardAreaChart";

const LabDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux State
  const { labs, stats, loading, error } = useSelector((state: RootState) => state.labs);
  const { role, user } = useSelector((state: RootState) => state.auth);

  // Local UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<'D' | 'W' | 'M' | 'Y'>('M');
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [newLabData, setNewLabData] = useState<LabCreateRequest>({
    name: '',
    type: 'Diagnostic',
    description: '',
    establishedDate: '',
    registrationNumber: '',
    email: '',
    phone: '',
    emergencyContact: '',
    website: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    facilities: [],
    certifications: [],
    workingHours: {
      weekdays: { open: '09:00', close: '18:00' },
      weekends: { open: '10:00', close: '14:00' },
      holidays: { open: '', close: '' }
    },
    staff: {
      pathologists: 0,
      technicians: 0,
      receptionists: 0
    },
    services: []
  });

  // Initial Data Fetch
  useEffect(() => {
    if (role !== 'lab_owner') {
      toast.error('Access denied. Only lab owners can access this page.');
      navigate('/login');
      return;
    }
    dispatch(fetchDashboardData());
  }, [dispatch, role, navigate]);

  // Handle Errors from Redux
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleAddLabSubmit = async () => {
    const apiData = {
      name: newLabData.name,
      description: newLabData.description,
      establishedDate: newLabData.establishedDate,
      registrationNumber: newLabData.registrationNumber,
      address: {
        street: newLabData.street,
        city: newLabData.city,
        state: newLabData.state,
        zipCode: newLabData.zipCode,
        country: 'India',
        landmark: newLabData.landmark
      },
      contact: {
        email: newLabData.email,
        phone: newLabData.phone,
        emergencyContact: newLabData.emergencyContact,
        website: newLabData.website
      },
      facilities: newLabData.facilities,
      certifications: newLabData.certifications,
      workingHours: {
        weekdays: `${newLabData.workingHours.weekdays.open} - ${newLabData.workingHours.weekdays.close}`,
        weekends: `${newLabData.workingHours.weekends.open} - ${newLabData.workingHours.weekends.close}`,
        holidays: newLabData.workingHours.holidays.open ? `${newLabData.workingHours.holidays.open} - ${newLabData.workingHours.holidays.close}` : 'Closed'
      },
      staff: newLabData.staff,
      services: newLabData.services
    };

    try {
      await dispatch(addLab(apiData)).unwrap();
      setShowAddLabModal(false);
      toast.success("Lab added successfully");
    } catch (err: any) {
      // Error handled by useEffect or rejectedWithValue
    }
  };

  const handleDeleteLab = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lab?")) return;
    try {
      await dispatch(deleteLab(id)).unwrap();
      toast.success("Lab deleted successfully");
    } catch (err: any) {
      // Error handled by useEffect
    }
  };

  // Mock analytical data fallbacks
  const leadsData = {
    D: { percent: 10 }, W: { percent: 20 }, M: { percent: 25 }, Y: { percent: 40 },
  };
  const revenueData = {
    D: { collected: 5, pending: 95, total: `INR ${stats.totalRevenue?.toLocaleString() || '0'}` },
    W: { collected: 30, pending: 70, total: `INR ${stats.totalRevenue?.toLocaleString() || '0'}` },
    M: { collected: 67, pending: 33, total: `INR ${stats.totalRevenue?.toLocaleString() || '0'}` },
    Y: { collected: 80, pending: 20, total: `INR ${stats.totalRevenue?.toLocaleString() || '0'}` },
  };
  const areaChartData = {
    D: [{ month: 'Today', score: 5 }, { month: 'Now', score: 10 }],
    W: Array.from({ length: 7 }, (_, i) => ({ month: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], score: Math.floor(Math.random() * 50) + 10 })),
    M: Array.from({ length: 9 }, (_, i) => ({ month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][i], score: Math.floor(Math.random() * 80) + 20 })),
    Y: [{ month: '2021', score: 60 }, { month: '2022', score: 80 }, { month: '2023', score: 95 }],
  };

  if (loading && labs.length === 0) {
    return <Loader fullScreen text="Loading dashboard..." />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 pt-20">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] opacity-60" />
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col relative z-10">
        {/* Header bar */}
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <Input
                className="pl-10 h-11 border-slate-200 bg-slate-50 focus-visible:ring-primary/20 focus-visible:bg-white transition-all rounded-xl"
                placeholder="Search labs, patients, or tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-500 rounded-full hover:bg-slate-100 relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name || 'Lab Admin'}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Lab Owner</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 border-2 border-white shadow-sm">
                {(user?.name?.[0] || 'A').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="w-full">
              <div className="max-w-6xl mx-auto px-4">

                {/* Dashboard Heading */}
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back!</h1>
                    <p className="text-slate-500 mt-1">Here's what's happening in your labs today.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl gap-2 h-11">
                      <Filter size={18} />
                      Filters
                    </Button>
                    <Button onClick={() => setShowAddLabModal(true)} className="rounded-xl gap-2 h-11 shadow-lg shadow-primary/20">
                      <Plus size={18} />
                      New Lab
                    </Button>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <DashboardSummaryCard icon={<CalendarIcon size={20} />} value={stats.totalAppointments || 0} label="Total Bookings" color="#F7B500" />
                  <DashboardSummaryCard icon={<Bell size={20} />} value={stats.pendingAppointments || 0} label="Pending Reports" color="#007AFF" />
                  <DashboardSummaryCard icon={<UsersIcon size={20} />} value={stats.totalLabs || 0} label="Active Labs" color="#1FC37E" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Labs Management */}
                  <div className="lg:col-span-2 space-y-8">
                    <Card className="border-slate-200/60 shadow-sm overflow-hidden">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between px-6 py-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <Plus className="text-primary" size={20} />
                          Your Laboratories
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5 font-bold text-xs uppercase tracking-wider">
                          View All
                        </Button>
                      </CardHeader>
                      <CardContent className="p-6">
                        {labs.length > 0 ? (
                          <LabsList labs={labs} onDeleteLab={handleDeleteLab} />
                        ) : (
                          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mx-auto mb-4">
                              <Plus className="text-slate-300" size={32} />
                            </div>
                            <p className="text-slate-500 font-medium italic">No laboratories registered yet</p>
                            <Button onClick={() => setShowAddLabModal(true)} variant="link" className="mt-2 text-primary">Add Your First Lab</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Analytics Section */}
                    <Card className="border-slate-200/60 shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-slate-100">
                        <CardTitle className="text-lg font-bold">Growth & Insights</CardTitle>
                        <DashboardTabs value={activeAnalyticsTab} onChange={(val) => setActiveAnalyticsTab(val as any)} options={["D", "W", "M", "Y"]} />
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-6">
                            <div>
                              <div className="font-semibold text-sm mb-4 text-slate-500 uppercase tracking-wider">Patient Feedback</div>
                              <div className="flex gap-8 items-center">
                                <DashboardCircularProgress percent={leadsData[activeAnalyticsTab].percent} color="#1FC37E" />
                                <DashboardLegend items={[
                                  { label: "Positive", color: "#1FC37E" },
                                  { label: "Neutral", color: "#007AFF" },
                                  { label: "Pending", color: "#F7B500" },
                                  { label: "Negative", color: "#FF4A4A" },
                                ]} />
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-sm mb-3 text-slate-500 uppercase tracking-wider">Revenue Performance</div>
                              <DashboardRevenueBar collectedPercent={revenueData[activeAnalyticsTab].collected} pendingPercent={revenueData[activeAnalyticsTab].pending} />
                              <div className="flex justify-between text-xs mt-3">
                                <span className="text-slate-400">Monthly Target: <span className="text-slate-900 font-bold">{revenueData[activeAnalyticsTab].total}</span></span>
                              </div>
                            </div>
                          </div>
                          <div className="h-full flex flex-col">
                            <div className="font-semibold text-sm mb-6 text-slate-500 uppercase tracking-wider">Booking Trends</div>
                            <div className="flex-1 min-h-[200px]">
                              <DashboardAreaChart data={areaChartData[activeAnalyticsTab]} color="#1FC37E" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column: Recent Activity / Sidebars */}
                  <div className="space-y-8">
                    <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <CalendarIcon size={120} />
                      </div>
                      <CardHeader className="border-b border-slate-100">
                        <CardTitle className="text-lg font-bold flex items-center justify-between">
                          Recent Bookings
                          <Badge variant="secondary" className="font-normal text-[10px]">{stats.recentAppointments?.length || 0} Today</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {stats.recentAppointments?.length > 0 ? (
                            stats.recentAppointments.map((booking: any) => (
                              <div
                                key={booking.id}
                                className="flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all cursor-pointer group"
                                onClick={() => navigate(`/lab-booking/${booking.id}`)}
                              >
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/10 group-hover:scale-110 transition-transform">
                                  {booking.user?.name?.[0] || 'P'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-sm truncate">{booking.user?.name || 'Patient'}</div>
                                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <CalendarIcon size={10} />
                                    {new Date(booking.appointmentDate).toLocaleDateString()}
                                  </div>
                                </div>
                                <Badge variant={booking.status === 'COMPLETED' ? 'outline' : 'secondary'} className={`text-[9px] uppercase font-bold py-0.5 ${booking.status === 'COMPLETED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                  {booking.status === 'COMPLETED' ? 'Done' : 'New'}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-20 text-slate-400 italic text-sm">No recent activity</div>
                          )}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-slate-500 hover:text-primary">View Full Schedule</Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-primary text-primary-foreground shadow-xl shadow-primary/20 border-none rounded-3xl overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                      <CardContent className="p-6 relative z-10">
                        <h3 className="font-bold text-lg mb-1">Scale Your Business</h3>
                        <p className="text-primary-foreground/70 text-xs mb-6">Upgrade to our Premium plan to list more than 3 labs and get advanced analytics.</p>
                        <Button className="w-full bg-white text-primary hover:bg-slate-100 font-bold rounded-xl h-11 border-none shadow-md shadow-black/5">
                          Upgrade Now
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && <TeamManagement />}
          {activeTab === "calendar" && (
            <div className="max-w-6xl mx-auto h-[800px] bg-white/50 backdrop-blur-sm rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden relative">
              <AppointmentCalendar />
            </div>
          )}

          {activeTab === "billing" && (
            <div className="max-w-6xl mx-auto px-4">
              <BillingDashboard />
            </div>
          )}

          {activeTab === "labs" && (
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Laboratories</h1>
                  <p className="text-slate-500 mt-1">Update settings and monitor performance for your facilities.</p>
                </div>
                <Button onClick={() => setShowAddLabModal(true)} className="rounded-xl gap-2 h-11 shadow-lg shadow-primary/20">
                  <Plus size={18} />
                  Register New Lab
                </Button>
              </div>
              <LabsList labs={labs} onDeleteLab={handleDeleteLab} />
            </div>
          )}

          {/* New Modules Placeholder Logic */}
          {['inventory', 'reports', 'settings', 'support', 'bookings'].includes(activeTab) && (
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200 shadow-xl shadow-slate-200/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8 animate-pulse">
                  {/* Find icon from sidebarLinks - we'd need access to it, but for now we'll use a generic icon or hardcode based on tab */}
                  {activeTab === 'billing' && <CreditCard size={48} />}
                  {activeTab === 'inventory' && <Package size={48} />}
                  {activeTab === 'reports' && <BarChart3 size={48} />}
                  {activeTab === 'settings' && <Settings size={48} />}
                  {activeTab === 'bookings' && <ClipboardList size={48} />}
                  {activeTab === 'support' && <LifeBuoy size={48} />}
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 capitalize">{activeTab} Module</h2>
                <p className="text-slate-500 text-lg max-w-md mx-auto mb-10 leading-relaxed">
                  The {activeTab} engine is currently being optimized for high-performance laboratory management.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" className="rounded-xl px-8 h-12 font-bold mb-2">Technical Specs</Button>
                  <Button className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20">Join Early Access</Button>
                </div>
              </div>
            </div>
          )}
        </main>

        <LabOnboardingModal
          show={showAddLabModal}
          onClose={() => { setShowAddLabModal(false); setCurrentStep(1); }}
          currentStep={currentStep}
          labData={newLabData}
          onLabDataChange={setNewLabData}
          onSubmit={handleAddLabSubmit}
          onStepChange={setCurrentStep}
        />
      </div>
    </div>
  );
};

export default LabDashboard;
