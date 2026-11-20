import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Calendar,
  Building2,
  Clock,
  FlaskConical,
  Eye,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AdminBookingsProps {
  bookings: any[];
  onRefresh: () => void;
  isLoading?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  completed: { label: 'Completed', color: 'bg-green-50 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' },
  'in-progress': { label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export const AdminBookings: React.FC<AdminBookingsProps> = ({ bookings, onRefresh, isLoading }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      !search ||
      b.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.patient_phone?.includes(search) ||
      b.labs?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      await adminService.updateBookingStatus(id, newStatus);
      toast.success(`Booking status changed to ${newStatus}`);
      onRefresh();
    } catch {
      toast.error('Failed to update booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient, phone, or laboratory name..."
            className="pl-9 h-10 rounded-xl border-slate-200 bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 h-10 rounded-xl border-slate-200 bg-white text-xs font-semibold">
              <Filter size={13} className="mr-1.5 text-slate-400" />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings Table */}
      <Card className="border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 text-xs">
              <TableHead className="font-bold text-slate-700">Patient</TableHead>
              <TableHead className="font-bold text-slate-700">Laboratory</TableHead>
              <TableHead className="font-bold text-slate-700">Date & Slot</TableHead>
              <TableHead className="font-bold text-slate-700">Collection</TableHead>
              <TableHead className="font-bold text-slate-700">Amount</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-slate-400 text-xs italic">
                  Loading test bookings...
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-slate-400 text-xs italic">
                  No bookings match the filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((b) => {
                const conf = STATUS_CONFIG[b.status] || STATUS_CONFIG.scheduled;
                return (
                  <TableRow key={b.id} className="hover:bg-slate-50/50 text-xs transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {(b.patient_name || 'P')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{b.patient_name || 'Unknown'}</p>
                          <p className="text-[11px] text-slate-400">{b.patient_phone || b.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-slate-800">{b.labs?.name || 'Laboratory'}</p>
                      <p className="text-[11px] text-slate-400">{b.labs?.address_city || 'City'}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-slate-700">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{b.booking_date ? format(new Date(b.booking_date), 'dd MMM yyyy') : '—'}</span>
                      </div>
                      {b.booking_time && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{b.booking_time}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      {b.home_collection ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[10px]">
                          Home Collection
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-500 text-[10px]">
                          Lab Visit
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-900">₹{(b.total_amount || 0).toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${conf.color} font-bold text-[11px] rounded-lg`}>
                        {conf.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={b.status || 'scheduled'}
                          onValueChange={(val) => handleStatusChange(b.id, val)}
                          disabled={updatingId === b.id}
                        >
                          <SelectTrigger className="w-32 h-8 text-[11px] rounded-lg border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl text-xs">
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedBooking(b);
                            setIsDetailOpen(true);
                          }}
                          className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-slate-900"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </Button>
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
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Booking Details</DialogTitle>
            <DialogDescription className="text-xs">
              Complete patient test booking record and collection address.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking ID:</span>
                  <span className="font-mono text-slate-800">{selectedBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-900">{selectedBooking.patient_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="text-slate-800 font-medium">{selectedBooking.patient_phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Laboratory:</span>
                  <span className="font-semibold text-slate-800">{selectedBooking.labs?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Collection Type:</span>
                  <span className="font-bold text-slate-800">
                    {selectedBooking.home_collection ? 'Home Collection' : 'Lab Visit'}
                  </span>
                </div>
                {selectedBooking.tests?.[0]?.address && (
                  <div className="flex flex-col gap-1 pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-semibold">Home Address:</span>
                    <p className="text-slate-800 bg-white p-2 rounded-lg border border-slate-200 leading-relaxed">
                      {selectedBooking.tests[0].address}
                    </p>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-semibold">Total Amount:</span>
                  <span className="font-bold text-teal-700 text-sm">
                    ₹{(selectedBooking.total_amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Tests Included */}
              <div>
                <h4 className="font-bold text-slate-700 mb-2">Booked Tests</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {Array.isArray(selectedBooking.tests) && selectedBooking.tests.length > 0 ? (
                    selectedBooking.tests.map((t: any, i: number) => (
                      <div key={i} className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                        <span className="font-medium text-slate-800">{t.name || 'Diagnostic Test'}</span>
                        <span className="font-bold text-slate-700">₹{t.price || 0}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">No specific tests listed</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDetailOpen(false)}
              className="rounded-xl text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
