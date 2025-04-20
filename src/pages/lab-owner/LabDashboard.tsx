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

const LabDashboard = () => {
  const [activeTab, setActiveTab] = useState('labs');
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
    <div className="min-h-screen bg-background flex flex-col">
      <LabDashboardHeader />
      <div className="flex-1 container p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-gray-50 transition" onClick={() => setActiveTab('labs')}>
            <h3 className="text-sm font-medium text-gray-500">Total Labs</h3>
            <p className="mt-1 text-2xl font-semibold">{stats.totalLabs}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-gray-50 transition" onClick={() => setActiveTab('appointments')}>
            <h3 className="text-sm font-medium text-gray-500">Appointments</h3>
            <p className="mt-1 text-2xl font-semibold">{stats.totalAppointments}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-gray-50 transition" onClick={() => setActiveTab('lab-tests')}>
            <h3 className="text-sm font-medium text-gray-500">Tests Conducted</h3>
            <p className="mt-1 text-2xl font-semibold">{stats.totalTests}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow cursor-pointer hover:bg-gray-50 transition" onClick={() => setActiveTab('analytics')}>
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="mt-1 text-2xl font-semibold">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList>
            <TabsTrigger value="labs">Your Labs</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="labs" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Labs</h2>
              <Button onClick={() => navigate("/lab-owner/add-lab")}>Add New Lab</Button>
            </div>
            <LabsList labs={labs} onDeleteLab={handleDeleteLab} />
          </TabsContent>

          <TabsContent value="appointments" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">All Appointments</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Patient</th>
                    <th className="py-2 px-4 border-b">Lab</th>
                    <th className="py-2 px-4 border-b">Test</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Time</th>
                    <th className="py-2 px-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAppointments.map((appt) => {
                    const lab = labs.find((l: any) => l._id === appt.labId);
                    return (
                      <tr key={appt.id}>
                        <td className="py-2 px-4 border-b">{appt.patient}</td>
                        <td className="py-2 px-4 border-b">{lab ? lab.name : '-'}</td>
                        <td className="py-2 px-4 border-b">{appt.test}</td>
                        <td className="py-2 px-4 border-b">{appt.date}</td>
                        <td className="py-2 px-4 border-b">{appt.time}</td>
                        <td className="py-2 px-4 border-b">{appt.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="lab-tests" className="mt-4">
            <TestManager labs={labs} />
          </TabsContent>

          <TabsContent value="staff" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Staff Members</h2>
            <div className="flex flex-wrap justify-center -mx-4">
              {mockStaff.map((staff) => (
                <div key={staff.id} className="w-full md:w-1/2 xl:w-1/3 px-4 mb-8">
                  <img src={staff.image} alt={staff.name} className="mx-auto h-24 w-24 object-cover rounded-full" />
                  <h3 className="mt-4 text-lg font-medium">{staff.name}</h3>
                  <p className="text-sm text-gray-500">{staff.role}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Patient Feedback</h2>
            <div className="space-y-4">
              {mockFeedback.map((fb) => (
                <div key={fb.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{fb.user}</p>
                      <p className="text-sm text-gray-500">{fb.date}</p>
                    </div>
                    <div className="text-yellow-500">{'★'.repeat(fb.rating)}</div>
                  </div>
                  <p className="mt-2 text-gray-700">{fb.comment}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LabDashboard;
