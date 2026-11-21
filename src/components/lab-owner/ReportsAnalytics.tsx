import React, { useState, useEffect } from "react";
import {
  BarChart3, Users, FlaskConical, Calendar, Download,
  CheckCircle2, CreditCard, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { labOwnerAPI } from "@/services/api";
import LoadingFallback from "@/utils/LoadingFallback";

const StatCard = ({
  title, value, unit = "", icon, color
}: {
  title: string; value: string | number; unit?: string; icon: React.ReactNode; color: string;
}) => (
  <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{title}</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{value}<span className="text-sm font-normal text-slate-400 ml-1">{unit}</span></p>
      </div>
    </CardContent>
  </Card>
);

const ReportsAnalytics = () => {
  const [period, setPeriod] = useState("6M");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await labOwnerAPI.getLabBookings();
        setBookings(data || []);
      } catch (err) {
        console.error("Error loading analytics bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingFallback />;

  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0);
  const completedCount = bookings.filter((b: any) => (b.status || '').toLowerCase() === 'completed').length;
  const completionRate = totalBookings > 0 ? Math.round((completedCount / totalBookings) * 100) : 0;
  const avgPerBooking = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  // Monthly Revenue Trend
  const monthsMap: Record<string, { month: string; revenue: number; bookings: number }> = {};
  bookings.forEach((b: any) => {
    const d = b.created_at ? new Date(b.created_at) : (b.booking_date ? new Date(b.booking_date) : new Date());
    const m = d.toLocaleString('default', { month: 'short' });
    if (!monthsMap[m]) monthsMap[m] = { month: m, revenue: 0, bookings: 0 };
    monthsMap[m].revenue += (b.total_amount || 0);
    monthsMap[m].bookings += 1;
  });
  const monthlyRevenueData = Object.values(monthsMap);

  // Status Distribution
  const statusCounts: Record<string, number> = {};
  bookings.forEach((b: any) => {
    const st = (b.status || 'Scheduled').toLowerCase();
    const formatted = st.charAt(0).toUpperCase() + st.slice(1);
    statusCounts[formatted] = (statusCounts[formatted] || 0) + 1;
  });
  const statusColors: Record<string, string> = {
    Completed: "#10B981",
    Scheduled: "#6366F1",
    Processing: "#F59E0B",
    Cancelled: "#EF4444"
  };
  const statusDistribution = Object.entries(statusCounts).map(([name, count]) => ({
    name,
    value: totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0,
    count,
    color: statusColors[name] || "#94A3B8"
  }));

  // Top Tests
  const testsMap: Record<string, { count: number; revenue: number }> = {};
  bookings.forEach((b: any) => {
    const tests = Array.isArray(b.tests) ? b.tests : [];
    tests.forEach((t: any) => {
      const name = t.name || t || 'Diagnostic Test';
      const price = t.price || (b.total_amount ? b.total_amount / tests.length : 0);
      if (!testsMap[name]) testsMap[name] = { count: 0, revenue: 0 };
      testsMap[name].count += 1;
      testsMap[name].revenue += price;
    });
  });
  const topTestsData = Object.entries(testsMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="text-primary" size={24} />
            Analytics & Reports
          </h2>
          <p className="text-slate-500 mt-1">Performance insights across all your laboratories.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-28 h-10 rounded-xl border-slate-200 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1M">Last Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 rounded-xl h-10 text-sm">
            <Download size={15} /> Export
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={<CreditCard size={18} className="text-primary" />}
          color="bg-primary/10"
        />
        <StatCard
          title="Bookings"
          value={totalBookings}
          icon={<Calendar size={18} className="text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Completion Rate"
          value={completionRate}
          unit="%"
          icon={<CheckCircle2 size={18} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Avg. Per Booking"
          value={`₹${avgPerBooking.toLocaleString()}`}
          icon={<Activity size={18} className="text-amber-600" />}
          color="bg-amber-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Bookings Trend */}
        <Card className="lg:col-span-2 border-slate-200/60 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100 px-6 py-4">
            <CardTitle className="text-base font-bold">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {monthlyRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyRevenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip formatter={(val: number) => [`₹${val.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex flex-col items-center justify-center text-slate-400 text-sm italic">
                No revenue trend data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card className="border-slate-200/60 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100 px-6 py-4">
            <CardTitle className="text-base font-bold">Booking Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            {statusDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={statusDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                      {statusDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => [`${val}%`]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 w-full mt-2">
                  {statusDistribution.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        <span className="text-slate-600 font-medium">{d.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">{d.count} ({d.value}%)</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-sm italic">
                No booking status data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Top Tests */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-slate-200/60 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100 px-6 py-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FlaskConical size={16} className="text-primary" />
              Top Performing Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {topTestsData.length > 0 ? (
              topTestsData.map((test, i) => (
                <div key={test.name} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-slate-800 truncate">{test.name}</p>
                      <p className="text-xs text-slate-500 ml-2 flex-shrink-0">{test.count} bookings</p>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 mt-1.5">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(test.count / (topTestsData[0]?.count || 1)) * 100}%` }} />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-700 w-24 text-right">₹{test.revenue.toLocaleString()}</p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm italic">
                No test booking data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
