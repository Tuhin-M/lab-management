import React, { useEffect, useState } from "react";
import {
  ClipboardList, Search, Filter, Download, Eye,
  CheckCircle2, Clock, XCircle, RefreshCcw, ChevronDown,
  Calendar, FlaskConical, User, Phone, ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { labOwnerAPI } from "@/services/api";
import { toast } from "sonner";
import { format } from "date-fns";
import LoadingFallback from "@/utils/LoadingFallback";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-50 text-blue-700 border-blue-100", icon: <Clock size={12} /> },
  completed: { label: "Completed", color: "bg-green-50 text-green-700 border-green-100", icon: <CheckCircle2 size={12} /> },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-100", icon: <XCircle size={12} /> },
  "in-progress": { label: "In Progress", color: "bg-amber-50 text-amber-700 border-amber-100", icon: <RefreshCcw size={12} /> },
};

const BookingsManager = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await labOwnerAPI.getLabBookings();
      setBookings(data || []);
      setFiltered(data || []);
    } catch (e) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    let result = bookings;
    if (statusFilter !== "all") result = result.filter(b => b.status === statusFilter);
    if (search) result = result.filter(b =>
      b.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.id?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await labOwnerAPI.updateAppointmentStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      toast.success(`Booking marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: bookings.length,
    scheduled: bookings.filter(b => b.status === "scheduled").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  if (loading) return <LoadingFallback />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ClipboardList className="text-primary" size={24} />
            Bookings
          </h2>
          <p className="text-slate-500 mt-1">Manage and track all patient test bookings.</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl h-10" onClick={fetchBookings}>
          <RefreshCcw size={16} /> Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-slate-700", bg: "bg-slate-50" },
          { label: "Scheduled", value: stats.scheduled, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Completed", value: stats.completed, color: "text-green-700", bg: "bg-green-50" },
          { label: "Cancelled", value: stats.cancelled, color: "text-red-700", bg: "bg-red-50" },
        ].map(s => (
          <Card key={s.label} className={`border-none shadow-sm ${s.bg}`}>
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-3xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            className="pl-9 h-10 rounded-xl border-slate-200"
            placeholder="Search by patient name or booking ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 h-10 rounded-xl border-slate-200">
            <Filter size={14} className="mr-2 text-slate-400" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="font-bold text-slate-700">Patient</TableHead>
              <TableHead className="font-bold text-slate-700">Date & Time</TableHead>
              <TableHead className="font-bold text-slate-700">Amount</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-slate-400 italic">
                  No bookings found.
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
                          <p className="text-xs text-slate-400">{b.id?.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Calendar size={13} className="text-slate-400" />
                        {b.booking_date ? format(new Date(b.booking_date), "dd MMM yyyy") : "—"}
                      </div>
                      {b.booking_time && (
                        <p className="text-xs text-slate-400 ml-5">{b.booking_time}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-slate-900">
                        ₹{(b.total_amount || 0).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusConf.color} border text-xs gap-1 font-semibold`}>
                        {statusConf.icon} {statusConf.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={b.status || "scheduled"}
                        onValueChange={val => handleStatusChange(b.id, val)}
                        disabled={updatingId === b.id}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs rounded-lg border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl text-sm">
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default BookingsManager;
