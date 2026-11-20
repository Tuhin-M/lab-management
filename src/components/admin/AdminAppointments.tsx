import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Stethoscope,
  Clock,
  User,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AdminAppointmentsProps {
  appointments: any[];
  onRefresh: () => void;
  isLoading?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  completed: { label: 'Completed', color: 'bg-green-50 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' },
};

export const AdminAppointments: React.FC<AdminAppointmentsProps> = ({
  appointments,
  onRefresh,
  isLoading,
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = appointments.filter((a) => {
    return statusFilter === 'all' || a.status === statusFilter;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      await adminService.updateAppointmentStatus(id, newStatus);
      toast.success(`Consultation status updated to ${newStatus}`);
      onRefresh();
    } catch {
      toast.error('Failed to update consultation status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Doctor Teleconsultations Oversight</h3>
          <p className="text-xs text-slate-500">Live feed of doctor bookings and online consultations.</p>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 h-10 rounded-xl border-slate-200 bg-white text-xs font-semibold">
            <Filter size={13} className="mr-1.5 text-slate-400" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl text-xs">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 text-xs">
              <TableHead className="font-bold text-slate-700">Patient</TableHead>
              <TableHead className="font-bold text-slate-700">Doctor</TableHead>
              <TableHead className="font-bold text-slate-700">Specialty</TableHead>
              <TableHead className="font-bold text-slate-700">Date & Time</TableHead>
              <TableHead className="font-bold text-slate-700">Fee</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-slate-400 text-xs italic">
                  Loading consultations...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-slate-400 text-xs italic">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => {
                const conf = STATUS_CONFIG[a.status] || STATUS_CONFIG.scheduled;
                return (
                  <TableRow key={a.id} className="hover:bg-slate-50/50 text-xs transition-colors">
                    <TableCell>
                      <p className="font-bold text-slate-900">{a.patient_name || 'Patient'}</p>
                      <p className="text-[11px] text-slate-400">{a.patient_phone || a.id.slice(0, 8)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <Stethoscope size={13} />
                        </div>
                        <span className="font-semibold text-slate-800">{a.doctors?.name || 'Doctor'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-indigo-50/50 text-indigo-700 border-indigo-200">
                        {a.doctors?.specialty || 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-slate-700">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{a.appointment_date ? format(new Date(a.appointment_date), 'dd MMM yyyy') : '—'}</span>
                      </div>
                      {a.appointment_time && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{a.appointment_time}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-900">₹{(a.amount || 0).toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${conf.color} font-bold text-[11px] rounded-lg`}>
                        {conf.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={a.status || 'scheduled'}
                        onValueChange={(val) => handleStatusChange(a.id, val)}
                        disabled={updatingId === a.id}
                      >
                        <SelectTrigger className="w-32 h-8 text-[11px] rounded-lg border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl text-xs">
                          <SelectItem value="scheduled">Scheduled</SelectItem>
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
