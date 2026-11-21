import React, { useEffect, useState } from "react";
import {
  ClipboardList, Search, Filter, Eye,
  CheckCircle2, Clock, XCircle, RefreshCcw,
  Calendar, FlaskConical, User, Phone, MapPin, Mail, CreditCard, Home, Building2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { labOwnerAPI } from "@/services/api";
import { toast } from "sonner";
import { format } from "date-fns";
import LoadingFallback from "@/utils/LoadingFallback";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-50 text-blue-700 border-blue-200", icon: <Clock size={12} /> },
  sample_collected: { label: "Sample Collected", color: "bg-purple-50 text-purple-700 border-purple-200", icon: <FlaskConical size={12} /> },
  in_progress: { label: "Testing in Progress", color: "bg-amber-50 text-amber-700 border-amber-200", icon: <RefreshCcw size={12} /> },
  "in-progress": { label: "Testing in Progress", color: "bg-amber-50 text-amber-700 border-amber-200", icon: <RefreshCcw size={12} /> },
  completed: { label: "Completed", color: "bg-green-50 text-green-700 border-green-200", icon: <CheckCircle2 size={12} /> },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-200", icon: <XCircle size={12} /> },
};

const BookingsManager = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchBookings = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data } = await labOwnerAPI.getLabBookings();
      setBookings(data || []);
      setLastRefreshed(new Date());
    } catch (e) {
      if (!silent) toast.error("Failed to load bookings");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // Live polling every 10 seconds for real-time incoming test bookings
    const interval = setInterval(() => {
      fetchBookings(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let result = bookings;
    if (statusFilter !== "all") {
      result = result.filter(b => {
        if (statusFilter === "in_progress") {
          return b.status === "in_progress" || b.status === "in-progress";
        }
        return b.status === statusFilter;
      });
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.patient_name?.toLowerCase().includes(q) ||
        b.id?.toLowerCase().includes(q) ||
        b.patient_phone?.includes(q)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await labOwnerAPI.updateAppointmentStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev: any) => ({ ...prev, status }));
      }
      toast.success(`Booking status updated to "${status.replace('_', ' ')}"`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: bookings.length,
    scheduled: bookings.filter(b => b.status === "scheduled" || b.status === "confirmed").length,
    sampleCollected: bookings.filter(b => b.status === "sample_collected").length,
    inProgress: bookings.filter(b => b.status === "in_progress" || b.status === "in-progress").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  if (loading) return <LoadingFallback />;

  return (
    <div className="space-y-6">
      {/* Live Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <ClipboardList className="text-primary" size={24} />
              Live Test Bookings
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-sm">
            Real-time incoming patient test bookings across your registered laboratories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <Button variant="outline" className="gap-2 rounded-xl h-10 border-slate-200 text-xs font-semibold" onClick={() => fetchBookings(false)}>
            <RefreshCcw size={14} /> Refresh Now
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Orders", value: stats.total, color: "text-slate-800", bg: "bg-white", border: "border-slate-200" },
          { label: "Scheduled", value: stats.scheduled, color: "text-blue-700", bg: "bg-blue-50/50", border: "border-blue-100" },
          { label: "Sample Collected", value: stats.sampleCollected, color: "text-purple-700", bg: "bg-purple-50/50", border: "border-purple-100" },
          { label: "In Testing", value: stats.inProgress, color: "text-amber-700", bg: "bg-amber-50/50", border: "border-amber-100" },
          { label: "Completed", value: stats.completed, color: "text-green-700", bg: "bg-green-50/50", border: "border-green-100" },
        ].map(s => (
          <Card key={s.label} className={`border shadow-sm rounded-2xl ${s.bg} ${s.border}`}>
            <CardContent className="p-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            className="pl-9 h-10 rounded-xl border-slate-200 bg-white"
            placeholder="Search by patient name, phone, or booking ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-52 h-10 rounded-xl border-slate-200 bg-white text-xs font-semibold">
            <Filter size={14} className="mr-2 text-slate-400" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs font-medium">
            <SelectItem value="all">All Statuses ({bookings.length})</SelectItem>
            <SelectItem value="scheduled">Scheduled ({stats.scheduled})</SelectItem>
            <SelectItem value="sample_collected">Sample Collected ({stats.sampleCollected})</SelectItem>
            <SelectItem value="in_progress">Testing in Progress ({stats.inProgress})</SelectItem>
            <SelectItem value="completed">Completed ({stats.completed})</SelectItem>
            <SelectItem value="cancelled">Cancelled ({stats.cancelled})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings Table */}
      <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="font-bold text-slate-700 text-xs">Patient</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs">Tests Booked</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs">Date & Time</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs">Type</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs">Amount</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs">Status</TableHead>
              <TableHead className="font-bold text-slate-700 text-xs text-right">Update Lifecycle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20 text-slate-400">
                  <ClipboardList className="mx-auto mb-2 text-slate-300" size={32} />
                  <p className="font-semibold text-slate-600">No bookings found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {search || statusFilter !== "all" ? "Try clearing search filters" : "Incoming patient test bookings will appear here automatically."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(b => {
                const statusConf = STATUS_CONFIG[b.status] || STATUS_CONFIG.scheduled;
                return (
                  <TableRow key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {(b.patient_name || "P")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{b.patient_name || "Unknown"}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Phone size={10} /> {b.patient_phone || "No phone"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {Array.isArray(b.tests) && b.tests.length > 0 ? (
                        <div className="space-y-0.5">
                          {b.tests.slice(0, 2).map((t: any, i: number) => (
                            <p key={i} className="text-xs font-medium text-slate-800 flex items-center gap-1">
                              <FlaskConical size={11} className="text-primary shrink-0" />
                              {t.name || t}
                            </p>
                          ))}
                          {b.tests.length > 2 && (
                            <span className="text-[10px] text-slate-400">+{b.tests.length - 2} more test(s)</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Diagnostic Test</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                        <Calendar size={12} className="text-slate-400" />
                        {b.booking_date ? format(new Date(b.booking_date), "dd MMM yyyy") : "—"}
                      </div>
                      {b.booking_time && (
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5 ml-4">{b.booking_time}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      {b.home_collection ? (
                        <div>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[11px] gap-1">
                            <Home size={10} /> Home Visit
                          </Badge>
                          {b.address && (
                            <p className="text-[10px] text-slate-500 mt-1 max-w-[140px] truncate" title={b.address}>
                              {b.address}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[11px] gap-1">
                          <Building2 size={10} /> Lab Center
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-extrabold text-slate-900 text-sm">
                        ₹{(b.total_amount || 0).toLocaleString()}
                      </span>
                      <p className="text-[10px] text-slate-400 capitalize">{b.payment_status || "pending"}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusConf.color} border text-xs gap-1 font-semibold`}>
                        {statusConf.icon} {statusConf.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-primary rounded-lg"
                          onClick={() => setSelectedBooking(b)}
                          title="View Details"
                        >
                          <Eye size={15} />
                        </Button>
                        <Select
                          value={b.status === "confirmed" ? "scheduled" : (b.status === "in-progress" ? "in_progress" : b.status || "scheduled")}
                          onValueChange={val => handleStatusChange(b.id, val)}
                          disabled={updatingId === b.id}
                        >
                          <SelectTrigger className="w-40 h-8 text-xs font-semibold rounded-lg border-slate-200 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent align="end" className="rounded-xl text-xs font-medium">
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="sample_collected">Sample Collected</SelectItem>
                            <SelectItem value="in_progress">Testing in Progress</SelectItem>
                            <SelectItem value="completed">Completed / Ready</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-lg rounded-2xl p-6">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg font-bold text-slate-900">Booking Details</DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">ID: {selectedBooking.id}</DialogDescription>
                </div>
                <Badge className={`${(STATUS_CONFIG[selectedBooking.status] || STATUS_CONFIG.scheduled).color} border text-xs font-bold`}>
                  {(STATUS_CONFIG[selectedBooking.status] || STATUS_CONFIG.scheduled).label}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Patient Info */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Patient Information</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block">Name</span>
                    <span className="font-semibold text-slate-900">{selectedBooking.patient_name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Phone</span>
                    <span className="font-semibold text-slate-900">{selectedBooking.patient_phone || "—"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Date & Time</span>
                    <span className="font-medium text-slate-800">
                      {selectedBooking.booking_date} {selectedBooking.booking_time ? `(${selectedBooking.booking_time})` : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Collection</span>
                    <span className="font-medium text-slate-800">
                      {selectedBooking.home_collection ? "Home Collection" : "Lab Visit"}
                    </span>
                  </div>
                </div>
                {selectedBooking.home_collection && selectedBooking.address && (
                  <div className="pt-2 border-t border-slate-200/60 text-xs">
                    <span className="text-slate-400 block font-medium">Home Delivery Address:</span>
                    <span className="text-slate-800 mt-0.5 block">{selectedBooking.address}</span>
                  </div>
                )}
              </div>

              {/* Tests */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tests ({Array.isArray(selectedBooking.tests) ? selectedBooking.tests.length : 1})
                </p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {Array.isArray(selectedBooking.tests) && selectedBooking.tests.length > 0 ? (
                    selectedBooking.tests.map((t: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-slate-100 last:border-0">
                        <span className="font-medium text-slate-800">{t.name || t}</span>
                        <span className="font-bold text-primary">{t.price ? `₹${t.price}` : ""}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">Diagnostic Test</p>
                  )}
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-sm">
                  <span>Total Amount:</span>
                  <span className="text-primary text-base">₹{(selectedBooking.total_amount || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Update Booking Status</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant={selectedBooking.status === "sample_collected" ? "default" : "outline"}
                    className="text-xs h-9 rounded-xl"
                    onClick={() => handleStatusChange(selectedBooking.id, "sample_collected")}
                  >
                    Sample Collected
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedBooking.status === "in_progress" ? "default" : "outline"}
                    className="text-xs h-9 rounded-xl"
                    onClick={() => handleStatusChange(selectedBooking.id, "in_progress")}
                  >
                    In Testing
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedBooking.status === "completed" ? "default" : "outline"}
                    className="text-xs h-9 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleStatusChange(selectedBooking.id, "completed")}
                  >
                    Ready / Done
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

export default BookingsManager;
