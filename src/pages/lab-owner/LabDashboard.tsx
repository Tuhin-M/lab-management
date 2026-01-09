import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData, deleteLab, addLab } from "@/store/slices/labSlice";
import { RootState, AppDispatch } from "@/store";
import { toast } from "sonner";
import { Plus } from "react-feather";

import Sidebar from "@/components/lab-owner/Sidebar";
import LabsList from "@/components/lab-owner/LabsList";
import { LabOnboardingModal } from "@/components/lab-owner/LabOnboardingModal";
import type { LabCreateRequest } from "@/components/lab-owner/LabOnboardingModal";

// Common Components
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";
import { Loader } from "@/components/common/Loader";

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
  const { role } = useSelector((state: RootState) => state.auth);

  // Local UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<'D'|'W'|'M'|'Y'>('M');
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="bg-[#F5F6FA] min-h-screen w-full">
              <div className="max-w-6xl mx-auto px-4 pt-3">
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
                  <DashboardSummaryCard icon={<span className="material-icons">event</span>} value={stats.totalAppointments || 0} label="Total Bookings" color="#F7B500" />
                  <DashboardSummaryCard icon={<span className="material-icons">local_hotel</span>} value={stats.pendingAppointments || 0} label="Pending Reports" color="#007AFF" />
                  <DashboardSummaryCard icon={<span className="material-icons">sentiment_very_satisfied</span>} value={stats.totalLabs || 0} label="Active Labs" color="#1FC37E" />
                </div>

                {/* Labs Management Section */}
                <Card className="p-5 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Your Labs</h2>
                    <Button size="sm" onClick={() => setShowAddLabModal(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add New Lab
                    </Button>
                  </div>
                  
                  {labs.length > 0 ? (
                    <LabsList labs={labs} onDeleteLab={handleDeleteLab} />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p className="mb-4">No labs added yet</p>
                      <Button onClick={() => setShowAddLabModal(true)}>Add Your First Lab</Button>
                    </div>
                  )}
                </Card>

                {/* Analytics + Appointments Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  <Card className="p-5 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <div className="font-semibold text-lg">Analytics</div>
                      <DashboardTabs value={activeAnalyticsTab} onChange={(val) => setActiveAnalyticsTab(val as any)} options={["D","W","M","Y"]} />
                    </div>
                    <div className="space-y-8">
                      <div>
                        <div className="font-semibold text-sm mb-4">Patient Feedback</div>
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
                        <div className="font-semibold text-sm mb-3">Revenue Insights</div>
                        <DashboardRevenueBar collectedPercent={revenueData[activeAnalyticsTab].collected} pendingPercent={revenueData[activeAnalyticsTab].pending} />
                        <div className="flex justify-between text-xs mt-3 text-muted-foreground">
                          <span>Projected: {revenueData[activeAnalyticsTab].total}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-3">Growth Analysis</div>
                        <DashboardAreaChart data={areaChartData[activeAnalyticsTab]} color="#1FC37E" />
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-5 h-full flex flex-col">
                    <div className="font-semibold text-lg mb-6">Recent Bookings</div>
                    <div className="space-y-4">
                      {stats.recentAppointments?.length > 0 ? (
                        stats.recentAppointments.map((booking: any) => (
                          <div 
                            key={booking.id} 
                            className="flex items-center gap-4 p-4 rounded-xl border hover:bg-gray-50 transition-colors cursor-pointer" 
                            onClick={() => navigate(`/lab-booking/${booking.id}`)}
                          >
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {booking.user?.name?.[0] || 'P'}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{booking.user?.name || 'Patient'}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(booking.appointmentDate).toLocaleDateString()} at {booking.appointmentTime}
                              </div>
                            </div>
                            <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {booking.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20 text-muted-foreground italic">No recent bookings.</div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "labs" && (
            <div className="container mx-auto">
              <LabsList labs={labs} onDeleteLab={handleDeleteLab} />
            </div>
          )}
          
          {activeTab === "bookings" && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">All Bookings</h2>
              <ul className="divide-y">
                {stats.recentAppointments?.map((booking: any) => (
                  <li key={booking.id} className="py-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{booking.user?.name}</div>
                      <div className="text-sm text-muted-foreground">{booking.lab?.name}</div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {booking.status}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {["patients", "team", "calendar", "support"].includes(activeTab) && (
            <Card className="py-20 text-center text-muted-foreground">
              <p>Section "{activeTab}" is under active development.</p>
            </Card>
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
