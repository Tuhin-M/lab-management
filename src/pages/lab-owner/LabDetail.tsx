import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Calendar,
  Pencil,
  FlaskConical,
  Clock,
  Droplet,
  Plus,
  Trash2,
  Timer,
  Edit2,
  FileSpreadsheet,
  Search,
  LayoutGrid,
  List,
  CheckCircle2
} from "lucide-react";
import { labOwnerAPI, labsAPI } from "@/services/api";
import { toast } from "sonner";
import AppointmentsList from "@/components/lab-owner/AppointmentsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { DEFAULT_LAB_IMAGE } from "@/constants/images";
import ExcelUploadModal from "@/components/lab-owner/ExcelUploadModal";

const LabDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [lab, setLab] = useState<any>(null);
  const [appointments, setAppointments] = useState([]);
  const [tests, setTests] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const hideNavbar = location.state?.fromDashboard;

  // Search, filter & view state for tests
  const [testSearchQuery, setTestSearchQuery] = useState("");
  const [testCategoryFilter, setTestCategoryFilter] = useState("ALL");
  const [testViewMode, setTestViewMode] = useState<"grid" | "table">("grid");

  // Pagination
  const TESTS_PER_PAGE = 10;
  const [testPage, setTestPage] = useState(1);

  // Determine active tab from URL path
  const initialTab = location.pathname.endsWith('/tests') ? 'tests' : 'appointments';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Formatting helpers
  const formatTurnaround = (val?: string) => {
    if (!val || val.trim() === '') return '';
    const trimmed = val.trim();
    if (/^\d+$/.test(trimmed)) return `${trimmed} hrs`;
    return trimmed;
  };

  const formatDuration = (val?: string) => {
    if (!val || val.trim() === '') return '';
    const trimmed = val.trim();
    if (/^\d+$/.test(trimmed)) return `${trimmed} mins`;
    return trimmed;
  };

  // Distinct categories available in current lab
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    tests.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats).sort();
  }, [tests]);

  // Filtered tests based on search and category
  const filteredLabTests = useMemo(() => {
    return tests.filter((t) => {
      const matchesSearch =
        !testSearchQuery ||
        t.name.toLowerCase().includes(testSearchQuery.toLowerCase()) ||
        (t.category && t.category.toLowerCase().includes(testSearchQuery.toLowerCase())) ||
        (t.sample_type && t.sample_type.toLowerCase().includes(testSearchQuery.toLowerCase()));

      const matchesCategory =
        testCategoryFilter === "ALL" || t.category === testCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [tests, testSearchQuery, testCategoryFilter]);

  // Reset to page 1 when search/filter changes
  const totalTestPages = Math.ceil(filteredLabTests.length / TESTS_PER_PAGE);
  const paginatedTests = filteredLabTests.slice(
    (testPage - 1) * TESTS_PER_PAGE,
    testPage * TESTS_PER_PAGE
  );

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
          phone: b.patient_phone || '',
          homeCollection: !!b.home_collection,
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
    if (!id) return;
    try {
      const { data: bookingsData } = await labOwnerAPI.getLabBookings(id);
      const normalized = (bookingsData || []).map((b: any) => ({
        _id: b.id,
        patientName: b.patient_name || 'Unknown Patient',
        phone: b.patient_phone || '',
        homeCollection: !!b.home_collection,
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
      toast.success('Appointments list refreshed');
    } catch (err) {
      console.error('Failed to refresh appointments:', err);
    }
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

          <div className={`grid gap-8 items-start ${activeTab === 'tests' ? 'lg:grid-cols-[280px_1fr]' : 'lg:grid-cols-3'}`}>
            {/* Left Column: Lab Info Card */}
            <div className="lg:col-span-1">
              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                {activeTab !== 'tests' && (
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
                )}

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
                          {[lab.address?.street, lab.address?.city, lab.address?.state].filter(Boolean).join(', ') || 'Location details pending'}
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
            <div className={activeTab !== 'tests' ? 'lg:col-span-2' : ''}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  <Card className="border border-slate-200/90 shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="px-8 pt-8 pb-6 border-b border-slate-200 bg-slate-50/80">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Available Tests</h3>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300">
                              {tests.length} {tests.length === 1 ? 'test' : 'tests'} active
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-600 mt-1">
                            Configure and manage your laboratory's diagnostic catalog, test pricing, and turnarounds.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            variant="outline"
                            className="rounded-xl font-bold px-4 h-11 border-teal-300 text-teal-800 bg-teal-50 hover:bg-teal-100 flex items-center gap-2 shadow-sm transition-all"
                            onClick={() => setShowUploadModal(true)}
                          >
                            <FileSpreadsheet className="w-4 h-4 text-teal-700" />
                            <span>Upload Excel Price List</span>
                          </Button>
                          <Button
                            className="rounded-xl font-bold px-5 h-11 shadow-lg shadow-teal-600/20 flex items-center gap-2 hover:scale-[1.02] transition-transform bg-teal-600 hover:bg-teal-700 text-white"
                            onClick={() => navigate(`/lab-owner/${id}/add-test`)}
                          >
                            <Plus className="w-4 h-4" /> Add New Test
                          </Button>
                        </div>
                      </div>

                      {/* Search & Filter Toolbar */}
                      {tests.length > 0 && (
                        <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                          <div className="flex flex-1 flex-wrap items-center gap-3">
                            <div className="relative flex-1 min-w-[240px] max-w-md">
                              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input
                                placeholder="Search test name, code, or specimen..."
                                value={testSearchQuery}
                                onChange={(e) => { setTestSearchQuery(e.target.value); setTestPage(1); }}
                                className="pl-10 h-10 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 font-medium focus-visible:ring-teal-500 text-sm shadow-sm"
                              />
                            </div>

                            {availableCategories.length > 1 && (
                              <select
                                value={testCategoryFilter}
                                onChange={(e) => { setTestCategoryFilter(e.target.value); setTestPage(1); }}
                                className="h-10 rounded-xl border border-slate-300 bg-white px-3.5 text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                              >
                                <option value="ALL">All Departments ({tests.length})</option>
                                {availableCategories.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5 self-end sm:self-center">
                            <span className="text-xs font-bold text-slate-500">
                              {filteredLabTests.length === 0 ? '0' : `${(testPage - 1) * TESTS_PER_PAGE + 1}–${Math.min(testPage * TESTS_PER_PAGE, filteredLabTests.length)}`} of {filteredLabTests.length}
                            </span>
                            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                              <button
                                onClick={() => setTestViewMode('grid')}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  testViewMode === 'grid'
                                    ? 'bg-teal-50 text-teal-700 font-bold'
                                    : 'text-slate-400 hover:text-slate-700'
                                }`}
                                title="Grid View"
                              >
                                <LayoutGrid className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setTestViewMode('table')}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  testViewMode === 'table'
                                    ? 'bg-teal-50 text-teal-700 font-bold'
                                    : 'text-slate-400 hover:text-slate-700'
                                }`}
                                title="Table View"
                              >
                                <List className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="p-8">
                      {tests.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50/70 rounded-[2rem] border-2 border-dashed border-slate-200">
                          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-md mx-auto mb-6 text-teal-600">
                            <FlaskConical size={36} />
                          </div>
                          <h4 className="text-xl font-extrabold text-slate-900 mb-2">No active tests added yet</h4>
                          <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto mb-6">
                            Publish test offerings, pricing, and turnaround times so patients can find and book tests at your laboratory.
                          </p>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Button
                              className="rounded-xl font-bold px-7 h-11 bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 gap-2"
                              onClick={() => setShowUploadModal(true)}
                            >
                              <FileSpreadsheet className="w-4 h-4" /> Upload Excel Price List (IQDx)
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-xl font-bold px-6 h-11 border-slate-300 text-slate-700 hover:bg-slate-50"
                              onClick={() => navigate(`/lab-owner/${id}/add-test`)}
                            >
                              <Plus className="w-4 h-4 mr-2" /> Add Single Test
                            </Button>
                          </div>
                        </div>
                      ) : filteredLabTests.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                          <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                          <h4 className="text-base font-bold text-slate-800">No matching tests found</h4>
                          <p className="text-xs text-slate-500 mt-1 mb-4">
                            Try adjusting your search query or department filter.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setTestSearchQuery('');
                              setTestCategoryFilter('ALL');
                            }}
                            className="rounded-xl text-xs font-bold"
                          >
                            Reset Filters
                          </Button>
                        </div>
                      ) : testViewMode === 'table' ? (
                        /* Table View */
                        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase text-xs tracking-wider border-b border-slate-200">
                              <tr>
                                <th className="py-3.5 px-4">Test Name</th>
                                <th className="py-3.5 px-4">Department</th>
                                <th className="py-3.5 px-4">Specimen</th>
                                <th className="py-3.5 px-4">Turnaround</th>
                                <th className="py-3.5 px-4 text-right">Price</th>
                                <th className="py-3.5 px-4 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {paginatedTests.map((test) => {
                                const testId = test.labTestId || test.id;
                                const hasDiscount = test.discountPrice && Number(test.discountPrice) < Number(test.price);
                                const finalPrice = hasDiscount ? Number(test.discountPrice) : Number(test.price);
                                const discountPercent = hasDiscount
                                  ? Math.round(((Number(test.price) - Number(test.discountPrice)) / Number(test.price)) * 100)
                                  : 0;

                                const formattedTAT = formatTurnaround(test.turnaround_time);

                                return (
                                  <tr key={testId} className="hover:bg-teal-50/30 transition-colors">
                                    <td className="py-3.5 px-4">
                                      <p className="font-extrabold text-slate-900 text-sm">{test.name}</p>
                                      {test.description && (
                                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{test.description}</p>
                                      )}
                                    </td>
                                    <td className="py-3.5 px-4">
                                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                        {test.category || 'Diagnostic'}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                      {test.sample_type ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                          <Droplet className="w-3.5 h-3.5 text-blue-600" />
                                          {test.sample_type}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 text-xs">—</span>
                                      )}
                                    </td>
                                    <td className="py-3.5 px-4">
                                      {formattedTAT ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                          <Clock className="w-3 h-3 text-teal-600" />
                                          {formattedTAT}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 text-xs">—</span>
                                      )}
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                      <span className="font-black text-slate-900 text-base">₹{finalPrice.toLocaleString()}</span>
                                      {hasDiscount && (
                                        <span className="block text-xs font-semibold text-slate-400 line-through">
                                          ₹{Number(test.price).toLocaleString()}
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button
                                          onClick={() => navigate(`/lab-owner/${id}/edit-test/${testId}`)}
                                          className="p-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 transition-colors"
                                          title="Edit test"
                                        >
                                          <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteTest(testId, test.name)}
                                          className="p-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-red-50 hover:text-red-700 border border-slate-200 transition-colors"
                                          title="Delete test"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        /* Grid View - Clear, Spacious Cards (single column for readability) */
                        <div className="space-y-4">
                          {paginatedTests.map((test) => {
                            const testId = test.labTestId || test.id;
                            const hasDiscount = test.discountPrice && Number(test.discountPrice) < Number(test.price);
                            const finalPrice = hasDiscount ? Number(test.discountPrice) : Number(test.price);
                            const discountPercent = hasDiscount
                              ? Math.round(((Number(test.price) - Number(test.discountPrice)) / Number(test.price)) * 100)
                              : 0;

                            const formattedTAT = formatTurnaround(test.turnaround_time);
                            const formattedDuration = formatDuration(test.duration);

                            return (
                              <div
                                key={testId}
                                className="group flex items-start gap-5 p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-200"
                              >
                                {/* Flask Icon */}
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200/80 shadow-sm group-hover:scale-105 transition-transform mt-0.5">
                                  <FlaskConical className="w-5 h-5" />
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 min-w-0">
                                  {/* Name + Dept badge */}
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                                      {test.name}
                                    </h4>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                                      {test.category || "Diagnostic"}
                                    </span>
                                  </div>

                                  {/* Description */}
                                  {test.description && test.description.trim() !== "" && (
                                    <p className="text-sm text-slate-500 leading-relaxed mb-2">
                                      {test.description}
                                    </p>
                                  )}

                                  {/* Meta badges */}
                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    {test.sample_type && test.sample_type.trim() !== "" && (
                                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200">
                                        <Droplet className="w-3 h-3 text-blue-600" />
                                        {test.sample_type}
                                      </span>
                                    )}
                                    {formattedTAT && (
                                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-lg border border-teal-200">
                                        <Clock className="w-3 h-3 text-teal-600" />
                                        {formattedTAT}
                                      </span>
                                    )}
                                    {formattedDuration && (
                                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                                        <Timer className="w-3 h-3 text-amber-600" />
                                        {formattedDuration}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Right: Price + Actions */}
                                <div className="flex flex-col items-end gap-3 shrink-0 ml-2">
                                  <div className="text-right">
                                    <div className="flex items-baseline gap-1.5 justify-end">
                                      <span className="text-xl font-black text-slate-900">₹{finalPrice.toLocaleString()}</span>
                                      {hasDiscount && (
                                        <span className="text-xs font-semibold text-slate-400 line-through">₹{Number(test.price).toLocaleString()}</span>
                                      )}
                                    </div>
                                    {hasDiscount && (
                                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                                        {discountPercent}% OFF
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => navigate(`/lab-owner/${id}/edit-test/${testId}`)}
                                      className="p-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 hover:border-teal-300 transition-all"
                                      title="Edit test"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTest(testId, test.name)}
                                      className="p-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-700 border border-slate-200 hover:border-red-300 transition-all"
                                      title="Delete test"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Pagination Controls */}
                      {totalTestPages > 1 && (
                        <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-200">
                          <span className="text-xs text-slate-500 font-medium">
                            Page {testPage} of {totalTestPages} &nbsp;·&nbsp; {filteredLabTests.length} tests
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setTestPage(p => Math.max(1, p - 1))}
                              disabled={testPage === 1}
                              className="px-3 h-8 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              ← Prev
                            </button>
                            {Array.from({ length: totalTestPages }, (_, i) => i + 1)
                              .filter(p => p === 1 || p === totalTestPages || Math.abs(p - testPage) <= 1)
                              .reduce<(number | 'e')[]>((acc, p, idx, arr) => {
                                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('e');
                                acc.push(p);
                                return acc;
                              }, [])
                              .map((p, idx) =>
                                p === 'e' ? (
                                  <span key={`el-${idx}`} className="px-1 text-slate-400 text-xs">…</span>
                                ) : (
                                  <button
                                    key={p}
                                    onClick={() => setTestPage(p as number)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold border transition-colors ${
                                      testPage === p
                                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                    }`}
                                  >
                                    {p}
                                  </button>
                                )
                              )
                            }
                            <button
                              onClick={() => setTestPage(p => Math.min(totalTestPages, p + 1))}
                              disabled={testPage === totalTestPages}
                              className="px-3 h-8 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              Next →
                            </button>
                          </div>
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

      {/* Excel Price List Upload Modal */}
      <ExcelUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        labId={id || ""}
        labName={lab?.name || "Laboratory"}
        onSuccess={async () => {
          try {
            const { data: refreshedTests } = await labOwnerAPI.getLabTests(id!);
            setTests(refreshedTests || []);
            setActiveTab("tests");
          } catch (e) {
            console.error("Failed to reload tests:", e);
          }
        }}
      />
    </div>
  );
};

export default LabDetail;
