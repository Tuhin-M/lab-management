import React, { useState, useEffect } from "react";
import {
  BarChart3, TrendingUp, TrendingDown, Users, FlaskConical,
  Calendar, Download, ArrowUpRight, ArrowDownRight,
  CheckCircle2, CreditCard, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { labOwnerAPI } from "@/services/api";
import LoadingFallback from "@/utils/LoadingFallback";

const MONTHLY_REVENUE = [
  { month: "Mar", revenue: 42000, bookings: 38 },
  { month: "Apr", revenue: 55000, bookings: 51 },
  { month: "May", revenue: 48000, bookings: 44 },
  { month: "Jun", revenue: 63000, bookings: 62 },
  { month: "Jul", revenue: 71000, bookings: 70 },
  { month: "Aug", revenue: 89000, bookings: 88 },
];

const TOP_TESTS = [
  { name: "Complete Blood Count", count: 142, revenue: 49700 },
  { name: "Lipid Profile", count: 98, revenue: 68600 },
  { name: "Thyroid Panel", count: 87, revenue: 78300 },
  { name: "HbA1c", count: 76, revenue: 30400 },
  { name: "Liver Function Test", count: 65, revenue: 29250 },
];

const PATIENT_DEMOGRAPHICS = [
  { name: "18–30", value: 28, color: "#6366F1" },
  { name: "31–45", value: 35, color: "#10B981" },
  { name: "46–60", value: 25, color: "#F59E0B" },
  { name: "60+", value: 12, color: "#EF4444" },
];

const BOOKING_STATUS_DIST = [
  { name: "Completed", value: 68, color: "#10B981" },
  { name: "Scheduled", value: 22, color: "#6366F1" },
  { name: "Cancelled", value: 10, color: "#EF4444" },
];

const StatCard = ({
  title, value, unit = "", change, icon, color
}: {
  title: string; value: string | number; unit?: string; change?: number; icon: React.ReactNode; color: string;
}) => (
  <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${change >= 0 ? "text-green-600" : "text-red-500"}`}>
            {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </div>
        )}
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
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await labOwnerAPI.getLabBookings();
        const bookings = data || [];
        setTotalBookings(bookings.length);
        setTotalRevenue(bookings.reduce((s: number, b: any) => s + (b.total_amount || 0), 0));
      } catch { /* fall through to mock data */ }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingFallback />;

  const displayRevenue = totalRevenue > 0 ? totalRevenue : 368000;
  const displayBookings = totalBookings > 0 ? totalBookings : 353;

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
          value={`₹${(displayRevenue / 1000).toFixed(0)}K`}
          change={14.2}
          icon={<CreditCard size={18} className="text-primary" />}
          color="bg-primary/10"
        />
        <StatCard
          title="Bookings"
          value={displayBookings}
          change={8.7}
          icon={<Calendar size={18} className="text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Completion Rate"
          value="82"
          unit="%"
          change={3.1}
          icon={<CheckCircle2 size={18} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Avg. Per Booking"
          value={`₹${Math.round(displayRevenue / (displayBookings || 1)).toLocaleString()}`}
          change={-2.4}
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
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={MONTHLY_REVENUE} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(val: number) => [`₹${val.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card className="border-slate-200/60 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100 px-6 py-4">
            <CardTitle className="text-base font-bold">Booking Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={BOOKING_STATUS_DIST} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {BOOKING_STATUS_DIST.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => [`${val}%`]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 w-full mt-2">
              {BOOKING_STATUS_DIST.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-slate-600 font-medium">{d.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tests */}
        <Card className="border-slate-200/60 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100 px-6 py-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FlaskConical size={16} className="text-primary" />
              Top Performing Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {TOP_TESTS.map((test, i) => (
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
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(test.count / TOP_TESTS[0].count) * 100}%` }} />
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-700 w-20 text-right">₹{(test.revenue / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Patient Age Demographics */}
        <Card className="border-slate-200/60 shadow-sm rounded-2xl">
          <CardHeader className="border-b border-slate-100 px-6 py-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Users size={16} className="text-primary" />
              Patient Demographics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={PATIENT_DEMOGRAPHICS} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(val: number) => [`${val}%`, "Share"]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {PATIENT_DEMOGRAPHICS.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-3">
              {PATIENT_DEMOGRAPHICS.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-slate-500">{d.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
