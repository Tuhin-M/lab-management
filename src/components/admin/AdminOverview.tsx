import React from 'react';
import {
  Users,
  Building2,
  Stethoscope,
  FlaskConical,
  ClipboardList,
  Calendar,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminAnalytics } from '@/services/adminService';
import { format } from 'date-fns';

interface AdminOverviewProps {
  analytics: AdminAnalytics | null;
  onNavigateTab: (tab: any) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ analytics, onNavigateTab }) => {
  if (!analytics) return null;

  const statsCards = [
    {
      title: 'Total Users',
      value: analytics.overview.totalUsers,
      sub: 'Patients & Staff',
      icon: <Users size={20} className="text-blue-600" />,
      bg: 'bg-blue-50/60',
      tab: 'users',
    },
    {
      title: 'Laboratories',
      value: analytics.overview.totalLabs,
      sub: 'Registered Labs',
      icon: <Building2 size={20} className="text-teal-600" />,
      bg: 'bg-teal-50/60',
      tab: 'labs',
    },
    {
      title: 'Doctors',
      value: analytics.overview.totalDoctors,
      sub: 'Verified Practitioners',
      icon: <Stethoscope size={20} className="text-indigo-600" />,
      bg: 'bg-indigo-50/60',
      tab: 'doctors',
    },
    {
      title: 'Master Tests',
      value: analytics.overview.totalMasterTests,
      sub: 'Catalog Definitions',
      icon: <FlaskConical size={20} className="text-amber-600" />,
      bg: 'bg-amber-50/60',
      tab: 'tests',
    },
    {
      title: 'Test Bookings',
      value: analytics.overview.totalBookings,
      sub: 'Lab Appointments',
      icon: <ClipboardList size={20} className="text-emerald-600" />,
      bg: 'bg-emerald-50/60',
      tab: 'bookings',
    },
    {
      title: 'Consultations',
      value: analytics.overview.totalAppointments,
      sub: 'Doctor Visits',
      icon: <Calendar size={20} className="text-purple-600" />,
      bg: 'bg-purple-50/60',
      tab: 'appointments',
    },
    {
      title: 'Platform GMV',
      value: `₹${(analytics.overview.totalRevenue || 0).toLocaleString()}`,
      sub: 'Gross Booking Value',
      icon: <DollarSign size={20} className="text-green-600" />,
      bg: 'bg-green-50/60',
      tab: 'bookings',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-xs mb-3">
            System Operations
          </Badge>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Ekitsa Platform Command Center
          </h2>
          <p className="text-slate-300 text-xs mt-1 leading-relaxed">
            Real-time administrative visibility across all registered diagnostic laboratories,
            verified healthcare providers, patient test bookings, and master catalog definitions.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card
            key={stat.title}
            onClick={() => onNavigateTab(stat.tab)}
            className="border-slate-200/80 shadow-xs hover:border-teal-500/50 hover:shadow-sm transition-all cursor-pointer rounded-2xl overflow-hidden group"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2 tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Breakdown & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Breakdown */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users size={16} className="text-primary" /> Users Breakdown
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab('users')}
              className="text-xs text-primary font-bold h-7 px-2"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {Object.entries(analytics.usersByRole).map(([role, count]) => {
              const label =
                role === 'lab_owner' ? 'Lab Owners' : role === 'doctor' ? 'Doctors' : role === 'admin' ? 'Admins' : 'Patients';
              const color =
                role === 'lab_owner' ? 'bg-teal-50 text-teal-700' : role === 'doctor' ? 'bg-indigo-50 text-indigo-700' : role === 'admin' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700';

              return (
                <div key={role} className="flex items-center justify-between text-xs py-1">
                  <span className="font-semibold text-slate-700">{label}</span>
                  <Badge variant="outline" className={`${color} border-transparent font-bold`}>
                    {count} users
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl md:col-span-2">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" /> Administrative Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('tests')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 text-left transition-all group flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <FlaskConical size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">Add Master Test</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Define new tests in the global catalog.</p>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('labs')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 text-left transition-all group flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">Lab Accreditation</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Approve and verify registered laboratories.</p>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('doctors')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 text-left transition-all group flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                <Stethoscope size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">Verify Doctors</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Review physician profiles and qualifications.</p>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('bookings')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 text-left transition-all group flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <ClipboardList size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">Inspect Bookings</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Track patient test fulfillment & home collections.</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Test Bookings */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList size={16} className="text-teal-600" /> Recent Lab Bookings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab('bookings')}
              className="text-xs text-primary font-bold h-7 px-2"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {analytics.recentBookings.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 italic">No bookings recorded yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {analytics.recentBookings.map((b: any) => (
                  <div key={b.id} className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{b.patient_name || 'Patient'}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {b.labs?.name || 'Lab'} • {b.booking_date ? format(new Date(b.booking_date), 'dd MMM yyyy') : '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹{(b.total_amount || 0).toLocaleString()}</p>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold mt-0.5">
                        {b.status || 'scheduled'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Doctor Appointments */}
        <Card className="border-slate-200/80 shadow-xs rounded-2xl">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar size={16} className="text-indigo-600" /> Recent Consultations
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab('appointments')}
              className="text-xs text-primary font-bold h-7 px-2"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {analytics.recentAppointments.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 italic">No consultations recorded yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {analytics.recentAppointments.map((a: any) => (
                  <div key={a.id} className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{a.patient_name || 'Patient'}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {a.doctors?.name || 'Doctor'} • {a.appointment_date ? format(new Date(a.appointment_date), 'dd MMM yyyy') : '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹{(a.amount || 0).toLocaleString()}</p>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold mt-0.5">
                        {a.status || 'scheduled'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
