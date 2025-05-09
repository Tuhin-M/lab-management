import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LabDashboardHeader from "@/components/lab-owner/LabDashboardHeader";
import LabsList from "@/components/lab-owner/LabsList";
import { authAPI, labOwnerAPI } from "@/services/api";
import { toast } from "sonner";
import { TestManager } from "@/components/lab-owner/TestManager";
import { AnalyticsDashboard } from "@/components/lab-owner/AnalyticsDashboard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LabOnboardingModal } from "@/components/lab-owner/LabOnboardingModal";
import type { LabCreateRequest } from "@/components/lab-owner/LabOnboardingModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import Sidebar from "@/components/lab-owner/Sidebar";
import DashboardSummaryCard from "@/components/lab-owner/DashboardSummaryCard";
import DashboardTabs from "@/components/lab-owner/DashboardTabs";
import DashboardCircularProgress from "@/components/lab-owner/DashboardCircularProgress";
import DashboardLegend from "@/components/lab-owner/DashboardLegend";
import DashboardRevenueBar from "@/components/lab-owner/DashboardRevenueBar";
import DashboardAreaChart from "@/components/lab-owner/DashboardAreaChart";
import { Plus } from "react-feather";

const LabDashboard = () => {
  // Available sections: dashboard, labs, support, patients, bookings, team, calendar
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<'D'|'W'|'M'|'Y'>('M');
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [newLabData, setNewLabData] = useState<LabCreateRequest>({
    name: '',
    description: '',
    establishedDate: '',
    registrationNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      landmark: ''
    },
    contact: {
      email: '',
      phone: '',
      emergencyContact: '',
      website: ''
    },
    facilities: [],
    certifications: [],
    workingHours: {
      weekdays: '9:00 AM - 6:00 PM',
      weekends: '10:00 AM - 4:00 PM',
      holidays: 'Closed'
    },
    staff: {
      pathologists: 0,
      technicians: 0,
      receptionists: 0
    },
    services: []
  });
  const [currentStep, setCurrentStep] = useState(1);

  // Add new lab handler
  const handleAddLab = async (formData: LabCreateRequest) => {
    try {
      const response = await labOwnerAPI.addLab({
        name: formData.name,
        description: formData.description,
        establishedDate: formData.establishedDate,
        registrationNumber: formData.registrationNumber,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          zipCode: formData.address.zipCode,
          country: formData.address.country,
          landmark: formData.address.landmark
        },
        contact: {
          email: formData.contact.email,
          phone: formData.contact.phone,
          emergencyContact: formData.contact.emergencyContact,
          website: formData.contact.website
        },
        facilities: formData.facilities,
        certifications: formData.certifications,
        workingHours: {
          weekdays: formData.workingHours.weekdays,
          weekends: formData.workingHours.weekends,
          holidays: formData.workingHours.holidays
        },
        staff: {
          pathologists: formData.staff.pathologists,
          technicians: formData.staff.technicians,
          receptionists: formData.staff.receptionists
        },
        services: formData.services
      });
      
      setLabs([...labs, response]);
      setShowAddLabModal(false);
      setNewLabData({
        name: '',
        description: '',
        establishedDate: '',
        registrationNumber: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          landmark: ''
        },
        contact: {
          email: '',
          phone: '',
          emergencyContact: '',
          website: ''
        },
        facilities: [],
        certifications: [],
        workingHours: {
          weekdays: '9:00 AM - 6:00 PM',
          weekends: '10:00 AM - 4:00 PM',
          holidays: 'Closed'
        },
        staff: {
          pathologists: 0,
          technicians: 0,
          receptionists: 0
        },
        services: []
      });
      toast.success("Lab added successfully");
    } catch (error) {
      console.error("Add lab failed:", error);
      toast.error("Failed to add lab");
    }
  };

  const handleAddLabSubmit = async () => {
    await handleAddLab(newLabData);
  };

  // Dummy data for each tab
  const leadsData = {
    D: { percent: 10 },
    W: { percent: 20 },
    M: { percent: 25 },
    Y: { percent: 40 },
  };
  const revenueData = {
    D: { collected: 5, pending: 95, total: 'INR 1,000' },
    W: { collected: 30, pending: 70, total: 'INR 8,000' },
    M: { collected: 67, pending: 33, total: 'INR 28,56,000' },
    Y: { collected: 80, pending: 20, total: 'INR 3,40,000' },
  };
  const areaChartData = {
    D: [
      { month: 'Today', score: 5 },
      { month: 'Now', score: 10 },
    ],
    W: [
      { month: 'Mon', score: 10 },
      { month: 'Tue', score: 15 },
      { month: 'Wed', score: 20 },
      { month: 'Thu', score: 25 },
      { month: 'Fri', score: 30 },
      { month: 'Sat', score: 35 },
      { month: 'Sun', score: 40 },
    ],
    M: [
      { month: 'Jan 2022', score: 15 },
      { month: 'Feb 2022', score: 24 },
      { month: 'Mar 2022', score: 40 },
      { month: 'Apr 2022', score: 60 },
      { month: 'May 2022', score: 55 },
      { month: 'Jun 2022', score: 70 },
      { month: 'Jul 2022', score: 65 },
      { month: 'Aug 2022', score: 80 },
      { month: 'Sep 2022', score: 67 },
    ],
    Y: [
      { month: '2021', score: 60 },
      { month: '2022', score: 80 },
      { month: '2023', score: 95 },
    ],
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [labs, setLabs] = useState([]);
  const [stats, setStats] = useState({
    totalLabs: 0,
    totalAppointments: 0,
    totalTests: 0,
    totalRevenue: 0
  });

  // Handler to delete a lab
  const handleDeleteLab = async (id: string) => {
    try {
      await labOwnerAPI.deleteLab(id);
      setLabs(prev => prev.filter(l => l._id !== id));
      toast.success("Lab deleted successfully");
    } catch (error) {
      console.error("Delete lab failed:", error);
      toast.error("Failed to delete lab");
    }
  };

  const handleViewLabDetails = (lab: any) => {
    navigate(`/lab/${lab._id}`, { state: { fromDashboard: true, lab } });
  };

  // Dummy staff and feedback data
  const mockStaff = [
    { id: 's1', name: 'Anjali Mehta', role: 'Lab Technician', image: '/placeholder.svg' },
    { id: 's2', name: 'Ravi Kumar', role: 'Lab Assistant', image: '/placeholder.svg' },
    { id: 's3', name: 'Sneha Shah', role: 'Quality Analyst', image: '/placeholder.svg' },
    { id: 's4', name: 'Vikram Singh', role: 'Phlebotomist', image: '/placeholder.svg' },
    { id: 's5', name: 'Meera Das', role: 'Receptionist', image: '/placeholder.svg' },
    { id: 's6', name: 'Arjun Nair', role: 'Lab Manager', image: '/placeholder.svg' }
  ];

  const mockFeedback = [
    { id: 'f1', user: 'Rahul Sharma', rating: 5, comment: 'Excellent service and quick results!', date: '2025-04-10' },
    { id: 'f2', user: 'Priya Patel', rating: 4, comment: 'Good experience but waiting time was long.', date: '2025-04-08' },
    { id: 'f3', user: 'Amit Joshi', rating: 5, comment: 'Very professional staff and neat facility.', date: '2025-04-12' },
    { id: 'f4', user: 'Sonal Kapoor', rating: 3, comment: 'Reports were delayed, but staff was helpful.', date: '2025-04-13' },
    { id: 'f5', user: 'Deepak Verma', rating: 4, comment: 'Clean environment and courteous staff.', date: '2025-04-11' },
    { id: 'f6', user: 'Nisha Rao', rating: 5, comment: 'Best lab experience so far!', date: '2025-04-09' }
  ];

  // Summary data for overview analytics
  const summaryData = [
    { name: 'Total Labs', value: 4 },
    { name: 'Appointments', value: 120 },
    { name: 'Tests Conducted', value: 800 },
    { name: 'Total Revenue', value: 320000 }
  ];

  // Dummy appointments data
  const mockAppointments = [
    {
      id: 'a1',
      labId: '1',
      patient: 'Rahul Sharma',
      test: 'Blood Test',
      date: '2025-04-18',
      time: '10:00 AM',
      status: 'Completed'
    },
    {
      id: 'a2',
      labId: '2',
      patient: 'Priya Patel',
      test: 'X-Ray',
      date: '2025-04-18',
      time: '11:30 AM',
      status: 'Scheduled'
    },
    {
      id: 'a3',
      labId: '3',
      patient: 'Amit Joshi',
      test: 'MRI',
      date: '2025-04-19',
      time: '9:15 AM',
      status: 'In Progress'
    },
    {
      id: 'a4',
      labId: '4',
      patient: 'Sonal Kapoor',
      test: 'Urine Test',
      date: '2025-04-20',
      time: '2:00 PM',
      status: 'Completed'
    },
    {
      id: 'a5',
      labId: '2',
      patient: 'Deepak Verma',
      test: 'Liver Function',
      date: '2025-04-20',
      time: '3:30 PM',
      status: 'Scheduled'
    }
  ];

  // Dummy lab tests data
  const mockLabTests = [
    { id: 't1', name: 'Blood Test', price: 500, duration: '15 min', description: 'Basic blood analysis.' },
    { id: 't2', name: 'X-Ray', price: 1200, duration: '20 min', description: 'Chest X-ray imaging.' },
    { id: 't3', name: 'MRI', price: 4500, duration: '45 min', description: 'Brain MRI scan.' },
    { id: 't4', name: 'Urine Test', price: 300, duration: '10 min', description: 'Routine urine analysis.' },
    { id: 't5', name: 'Liver Function', price: 800, duration: '25 min', description: 'Liver function panel.' }
  ];

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Verify token is still valid
        await authAPI.getCurrentUser();
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    validateToken();
  }, [navigate]);

  useEffect(() => {
    const checkUserRole = () => {
      const role = authAPI.getCurrentUserRole();
      if (role !== 'lab_owner') {
        toast.error('Access denied. Only lab owners can access this page.');
        navigate('/login');
      }
    };

    const fetchLabData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a real API call
        // For now we'll simulate with mock data
        const response = await labOwnerAPI.getOwnedLabs();
        
        // Mock response for demonstration
        const mockLabs = [
          {
            _id: '1',
            name: 'Central Diagnostics',
            address: {
              street: '123 Main St',
              city: 'Mumbai',
              state: 'Maharashtra',
              zip: '400001'
            },
            image: '/placeholder.svg',
            rating: 4.5,
            tests: new Array(12),
            status: 'active'
          },
          {
            _id: '2',
            name: 'Prime Pathology',
            address: {
              street: '45 Connaught Place',
              city: 'Delhi',
              state: 'Delhi',
              zip: '110001'
            },
            image: '/placeholder.svg',
            rating: 4.2,
            tests: new Array(8),
            status: 'active'
          },
          {
            _id: '3',
            name: 'Metro Labs',
            address: {
              street: '88 MG Road',
              city: 'Bangalore',
              state: 'Karnataka',
              zip: '560001'
            },
            image: '/placeholder.svg',
            rating: 4.7,
            tests: new Array(15),
            status: 'active'
          },
          {
            _id: '4',
            name: 'HealthFirst Diagnostics',
            address: {
              street: '12 Anna Salai',
              city: 'Chennai',
              state: 'Tamil Nadu',
              zip: '600002'
            },
            image: '/placeholder.svg',
            rating: 4.6,
            tests: new Array(10),
            status: 'active'
          }
        ];
        
        setLabs(mockLabs);
        setStats({
          totalLabs: mockLabs.length,
          totalAppointments: 120,
          totalTests: 800,
          totalRevenue: 320000
        });
      } catch (error) {
        console.error('Failed to fetch lab data:', error);
        toast.error('Failed to load lab data');
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
    fetchLabData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-t-2 border-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
  <div className="flex min-h-screen bg-gray-100">
  {/* Sidebar */}
  <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
  <div className="flex-1 flex flex-col">
    <main className="flex-1 p-6 md:p-10 overflow-y-auto">
      {activeTab === "dashboard" && (
  <>
    {/* Summary Cards Row */}
    <div className="bg-[#F5F6FA] min-h-screen w-full">
      <div className="max-w-6xl mx-auto px-4 pt-3">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-center">
          <DashboardSummaryCard icon={<span className="material-icons">event</span>} value={25} label="Bookings Today" color="#F7B500" />
          <DashboardSummaryCard icon={<span className="material-icons">local_hotel</span>} value={300} label="Reports to be delivered" color="#007AFF" />
          <DashboardSummaryCard icon={<span className="material-icons">sentiment_very_satisfied</span>} value={89} label="Reports delivered" color="#1FC37E" />
        </div>

        {/* Labs Management Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Labs</h2>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => setShowAddLabModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Lab
            </Button>
          </div>
          
          {labs.length > 0 ? (
            <LabsList labs={labs} onDeleteLab={handleDeleteLab} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No labs added yet</p>
              <Button 
                onClick={() => setShowAddLabModal(true)}
                className="mt-4 bg-primary hover:bg-primary-dark"
              >
                Add Your First Lab
              </Button>
            </div>
          )}
        </div>

        {/* Analytics + Appointments Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Combined Analytics Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 h-full min-h-[340px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="font-semibold text-base">Analytics</div>
              <DashboardTabs value={activeAnalyticsTab} onChange={(val) => setActiveAnalyticsTab(val as 'D'|'W'|'M'|'Y')} options={["D","W","M","Y"]} />
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <div className="font-semibold text-sm mb-2">Leads</div>
                <div className="flex flex-row gap-6 items-center w-full">
                  <DashboardCircularProgress percent={leadsData[activeAnalyticsTab].percent} color="#1FC37E" />
                  <DashboardLegend items={[
                    { label: "Star Rated", color: "#1FC37E" },
                    { label: "Yet to be reviewed", color: "#007AFF" },
                    { label: "Wants Review", color: "#F7B500" },
                    { label: "Review to be improved", color: "#FF4A4A" },
                  ]} />
                </div>
              </div>
              <div>
                <div className="font-semibold text-sm mb-2">Revenue Metrics</div>
                <DashboardRevenueBar collectedPercent={revenueData[activeAnalyticsTab].collected} pendingPercent={revenueData[activeAnalyticsTab].pending} />
                <div className="flex justify-between text-xs mt-2">
                  <span>Total Expected Revenue : {revenueData[activeAnalyticsTab].total}</span>
                </div>
              </div>
              <div>
                <div className="font-semibold text-sm mb-2">Analytical Report</div>
                <DashboardAreaChart data={areaChartData[activeAnalyticsTab]} color="#1FC37E" />
                <div className="flex justify-between text-xs mt-2">
                  <span>X = Time Period</span>
                  <span>Y = Average Score</span>
                </div>
              </div>
            </div>
          </div>
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 h-full min-h-[340px] flex flex-col">
            <div className="font-semibold text-base mb-4">Upcoming Appointments</div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F7FA]">
                <img src="/placeholder.svg" alt="Patient" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Patient Name</div>
                  <div className="text-xs text-gray-500">Test name</div>
                </div>
                <span className="bg-[#1FC37E] text-white text-xs px-3 py-1 rounded-lg">Ongoing</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border">
                <img src="/placeholder.svg" alt="Patient" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Patient Name</div>
                  <div className="text-xs text-gray-500">Test name</div>
                </div>
                <span className="text-xs text-gray-500">10:30 AM</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border">
                <img src="/placeholder.svg" alt="Patient" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Patient Name</div>
                  <div className="text-xs text-gray-500">Test name</div>
                </div>
                <span className="text-xs text-gray-500">11:10 AM</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </>
)}
      {activeTab === "labs" && (
        <div className="container mx-auto p-4">
          <LabsList labs={labs} onDeleteLab={handleDeleteLab} />
        </div>
      )}
      {activeTab === "support" && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              For assistance, contact us at{' '}
              <a href="mailto:support@lab.com" className="text-indigo-600 underline">
                support@lab.com
              </a>{' '}
              or call{' '}
              <a href="tel:18001234567" className="text-indigo-600 underline">
                1800-123-4567
              </a>.
            </p>
            <div className="mt-4 flex space-x-4">
              <Button variant="outline" onClick={() => window.location.href = 'mailto:support@lab.com'}>
                Email Support
              </Button>
              <Button variant="outline" onClick={() => window.location.href = 'tel:18001234567'}>
                Call Support
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {activeTab === "patients" && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full table-auto divide-y">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 px-4">Rahul Sharma</td>
                  <td className="py-2 px-4">rahul@example.com</td>
                  <td className="py-2 px-4">9876543210</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Priya Patel</td>
                  <td className="py-2 px-4">priya@example.com</td>
                  <td className="py-2 px-4">8765432109</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Amit Joshi</td>
                  <td className="py-2 px-4">amit@example.com</td>
                  <td className="py-2 px-4">7654321098</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-xl font-bold mb-4">Bookings</h2>
          <ul className="divide-y">
            <li className="py-4 flex items-center justify-between">
              <span>Rahul Sharma - Blood Test</span>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Scheduled</span>
            </li>
            <li className="py-4 flex items-center justify-between">
              <span>Priya Patel - X-Ray</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
            </li>
            <li className="py-4 flex items-center justify-between">
              <span>Amit Joshi - MRI</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">In Progress</span>
            </li>
          </ul>
        </div>
      )}
      {activeTab === "team" && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mockStaff.map(member => (
                <Card key={member.id} className="text-center p-4">
                  <img src={member.image} alt={member.name} className="w-16 h-16 mx-auto rounded-full" />
                  <div className="mt-2 font-semibold">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.role}</div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {activeTab === "calendar" && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px]">
            <div className="text-gray-400">[Calendar Component Placeholder]</div>
          </CardContent>
        </Card>
      )}
    </main>
    <LabOnboardingModal 
      show={showAddLabModal}
      onClose={() => {
        setShowAddLabModal(false);
        setCurrentStep(1);
      }}
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
