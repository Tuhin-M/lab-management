import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Shield, Calendar, Pencil, FlaskConical, Clock, Droplet, Plus, Trash2, Timer, Edit2 } from "lucide-react";
import { labOwnerAPI, labsAPI } from "@/services/api";
import { toast } from "sonner";
import AppointmentsList from "@/components/lab-owner/AppointmentsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DEFAULT_LAB_IMAGE } from "@/constants/images";

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
        const dbLab = await labsAPI.getLabById(id!);

        const mappedLab = {
          _id: dbLab.id,
          name: dbLab.name,
          description: dbLab.description || 'No description provided.',
          address: {
            street: dbLab.address_street || '',
            city: dbLab.address_city || '',
            state: dbLab.address_state || ''
          },
          contactInfo: {
            phone: dbLab.phone || '—',
            email: dbLab.email || '—',
            website: dbLab.website || ''
          },
          certifications: dbLab.facilities && dbLab.facilities.length > 0 ? dbLab.facilities : (dbLab.accredited ? ['NABL Accredited'] : []),
          operatingHours: {
            weekdays: { open: '08:00', close: '20:00' },
            weekends: { open: '09:00', close: '17:00' }
          },
          image: dbLab.image_url || null,
          rating: dbLab.rating || null,
          status: 'active'
        };

        setLab(mappedLab);

        // Fetch real bookings for this lab
        const { data: bookingsData } = await labOwnerAPI.getLabBookings(id!);
        const normalized = (bookingsData || []).map((b: any) => ({
          _id: b.id,
          patientName: b.patient_name || 'Unknown Patient',
          testName: Array.isArray(b.tests) && b.tests.length > 0
            ? b.tests.map((t: any) => t.name).join(', ')
            : 'N/A',
          date: b.booking_date,
          time: b.booking_time || '',
          status: b.status || 'scheduled',
          paymentStatus: b.payment_status || 'pending',
          amount: b.total_amount || 0
        }));
        setAppointments(normalized);

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

  const handleDeleteTest = async (labTestId: string, testName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${testName}" from this laboratory?`)) {
      return;
    }
    try {
      await labOwnerAPI.deleteLabTest(labTestId);
      toast.success(`Removed "${testName}" successfully`);
      setTests((prev) => prev.filter((t) => (t.labTestId || t.id) !== labTestId));
    } catch (err) {
      console.error("Failed to delete test:", err);
      toast.error("Failed to remove test");
    }
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
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate(`/lab-owner/edit-lab/${id}`)}
            className="rounded-xl gap-2 font-semibold shadow-md shadow-primary/20"
          >
            <Pencil size={15} />
            <span>Edit Lab Details</span>
          </Button>
        </header>
      )}

      <main className="flex-1 p-6 md:p-10 relative z-10">
        <div className="container max-w-6xl mx-auto">
          {hideNavbar && (
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                className="-ml-4 rounded-xl text-slate-500 hover:text-primary transition-colors group"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Exit Lab View</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate(`/lab-owner/edit-lab/${id}`)}
                className="rounded-xl gap-2 font-semibold shadow-md shadow-primary/20"
              >
                <Pencil size={15} />
                <span>Edit Lab Details</span>
              </Button>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3 items-start">
            {/* Left Column: Lab Info Card */}
            <div className="lg:col-span-1">
              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                <div className="aspect-video overflow-hidden relative group">
                  <img
                    src={lab.image || (Array.isArray(lab.images) && lab.images[0]) || DEFAULT_LAB_IMAGE}
                    alt={lab.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_LAB_IMAGE;
                    }}
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
                      className="flex-1 rounded-xl h-11 text-xs font-bold gap-1.5"
                      onClick={() => navigate(`/lab-owner/edit-lab/${id}`)}
                    >
                      <Pencil size={14} />
                      Edit Details
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
                    <CardHeader className="px-8 pt-8 pb-6 border-b border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-slate-900">Available Tests</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
                              {tests.length} {tests.length === 1 ? 'test' : 'tests'} active
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">Configure and manage your laboratory's service offerings and pricing.</p>
                        </div>
                        <Button
                          className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-[1.02] transition-transform"
                          onClick={() => navigate(`/lab-owner/${id}/add-test`)}
                        >
                          <Plus className="w-4 h-4" /> Add New Test
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      {tests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tests.map((test) => {
                            const testId = test.labTestId || test.id;
                            const hasDiscount = test.discountPrice && Number(test.discountPrice) < Number(test.price);
                            const finalPrice = hasDiscount ? test.discountPrice : test.price;
                            const discountPercent = hasDiscount ? Math.round(((test.price - test.discountPrice) / test.price) * 100) : 0;

                            return (
                              <div
                                key={testId}
                                className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 border border-teal-100/60">
                                        <FlaskConical className="w-5 h-5" />
                                      </div>
                                      <div className="min-w-0">
                                        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-base truncate">
                                          {test.name}
                                        </h4>
                                        <span className="inline-block text-xs font-medium text-slate-500">
                                          {test.category || "Diagnostic Test"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => navigate(`/lab-owner/${id}/edit-test/${testId}`)}
                                        className="text-slate-300 hover:text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors shrink-0"
                                        title="Edit test details"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteTest(testId, test.name)}
                                        className="text-slate-300 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors shrink-0"
                                        title="Remove test from lab"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {test.description && test.description.trim() !== "" && (
                                    <p className="text-xs text-slate-500 line-clamp-2 mt-2.5 pl-0.5">
                                      {test.description}
                                    </p>
                                  )}

                                  {/* Badges: only render when string exists and is non-empty */}
                                  <div className="flex flex-wrap items-center gap-2 mt-3.5">
                                    {test.sample_type && test.sample_type.trim() !== "" && (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                                        <Droplet className="w-3 h-3 text-teal-600" />
                                        {test.sample_type}
                                      </span>
                                    )}
                                    {test.turnaround_time && test.turnaround_time.trim() !== "" && (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg border border-teal-100">
                                        <Clock className="w-3 h-3 text-teal-600" />
                                        {test.turnaround_time}
                                      </span>
                                    )}
                                    {test.duration && test.duration.trim() !== "" && (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-100">
                                        <Timer className="w-3 h-3 text-amber-600" />
                                        {test.duration}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-3.5 mt-4 border-t border-slate-100">
                                  <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Price</span>
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-lg font-extrabold text-slate-900">
                                        ₹{finalPrice}
                                      </span>
                                      {hasDiscount && (
                                        <span className="text-xs text-slate-400 line-through">
                                          ₹{test.price}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {hasDiscount && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      {discountPercent}% OFF
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-20 bg-slate-50/70 rounded-[2rem] border-2 border-dashed border-slate-200">
                          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-md mx-auto mb-6 text-teal-500/80">
                            <FlaskConical size={36} />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 mb-2">No active tests added yet</h4>
                          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                            Publish test offerings, pricing, and turnaround times so patients can find and book tests at your laboratory.
                          </p>
                          <Button
                            className="rounded-xl font-bold px-8 shadow-lg shadow-primary/20"
                            onClick={() => navigate(`/lab-owner/${id}/add-test`)}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add Your First Test
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
