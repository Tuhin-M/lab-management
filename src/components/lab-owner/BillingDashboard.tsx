import React, { useState, useEffect } from "react";
import {
    CreditCard,
    TrendingUp,
    Users,
    Calendar,
    Download,
    Filter,
    Search,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { labOwnerAPI } from "@/services/api";
import { format } from "date-fns";
import LoadingFallback from "@/utils/LoadingFallback";

const BillingDashboard = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [growth, setGrowth] = useState(12.5); // Mock growth

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await labOwnerAPI.getLabBookings();
                const data = response.data || [];
                setBookings(data);

                const total = data.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0);
                setTotalRevenue(total);
            } catch (error) {
                console.error("Error fetching billing data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <LoadingFallback />;

    const stats = [
        {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            change: "+₹2,400",
            trend: "up",
            icon: <CreditCard className="h-6 w-6" />,
            color: "bg-blue-500"
        },
        {
            title: "Active Bookings",
            value: bookings.length.toString(),
            change: "+3 this week",
            trend: "up",
            icon: <Calendar className="h-6 w-6" />,
            color: "bg-emerald-500"
        },
        {
            title: "Converson Rate",
            value: "18.2%",
            change: "+2.4%",
            trend: "up",
            icon: <TrendingUp className="h-6 w-6" />,
            color: "bg-purple-500"
        },
        {
            title: "Avg. Order Value",
            value: bookings.length > 0 ? `₹${Math.round(totalRevenue / bookings.length).toLocaleString()}` : "₹0",
            change: "-₹120",
            trend: "down",
            icon: <Users className="h-6 w-6" />,
            color: "bg-orange-500"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Billing & Revenue</h1>
                    <p className="text-slate-500 mt-2 text-lg">Detailed financial overview and order management for all your laboratories.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" className="rounded-2xl gap-2 h-12 flex-1 md:flex-none border-slate-200">
                        <Download size={18} />
                        Export Reports
                    </Button>
                    <Button className="rounded-2xl gap-2 h-12 flex-1 md:flex-none shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                        <Filter size={18} />
                        Apply Filters
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`${stat.color} p-4 rounded-3xl text-white shadow-lg group-hover:rotate-6 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} px-3 py-1 rounded-full`}>
                                    {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">{stat.title}</p>
                                <h3 className="text-4xl font-black text-slate-900">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Billing Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transactions Table */}
                <Card className="lg:col-span-2 border-none shadow-2xl shadow-slate-200/50 bg-white/50 backdrop-blur-xl rounded-[3rem] overflow-hidden">
                    <CardHeader className="px-10 pt-10 pb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl font-black">Recent Transactions</CardTitle>
                                <CardDescription className="text-slate-500 font-medium">Verify and track incoming payments from patients.</CardDescription>
                            </div>
                            <div className="relative w-64 h-11 hidden md:block">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <Input
                                    placeholder="Search orders..."
                                    className="pl-12 rounded-2xl h-full border-slate-200 bg-white/80 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="py-6 px-10 text-slate-900 font-bold uppercase tracking-widest text-[10px]">Patient & Order ID</TableHead>
                                        <TableHead className="py-6 px-6 text-slate-900 font-bold uppercase tracking-widest text-[10px]">Date & Status</TableHead>
                                        <TableHead className="py-6 px-6 text-slate-900 font-bold uppercase tracking-widest text-[10px]">Amount</TableHead>
                                        <TableHead className="py-6 px-10 text-right text-slate-900 font-bold uppercase tracking-widest text-[10px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.map((booking, i) => (
                                        <TableRow key={booking.id} className="group hover:bg-slate-50/50 border-slate-50 transition-colors">
                                            <TableCell className="py-6 px-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-600 shadow-sm">
                                                        {booking.patient_name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-base">{booking.patient_name}</p>
                                                        <p className="text-xs text-slate-400 font-mono mt-0.5">#{booking.id.slice(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-6">
                                                <div className="space-y-1.5">
                                                    <p className="text-sm font-bold text-slate-600">{format(new Date(booking.booking_date), "MMM d, yyyy")}</p>
                                                    <Badge className={`${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                                                            booking.status === 'completed' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                                                'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                        } border-none font-bold text-[10px] px-2.5 py-0.5 rounded-lg shadow-sm capitalize`}>
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-6">
                                                <p className="text-lg font-black text-slate-900">₹{booking.total_amount.toLocaleString()}</p>
                                                <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-1.5 rounded-md mt-1">Paid via UPI</p>
                                            </TableCell>
                                            <TableCell className="py-6 px-10 text-right">
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                    <MoreHorizontal size={18} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {bookings.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-24 text-center">
                                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                                    <CreditCard size={40} />
                                                </div>
                                                <h4 className="text-xl font-bold text-slate-900 mb-2">No transactions yet</h4>
                                                <p className="text-slate-500 max-w-xs mx-auto">New test bookings will appear here once customers place orders.</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {bookings.length > 0 && (
                            <div className="p-8 border-t border-slate-50 text-center">
                                <Button variant="link" className="text-primary font-bold text-sm gap-2 hover:gap-3 transition-all">
                                    View Full Transaction History
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Side Panel */}
                <div className="space-y-8">
                    {/* Revenue Breakdown */}
                    <Card className="border-none shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black">Labs Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <p className="font-bold text-slate-900">Laboratory {i}</p>
                                        <p className="text-sm font-black text-primary">₹{(totalRevenue * (0.6 - i * 0.2)).toLocaleString()}</p>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
                                            style={{ width: `${60 - i * 20}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-none shadow-2xl shadow-primary/10 bg-primary text-white rounded-[2.5rem] overflow-hidden relative group">
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full -mb-16 -mr-16 blur-3xl group-hover:scale-125 transition-transform duration-700" />
                        <CardContent className="p-10 relative z-10">
                            <h3 className="text-2xl font-black mb-2">Payout Schedule</h3>
                            <p className="text-primary-foreground/80 mb-8 font-medium">Your next payout of <span className="text-white font-black">₹18,450</span> is scheduled for Monday, June 12th.</p>
                            <Button className="w-full bg-white text-primary hover:bg-slate-100 font-black rounded-2xl h-14 shadow-xl shadow-black/10 border-none transition-all active:scale-95">
                                Update Bank Details
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BillingDashboard;
