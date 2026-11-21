import React, { useEffect, useState, useMemo } from "react";
import {
  Users, Search, Filter, Download, Eye, Phone, Mail, MapPin,
  Calendar, FlaskConical, DollarSign, TrendingUp, UserCheck,
  UserPlus, FileText, CheckCircle2, Clock, XCircle, RefreshCcw,
  ChevronRight, Save, StickyNote
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, Cell, PieChart, Pie
} from "recharts";
import { labOwnerAPI } from "@/services/api";
import { toast } from "sonner";
import { format } from "date-fns";
import LoadingFallback from "@/utils/LoadingFallback";

export interface PatientRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age?: string | number;
  gender?: string;
  address?: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
  firstVisit: string;
  lastVisit: string;
  lastTestName: string;
  labsVisited: string[];
  type: "Returning" | "New";
  bookings: any[];
}

const PatientsManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rawBookings, setRawBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [labFilter, setLabFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [patientNote, setPatientNote] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchPatientData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data } = await labOwnerAPI.getLabBookings();
      setRawBookings(data || []);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Error loading patient records:", error);
      if (!silent) toast.error("Failed to load patient records");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
    const interval = setInterval(() => fetchPatientData(true), 15000);
    return () => clearInterval(interval);
  }, []);

  // Aggregate raw bookings into unique patient profiles
  const patients: PatientRecord[] = useMemo(() => {
    const patientMap: Record<string, PatientRecord> = {};

    rawBookings.forEach((b: any) => {
      // Key by phone or user_id or sanitized name
      const key = (b.patient_phone || b.user_id || b.patient_name || "unknown").trim();
      const labName = b.labs?.name || "Laboratory";
      const tests = Array.isArray(b.tests) ? b.tests : [];
      const testName = tests.length > 0 ? (tests[0].name || tests[0]) : "Diagnostic Test";
      const bookingDate = b.booking_date || (b.created_at ? b.created_at.split("T")[0] : "");

      if (!patientMap[key]) {
        patientMap[key] = {
          id: key,
          name: b.patient_name || "Patient",
          phone: b.patient_phone || "—",
          email: b.patient_email || "",
          age: b.patient_age || "",
          gender: b.patient_gender || "",
          address: b.address || "",
          totalBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          totalSpent: 0,
          firstVisit: bookingDate,
          lastVisit: bookingDate,
          lastTestName: testName,
          labsVisited: [labName],
          type: "New",
          bookings: [],
        };
      }

      const p = patientMap[key];
      p.totalBookings += 1;
      p.totalSpent += (b.total_amount || 0);
      if (b.status === "completed") p.completedBookings += 1;
      if (b.status === "cancelled") p.cancelledBookings += 1;

      if (!p.email && b.patient_email) p.email = b.patient_email;
      if (!p.age && b.patient_age) p.age = b.patient_age;
      if (!p.gender && b.patient_gender) p.gender = b.patient_gender;
      if (!p.address && b.address) p.address = b.address;

      if (bookingDate && (!p.lastVisit || bookingDate > p.lastVisit)) {
        p.lastVisit = bookingDate;
        p.lastTestName = testName;
      }
      if (bookingDate && (!p.firstVisit || bookingDate < p.firstVisit)) {
        p.firstVisit = bookingDate;
      }
      if (!p.labsVisited.includes(labName)) {
        p.labsVisited.push(labName);
      }

      p.bookings.push({
        id: b.id,
        date: bookingDate,
        time: b.booking_time,
        labName,
        totalAmount: b.total_amount || 0,
        status: b.status || "scheduled",
        paymentStatus: b.payment_status || "pending",
        homeCollection: b.home_collection,
        address: b.address,
        tests,
      });
    });

    return Object.values(patientMap).map(p => {
      p.type = p.totalBookings > 1 ? "Returning" : "New";
      // Sort bookings chronologically descending
      p.bookings.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      return p;
    });
  }, [rawBookings]);

  // Available Labs for filter
  const availableLabs = useMemo(() => {
    const set = new Set<string>();
    patients.forEach(p => p.labsVisited.forEach(l => set.add(l)));
    return Array.from(set);
  }, [patients]);

  // Filtered and Sorted Patients
  const filteredPatients = useMemo(() => {
    return patients
      .filter(p => {
        if (typeFilter !== "all" && p.type.toLowerCase() !== typeFilter.toLowerCase()) {
          return false;
        }
        if (labFilter !== "all" && !p.labsVisited.includes(labFilter)) {
          return false;
        }
        if (search) {
          const q = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchPhone = p.phone.toLowerCase().includes(q);
          const matchEmail = (p.email || "").toLowerCase().includes(q);
          const matchTest = p.lastTestName.toLowerCase().includes(q);
          return matchName || matchPhone || matchEmail || matchTest;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "spend") return b.totalSpent - a.totalSpent;
        if (sortBy === "visits") return b.totalBookings - a.totalBookings;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return (b.lastVisit || "").localeCompare(a.lastVisit || "");
      });
  }, [patients, search, typeFilter, labFilter, sortBy]);

  // Analytics Computations
  const totalUniquePatients = patients.length;
  const returningPatients = patients.filter(p => p.type === "Returning").length;
  const retentionRate = totalUniquePatients > 0 ? Math.round((returningPatients / totalUniquePatients) * 100) : 0;
  const totalPatientSpend = patients.reduce((acc, p) => acc + p.totalSpent, 0);
  const avgLtv = totalUniquePatients > 0 ? Math.round(totalPatientSpend / totalUniquePatients) : 0;

  // Demographics: Gender breakdown
  const genderData = useMemo(() => {
    const counts: Record<string, number> = { Male: 0, Female: 0, Other: 0 };
    patients.forEach(p => {
      const g = (p.gender || "").toLowerCase();
      if (g.startsWith("m")) counts.Male += 1;
      else if (g.startsWith("f")) counts.Female += 1;
      else counts.Other += 1;
    });
    return [
      { name: "Male", count: counts.Male, color: "#3B82F6" },
      { name: "Female", count: counts.Female, color: "#EC4899" },
      { name: "Other / Unspecified", count: counts.Other, color: "#94A3B8" },
    ].filter(d => d.count > 0);
  }, [patients]);

  // Demographics: Age Brackets
  const ageData = useMemo(() => {
    const brackets = {
      "18–30": 0,
      "31–45": 0,
      "46–60": 0,
      "60+": 0,
      "Unspecified": 0,
    };
    patients.forEach(p => {
      const age = Number(p.age);
      if (!age) brackets["Unspecified"] += 1;
      else if (age <= 30) brackets["18–30"] += 1;
      else if (age <= 45) brackets["31–45"] += 1;
      else if (age <= 60) brackets["46–60"] += 1;
      else brackets["60+"] += 1;
    });
    return Object.entries(brackets)
      .map(([range, count]) => ({ range, count }))
      .filter(d => d.count > 0);
  }, [patients]);

  // Handle Export to CSV
  const handleExportCSV = () => {
    if (patients.length === 0) {
      toast.error("No patient records to export");
      return;
    }
    const headers = ["Name", "Phone", "Email", "Age", "Gender", "Address", "Patient Type", "Total Bookings", "Completed Bookings", "Lifetime Spend (INR)", "First Visit", "Last Visit", "Recent Test"];
    const rows = patients.map(p => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.phone}"`,
      `"${p.email || ''}"`,
      `"${p.age || ''}"`,
      `"${p.gender || ''}"`,
      `"${(p.address || '').replace(/"/g, '""')}"`,
      `"${p.type}"`,
      p.totalBookings,
      p.completedBookings,
      p.totalSpent,
      `"${p.firstVisit}"`,
      `"${p.lastVisit}"`,
      `"${(p.lastTestName || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `patients_directory_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Patient directory exported to CSV");
  };

  // Load and save private clinical notes
  const openPatientDetail = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    const saved = localStorage.getItem(`lab_patient_notes_${patient.id}`);
    setPatientNote(saved || "");
  };

  const handleSaveNote = () => {
    if (!selectedPatient) return;
    localStorage.setItem(`lab_patient_notes_${selectedPatient.id}`, patientNote);
    toast.success("Clinical note saved for patient");
  };

  if (loading) return <LoadingFallback />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <Users className="text-primary" size={30} />
              Patients Management & Analytics
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-sm">
            Access previous patients, view lifetime clinical history, and monitor patient retention analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl gap-2 h-10 border-slate-200 text-xs font-semibold"
            onClick={handleExportCSV}
          >
            <Download size={15} /> Export Directory
          </Button>
          <Button
            variant="outline"
            className="rounded-xl gap-2 h-10 border-slate-200 text-xs font-semibold"
            onClick={() => fetchPatientData(false)}
          >
            <RefreshCcw size={15} /> Refresh
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Patients</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{totalUniquePatients}</p>
            <p className="text-xs text-slate-400 mt-1">Unique patients served</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Retention Rate</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{retentionRate}%</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">{returningPatients} returning patients</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Revenue</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <DollarSign size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">₹{totalPatientSpend.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Gross patient bookings</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Patient LTV</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">₹{avgLtv.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Lifetime spend per patient</p>
          </CardContent>
        </Card>
      </div>

      {/* Patient Analytics Charts */}
      {patients.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demographic Breakdown */}
          <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Gender Demographics</CardTitle>
              <CardDescription className="text-xs">Patient gender distribution</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={genderData} dataKey="count" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 text-xs mt-2">
                {genderData.map(g => (
                  <div key={g.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                    <span className="text-slate-600">{g.name}: <strong>{g.count}</strong></span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Age Distribution */}
          <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Age Distribution</CardTitle>
              <CardDescription className="text-xs">Patient volume across age brackets</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} name="Patients" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Retention & Frequency Breakdown */}
          <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Patient Retention</CardTitle>
              <CardDescription className="text-xs">First-time vs. repeat patient ratio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>First-time Patients</span>
                  <span>{totalUniquePatients - returningPatients} ({100 - retentionRate}%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${100 - retentionRate}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Returning / Repeat Patients</span>
                  <span>{returningPatients} ({retentionRate}%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${retentionRate}%` }} />
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 mt-4">
                <p className="font-semibold text-slate-800">Retention Insight</p>
                <p className="mt-0.5">
                  {retentionRate >= 40
                    ? "Strong patient loyalty! Repeat patients represent significant lifetime value."
                    : "Focus on automated health checkup reminders to boost recurring test bookings."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search, Filter & Segmentation Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <Input
            className="pl-10 h-11 rounded-xl border-slate-200 bg-white"
            placeholder="Search patient by name, mobile number, email, or test..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48 h-11 rounded-xl border-slate-200 bg-white text-xs font-semibold">
            <Filter size={14} className="mr-2 text-slate-400" />
            <SelectValue placeholder="All Patients" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs font-medium">
            <SelectItem value="all">All Patients ({patients.length})</SelectItem>
            <SelectItem value="returning">Returning ({returningPatients})</SelectItem>
            <SelectItem value="new">First-time ({patients.length - returningPatients})</SelectItem>
          </SelectContent>
        </Select>

        {availableLabs.length > 1 && (
          <Select value={labFilter} onValueChange={setLabFilter}>
            <SelectTrigger className="w-52 h-11 rounded-xl border-slate-200 bg-white text-xs font-semibold">
              <SelectValue placeholder="All Labs" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs font-medium">
              <SelectItem value="all">All Facilities</SelectItem>
              {availableLabs.map(lab => (
                <SelectItem key={lab} value={lab}>{lab}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48 h-11 rounded-xl border-slate-200 bg-white text-xs font-semibold">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs font-medium">
            <SelectItem value="recent">Most Recent Visit</SelectItem>
            <SelectItem value="spend">Highest Total Spend</SelectItem>
            <SelectItem value="visits">Most Visits</SelectItem>
            <SelectItem value="name">Alphabetical (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Patients Table */}
      <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="font-bold text-slate-700 text-xs">Patient Details</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs">Demographics</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs">Contact Info</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs">Visits & Retention</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs">Lifetime Spend</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs">Last Visit & Test</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs text-right">Records</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20 text-slate-400">
                  <Users className="mx-auto mb-2 text-slate-300" size={36} />
                  <p className="font-semibold text-slate-600 text-base">No patient records found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {search || typeFilter !== "all" || labFilter !== "all"
                      ? "Try adjusting search or filter options"
                      : "Patients who book appointments with your laboratory will be automatically indexed here with their full history."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map(p => (
                <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold text-sm border border-primary/20">
                        {p.name[0]?.toUpperCase() || "P"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 font-bold ${
                              p.type === "Returning"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {p.type}
                          </Badge>
                        </div>
                        {p.address && (
                          <p className="text-[11px] text-slate-400 max-w-[180px] truncate mt-0.5" title={p.address}>
                            {p.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-700 font-medium">
                      <span>{p.age ? `${p.age} yrs` : "Age: —"}</span>
                      {p.gender && <span className="capitalize text-slate-400 block">{p.gender}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5 text-xs">
                      {p.phone !== "—" ? (
                        <a
                          href={`tel:${p.phone}`}
                          className="font-semibold text-slate-800 hover:text-primary flex items-center gap-1"
                        >
                          <Phone size={11} className="text-slate-400" />
                          {p.phone}
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                      {p.email && (
                        <a
                          href={`mailto:${p.email}`}
                          className="text-slate-500 hover:text-primary flex items-center gap-1 text-[11px] truncate max-w-[150px]"
                          title={p.email}
                        >
                          <Mail size={10} className="text-slate-400" />
                          {p.email}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <span className="font-extrabold text-slate-900 block text-sm">
                        {p.totalBookings} visit{p.totalBookings > 1 ? "s" : ""}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        {p.completedBookings} completed
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-slate-900 text-sm">
                      ₹{p.totalSpent.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <span className="font-semibold text-slate-800 block">
                        {p.lastVisit ? format(new Date(p.lastVisit), "dd MMM yyyy") : "—"}
                      </span>
                      <span
                        className="text-[11px] text-slate-500 max-w-[150px] truncate block mt-0.5"
                        title={p.lastTestName}
                      >
                        {p.lastTestName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl h-8 px-3 text-xs font-semibold gap-1.5 border-slate-200 hover:bg-primary hover:text-white transition-colors"
                      onClick={() => openPatientDetail(p)}
                    >
                      <Eye size={13} /> View History
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Comprehensive Patient Detail & Medical History Modal */}
      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
            <DialogHeader className="border-b border-slate-100 pb-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl border border-primary/20">
                    {selectedPatient.name[0]?.toUpperCase() || "P"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <DialogTitle className="text-xl font-bold text-slate-900">
                        {selectedPatient.name}
                      </DialogTitle>
                      <Badge
                        variant="outline"
                        className={
                          selectedPatient.type === "Returning"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold"
                            : "bg-blue-50 text-blue-700 border-blue-200 text-xs font-bold"
                        }
                      >
                        {selectedPatient.type} Patient
                      </Badge>
                    </div>
                    <DialogDescription className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span>Phone: <strong>{selectedPatient.phone}</strong></span>
                      {selectedPatient.email && <span>• Email: <strong>{selectedPatient.email}</strong></span>}
                    </DialogDescription>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Patient Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Spend</span>
                  <span className="text-lg font-black text-primary block mt-0.5">₹{selectedPatient.totalSpent.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Visits</span>
                  <span className="text-lg font-black text-slate-900 block mt-0.5">{selectedPatient.totalBookings}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Completed</span>
                  <span className="text-lg font-black text-emerald-600 block mt-0.5">{selectedPatient.completedBookings}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Demographics</span>
                  <span className="text-sm font-bold text-slate-900 block mt-1">
                    {[selectedPatient.age ? `${selectedPatient.age}y` : "", selectedPatient.gender].filter(Boolean).join(", ") || "—"}
                  </span>
                </div>
              </div>

              {/* Address info if available */}
              {selectedPatient.address && (
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                    <MapPin size={13} className="text-primary" /> Primary Address
                  </span>
                  <p className="text-slate-600 pl-4">{selectedPatient.address}</p>
                </div>
              )}

              {/* Chronological Test & Visit History */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-primary" />
                  Chronological Test & Booking History ({selectedPatient.bookings.length})
                </h4>
                <div className="space-y-3">
                  {selectedPatient.bookings.map((booking, idx) => (
                    <div
                      key={booking.id || idx}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-2 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {booking.date ? format(new Date(booking.date), "dd MMM yyyy") : "Date not recorded"}
                            </span>
                            {booking.time && (
                              <span className="text-xs text-slate-400 font-mono">at {booking.time}</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{booking.labName}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-slate-900 text-sm">₹{booking.totalAmount.toLocaleString()}</span>
                          <div className="flex gap-1.5 mt-1 justify-end">
                            <Badge
                              className={`text-[10px] font-bold ${
                                booking.status === "completed"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : booking.status === "cancelled"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              {booking.status}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                              {booking.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Tests in this booking */}
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tests Performed:</span>
                        <div className="space-y-1">
                          {Array.isArray(booking.tests) && booking.tests.length > 0 ? (
                            booking.tests.map((t: any, i: number) => (
                              <div key={i} className="flex justify-between items-center text-xs text-slate-700">
                                <span className="flex items-center gap-1.5 font-medium">
                                  <FlaskConical size={12} className="text-primary" />
                                  {t.name || t}
                                </span>
                                {t.price && <span className="font-semibold text-slate-800">₹{t.price}</span>}
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">Diagnostic Test</span>
                          )}
                        </div>
                      </div>

                      {/* Collection type */}
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                        <span className="font-semibold">Collection:</span>
                        <span>{booking.homeCollection ? "Home Sample Collection" : "Lab Visit"}</span>
                        {booking.address && <span className="text-slate-400">• {booking.address}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Private Clinical / Lab Notes */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <StickyNote size={14} className="text-primary" /> Private Clinical & Lab Notes
                  </span>
                  <span className="text-[10px] text-slate-400">Visible only to your lab staff</span>
                </div>
                <textarea
                  className="w-full h-20 p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Record patient notes (e.g., fasting preferences, follow-up recommendations, allergies, VIP patient status)..."
                  value={patientNote}
                  onChange={e => setPatientNote(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="rounded-xl h-8 text-xs font-semibold gap-1.5"
                    onClick={handleSaveNote}
                  >
                    <Save size={13} /> Save Clinical Note
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PatientsManager;
