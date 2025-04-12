
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LabDashboardHeader from "@/components/lab-owner/LabDashboardHeader";
import LabOverviewCard from "@/components/lab-owner/LabOverviewCard";
import LabsList from "@/components/lab-owner/LabsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authAPI, labOwnerAPI } from "@/services/api";
import { toast } from "sonner";

const LabDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [labs, setLabs] = useState([]);
  const [stats, setStats] = useState({
    totalLabs: 0,
    totalAppointments: 0,
    totalTests: 0,
    totalRevenue: 0
  });

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
              city: 'Mumbai',
              state: 'Maharashtra'
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
              city: 'Delhi',
              state: 'Delhi'
            },
            image: '/placeholder.svg',
            rating: 4.2,
            tests: new Array(8),
            status: 'active'
          }
        ];
        
        setLabs(mockLabs);
        setStats({
          totalLabs: mockLabs.length,
          totalAppointments: 45,
          totalTests: 280,
          totalRevenue: 125000
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

  const handleDeleteLab = async (id: string) => {
    try {
      // In a real app, this would be a real API call
      // await labOwnerAPI.deleteLab(id);
      
      // For demo purposes, we'll just filter out the deleted lab
      setLabs(labs.filter((lab: any) => lab._id !== id));
      toast.success('Lab deleted successfully');
    } catch (error) {
      console.error('Failed to delete lab:', error);
      toast.error('Failed to delete lab');
    }
  };

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
        <LabOverviewCard {...stats} />
        
        <Tabs defaultValue="labs" className="mt-6">
          <TabsList>
            <TabsTrigger value="labs">Your Labs</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="labs" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Labs</h2>
              <Button onClick={() => navigate("/lab-owner/add-lab")}>
                Add New Lab
              </Button>
            </div>
            <LabsList labs={labs} onDeleteLab={handleDeleteLab} />
          </TabsContent>
          <TabsContent value="appointments" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">All Appointments</h2>
            <p className="text-muted-foreground">
              Select a lab to view and manage its appointments.
            </p>

            <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {labs.map((lab: any) => (
                <Button
                  key={lab._id}
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => navigate(`/lab-owner/lab/${lab._id}/appointments`)}
                >
                  <div className="text-left">
                    <div className="font-medium">{lab.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {lab.address.city}, {lab.address.state}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <div className="bg-card border rounded-md p-8 text-center">
              <p className="text-lg text-muted-foreground">
                Advanced analytics will be available soon
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LabDashboard;
