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
  const [tests, setTests] = useState<any[]>([]);
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

        // Fetch real tests
        const { data: labTests } = await labOwnerAPI.getLabTests(id!);
        setTests(labTests || []);
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
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 relative overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] opacity-60" />
      </div>

      {!hideNavbar && (
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl gap-2 text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft size={18} />
            <span className="font-semibold">Back to Dashboard</span>
          </Button>
          <h1 className="text-xl font-bold text-slate-900">Lab Administration</h1>
          <div className="w-24" /> {/* Spacer */}
        </header>
      )}

      <main className="flex-1 p-6 md:p-10 relative z-10">
        <div className="container max-w-6xl mx-auto">
          {hideNavbar && (
            <Button
              variant="ghost"
              className="mb-8 -ml-4 rounded-xl text-slate-500 hover:text-primary transition-colors group"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Exit Lab View</span>
            </Button>
          )}

          <div className="grid gap-8 lg:grid-cols-3 items-start">
            {/* Left Column: Lab Info Card */}
            <div className="lg:col-span-1">
              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                <div className="aspect-video overflow-hidden relative group">
                  <img
                    src={lab.image || (Array.isArray(lab.images) && lab.images[0]) || "/placeholder.svg"}
                    alt={lab.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Logo Overlay */}
                  <div className="absolute bottom-4 left-4 w-16 h-16 rounded-xl bg-white p-1 shadow-lg z-10">
                    <img 
                      src={lab.logo || "/images/ekitsa_logo.png"} 
                      alt="Lab Logo" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                </div>

                <CardHeader className="pt-6 pb-2 px-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Active Facility</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < Math.floor(lab.rating) ? 'bg-amber-400' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{lab.name}</h2>
                </CardHeader>

                <CardContent className="px-6 pb-8 space-y-6">
                  <p className="text-sm text-slate-500 leading-relaxed italic">
                    "{lab.description}"
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <MapPin size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
                        <p className="text-sm font-medium text-slate-700">
                          {lab.address.street}, {lab.address.city}, {lab.address.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Phone size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contact</p>
                        <p className="text-sm font-medium text-slate-700">{lab.contactInfo.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Mail size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
                        <p className="text-sm font-medium text-slate-700 truncate">{lab.contactInfo.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Accreditations</p>
                    <div className="flex flex-wrap gap-2">
                      {lab.certifications.map((cert: string, index: number) => (
                        <div
                          key={index}
                          className="bg-primary/5 text-primary border border-primary/10 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                        >
                          <Shield size={10} />
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Hours</p>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs p-2 rounded-lg bg-slate-50">
                        <span className="font-semibold text-slate-500">Mon - Fri</span>
                        <span className="text-slate-900 font-bold">{lab.operatingHours.weekdays.open} - {lab.operatingHours.weekdays.close}</span>
                      </div>
                      <div className="flex justify-between text-xs p-2 rounded-lg bg-slate-50">
                        <span className="font-semibold text-slate-500">Sat - Sun</span>
                        <span className="text-slate-900 font-bold">{lab.operatingHours.weekends.open} - {lab.operatingHours.weekends.close}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl h-11 text-xs font-bold"
                      onClick={() => navigate(`/lab-owner/edit-lab/${id}`)}
                    >
                      Settings
                    </Button>
                    <Button
                      className="flex-1 rounded-xl h-11 text-xs font-bold shadow-lg shadow-primary/20"
                      onClick={() => navigate(`/lab-owner/lab/${id}/tests`)}
                    >
                      Manage Tests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Dynamic Content Tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="bg-white/50 backdrop-blur p-1 rounded-2xl border border-slate-200 mb-6 h-auto">
                  <TabsTrigger value="appointments" className="rounded-xl py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/50 font-bold text-sm">
                    Appointments
                  </TabsTrigger>
                  <TabsTrigger value="tests" className="rounded-xl py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/50 font-bold text-sm">
                    Test Menu
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="rounded-xl py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-200/50 font-bold text-sm">
                    Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                    <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Appointment Ledger</h3>
                        <p className="text-sm text-slate-500 mt-1">Real-time view of scheduled patient visits.</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl text-primary font-bold px-4" onClick={refreshAppointments}>
                        Refresh
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="px-4 pb-8">
                        <AppointmentsList
                          labId={id || ""}
                          appointments={appointments}
                          onStatusChange={refreshAppointments}
                          onSearch={() => { }}
                          onFilter={() => { }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tests" className="mt-0 focus-visible:outline-none">
                  <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                    <CardHeader className="px-8 pt-8 pb-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">Available Tests</h3>
                          <p className="text-sm text-slate-500 mt-1">Configure your laboratory's service offerings.</p>
                        </div>
                        <Button
                          className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20"
                          onClick={() => navigate(`/lab-owner/${id}/add-test`)}
                        >
                          + New Test
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      {tests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tests.map((test) => (
                            <div key={test.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all group">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{test.name}</h4>
                                  <p className="text-xs text-slate-500">{test.category}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-primary">₹{test.price}</p>
                                  {test.discountPrice && test.discountPrice < test.price && (
                                    <p className="text-[10px] text-green-600 font-bold">Offer: ₹{test.discountPrice}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-slate-100 font-medium">{test.sample_type}</span>
                                <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-slate-100 font-medium">{test.turnaround_time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-md mx-auto mb-6 text-slate-300">
                            <Shield size={40} />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 mb-2">No active tests found</h4>
                          <p className="text-sm text-slate-500 max-w-xs mx-auto mb-8">
                            Start adding tests to your laboratory menu to allow patients to book appointments.
                          </p>
                          <Button
                            variant="outline"
                            className="rounded-xl font-bold px-8 bg-white"
                            onClick={() => navigate(`/lab-owner/${id}/add-test`)}
                          >
                            Configure Menu
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reports" className="mt-0 focus-visible:outline-none">
                  <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                    <CardHeader className="px-8 pt-8 pb-6">
                      <h3 className="text-xl font-bold text-slate-900">Performance Analytics</h3>
                      <p className="text-sm text-slate-500 mt-1">Actionable insights into your lab's growth and operations.</p>
                    </CardHeader>
                    <CardContent className="p-8 pb-12">
                      <div className="relative group overflow-hidden rounded-[2rem] aspect-video bg-slate-900 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bbda38a5fbd7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay group-hover:scale-110 transition-transform duration-1000" />
                        <div className="text-center relative z-10 p-10">
                          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                            <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                            Feature Incoming
                          </div>
                          <h4 className="text-3xl font-extrabold text-white mb-4">Enterprise Reporting</h4>
                          <p className="text-slate-300 text-sm max-w-sm mx-auto mb-8">
                            We're currently calibrating advanced data models to provide you with pixel-perfect laboratory insights.
                          </p>
                          <Button className="rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold px-8">
                            Get Early Access
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LabDetail;
