import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Shield, Calendar } from "lucide-react";
import { labOwnerAPI } from "@/services/api";
import { toast } from "sonner";
import AppointmentsList from "@/components/lab-owner/AppointmentsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const LabDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [lab, setLab] = useState<any>(null);
  const [appointments, setAppointments] = useState([]);
  const hideNavbar = location.state?.fromDashboard;

  useEffect(() => {
    // Check if we should hide the navbar
    const fetchLabData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a real API call
        // For now we'll simulate with mock data
        
        // Mock lab data for demonstration
        const mockLab = {
          _id: id,
          name: 'Central Diagnostics',
          description: 'A leading diagnostic center providing high-quality lab tests and healthcare services.',
          address: {
            street: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001'
          },
          contactInfo: {
            phone: '9876543210',
            email: 'contact@centraldiagnostics.com',
            website: 'www.centraldiagnostics.com'
          },
          certifications: ['NABL', 'ISO 9001:2015'],
          operatingHours: {
            weekdays: {
              open: '08:00',
              close: '20:00'
            },
            weekends: {
              open: '09:00',
              close: '17:00'
            }
          },
          image: '/placeholder.svg',
          rating: 4.5,
          tests: new Array(12),
          status: 'active'
        };
        
        setLab(mockLab);

        // Mock appointments data
        const mockAppointments = [
          {
            _id: 'appt1',
            patientName: 'Rahul Sharma',
            testName: 'Complete Blood Count',
            date: '2025-04-15',
            time: '10:30 AM',
            status: 'scheduled',
            paymentStatus: 'paid',
            amount: 1200
          },
          {
            _id: 'appt2',
            patientName: 'Priya Patel',
            testName: 'Lipid Profile',
            date: '2025-04-16',
            time: '11:00 AM',
            status: 'completed',
            paymentStatus: 'paid',
            amount: 1500
          },
          {
            _id: 'appt3',
            patientName: 'Amit Kumar',
            testName: 'Thyroid Profile',
            date: '2025-04-17',
            time: '09:15 AM',
            status: 'scheduled',
            paymentStatus: 'pending',
            amount: 800
          }
        ];
        
        setAppointments(mockAppointments);
      } catch (error) {
        console.error('Failed to fetch lab data:', error);
        toast.error('Failed to load lab details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLabData();
  }, [id, location.state]);

  const refreshAppointments = async () => {
    // In a real app, this would refresh appointment data
    toast.success('Appointments refreshed');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-t-2 border-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading lab details...</p>
        </div>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Lab not found</h2>
          <p className="text-muted-foreground mb-6">The lab you're looking for doesn't exist or you don't have access.</p>
          <Button onClick={() => navigate("/lab-dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {!hideNavbar && (
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2" /> Back to Labs
            </Button>
            <h1 className="text-xl font-semibold">Lab Management</h1>
            <div />
          </div>
        </div>
      )}
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="min-h-screen bg-background pt-16 pb-12">
          <div className="container mx-auto p-4">
            <Button
              variant="ghost"
              className="mb-6 flex items-center"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Labs
            </Button>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <Card>
                  <div className="h-40 overflow-hidden">
                    <img
                      src={lab.image || "/placeholder.svg"}
                      alt={lab.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <h6 className="text-lg font-semibold">{lab.name}</h6>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {lab.description}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span className="text-sm">
                          {lab.address.street}, {lab.address.city}, {lab.address.state}, {lab.address.zipCode}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{lab.contactInfo.phone}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{lab.contactInfo.email}</span>
                      </div>
                      
                      {lab.contactInfo.website && (
                        <div className="flex items-center space-x-3">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{lab.contactInfo.website}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Certifications</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lab.certifications.map((cert: string, index: number) => (
                          <span 
                            key={index}
                            className="bg-muted text-xs font-medium px-2 py-1 rounded-md"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Operating Hours</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Weekdays:</span>
                          <span>{lab.operatingHours.weekdays.open} - {lab.operatingHours.weekdays.close}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weekends:</span>
                          <span>{lab.operatingHours.weekends.open} - {lab.operatingHours.weekends.close}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/lab-owner/edit-lab/${id}`)}
                      >
                        Edit Details
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/lab-owner/lab/${id}/tests`)}
                      >
                        Manage Tests
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Tabs defaultValue="appointments">
                  <TabsContent value="appointments">
                    <Card>
                      <CardHeader>
                        <h6 className="text-lg font-semibold">Lab Appointments</h6>
                      </CardHeader>
                      <CardContent>
                        <AppointmentsList 
                          labId={id} 
                          appointments={appointments} 
                          onStatusChange={refreshAppointments} 
                          onSearch={() => {}} 
                          onFilter={() => {}} 
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tests">
                    <Card>
                      <CardHeader>
                        <h6 className="text-lg font-semibold">Available Tests</h6>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-muted-foreground">Manage the tests available at this lab</p>
                          <Button 
                            size="sm"
                            onClick={() => navigate(`/lab-owner/lab/${id}/add-test`)}
                          >
                            Add New Test
                          </Button>
                        </div>
                        <div className="text-center py-12 border rounded-md">
                          <p className="text-muted-foreground">No tests have been added yet</p>
                          <Button 
                            size="sm"
                            className="mt-4"
                            onClick={() => navigate(`/lab-owner/lab/${id}/add-test`)}
                          >
                            Add Your First Test
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reports">
                    <Card>
                      <CardHeader>
                        <h6 className="text-lg font-semibold">Lab Reports</h6>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-8">
                          View and analyze performance reports for this lab
                        </p>
                        <div className="text-center py-12">
                          <p className="text-lg font-medium mb-2">Coming Soon</p>
                          <p className="text-muted-foreground">
                            Detailed analytics and reporting will be available soon
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LabDetail;
