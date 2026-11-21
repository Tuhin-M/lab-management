import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Loader, ErrorMessage } from '../../components/ui';
import { Activity, Clipboard, Clock, DollarSign } from 'react-feather';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface Lab {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  tests: Array<{
    id: string | number;
    name: string;
    price: number;
  }>;
  stats: {
    totalAppointments: number;
    totalTests: number;
    totalRevenue: number;
    pendingAppointments: number;
  };
  analytics: Array<{
    month: string;
    tests: number;
    revenue: number;
  }>;
  appointments: Array<{
    id: string;
    patient: string;
    test: string;
    date: string;
    status: string;
  }>;
}

interface LabResponse {
  data: Lab;
}

export default function SingleLabDashboard() {
  const { labId } = useParams();
  const navigate = useNavigate();
  
  const { data: labResponse, isLoading, error } = useQuery<LabResponse>(['lab', labId], async () => {
    if (!labId) throw new Error('Lab ID is required');

    const { data: labData, error: labErr } = await supabase
      .from('labs')
      .select('*, lab_tests(*, tests(*))')
      .eq('id', labId)
      .single();

    if (labErr) throw labErr;

    const { data: bookingsData } = await supabase
      .from('test_bookings')
      .select('*')
      .eq('lab_id', labId)
      .order('created_at', { ascending: false });

    const bookings = bookingsData || [];
    const totalRevenue = bookings.reduce((acc: number, b: any) => acc + (b.total_amount || 0), 0);
    const pendingCount = bookings.filter(
      (b: any) => (b.status || '').toLowerCase() === 'scheduled' || (b.status || '').toLowerCase() === 'pending'
    ).length;

    const tests = (labData.lab_tests || []).map((lt: any) => ({
      id: lt.id,
      name: lt.tests?.name || 'Diagnostic Test',
      price: lt.price || lt.tests?.market_price || 0,
    }));

    const appointments = bookings.slice(0, 10).map((b: any) => ({
      id: b.id,
      patient: b.patient_name || 'Patient',
      test: Array.isArray(b.tests) && b.tests.length > 0 ? (b.tests[0]?.name || b.tests[0] || 'Test') : 'Diagnostic Test',
      date: b.booking_date || (b.created_at ? new Date(b.created_at).toLocaleDateString() : '-'),
      status: b.status || 'Scheduled',
    }));

    const monthsMap: Record<string, { tests: number; revenue: number }> = {};
    bookings.forEach((b: any) => {
      const d = b.created_at ? new Date(b.created_at) : new Date();
      const m = d.toLocaleString('default', { month: 'short' });
      if (!monthsMap[m]) monthsMap[m] = { tests: 0, revenue: 0 };
      monthsMap[m].tests += Array.isArray(b.tests) ? b.tests.length : 1;
      monthsMap[m].revenue += b.total_amount || 0;
    });

    const analytics = Object.entries(monthsMap).map(([month, val]) => ({
      month,
      tests: val.tests,
      revenue: val.revenue,
    }));

    return {
      data: {
        _id: labData.id,
        name: labData.name,
        address: {
          street: labData.address_street || '',
          city: labData.address_city || '',
          state: labData.address_state || '',
          zip: labData.address_zip || '',
        },
        tests,
        stats: {
          totalAppointments: bookings.length,
          totalTests: tests.length,
          totalRevenue,
          pendingAppointments: pendingCount,
        },
        analytics,
        appointments,
      },
    };
  });

  const lab = labResponse?.data;
  if (isLoading) return <Loader />;
  if (error || !lab) return <ErrorMessage message="Failed to load lab data" />;

  return (
    <div className="p-6 pt-24 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{lab.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {[lab.address.street, lab.address.city, lab.address.state, lab.address.zip].filter(Boolean).join(', ') || 'No address provided'}
          </p>
        </div>
        <button 
          onClick={() => navigate('/lab-dashboard')}
          className="px-4 py-2 bg-gray-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Appointments</span>
            <Clipboard size={16} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{lab.stats.totalAppointments}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tests Available</span>
            <Activity size={16} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{lab.stats.totalTests}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Revenue</span>
            <DollarSign size={16} />
          </div>
          <p className="text-2xl font-bold text-slate-900">₹{lab.stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <Clock size={16} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{lab.stats.pendingAppointments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Tests & Revenue Trends</h3>
          {lab.analytics.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lab.analytics}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="tests" stroke="#6366F1" strokeWidth={2} name="Tests" />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue (₹)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center text-slate-400 text-sm italic">
              No historical trend data yet
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-900">Available Tests ({lab.tests.length})</h3>
            <button
              onClick={() => navigate(`/add-test/${lab._id}`)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              + Add Test
            </button>
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto max-h-60 pr-1">
            {lab.tests.length > 0 ? (
              lab.tests.map(test => (
                <div key={test.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm">
                  <span className="font-medium text-slate-800">{test.name}</span>
                  <span className="font-bold text-primary">₹{test.price}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm">No tests listed yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Recent Bookings</h3>
        {lab.appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Test</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lab.appointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-medium text-slate-900">{apt.patient}</td>
                    <td className="py-3 text-slate-600">{apt.test}</td>
                    <td className="py-3 text-slate-500">{apt.date}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase ${
                        apt.status.toLowerCase() === 'completed'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm italic">
            No bookings recorded yet for this laboratory
          </div>
        )}
      </div>
    </div>
  );
}
