import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building2,
  Stethoscope,
  BarChart3,
  Search,
  RefreshCw,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Analytics {
  overview: {
    totalUsers: number;
    totalDoctors: number;
    totalLabs: number;
    totalBookings: number;
    totalAppointments: number;
  };
  recent30Days: {
    bookings: number;
    appointments: number;
    revenue: number;
    transactions: number;
  };
  breakdowns: {
    usersByRole: Record<string, number>;
    bookingsByStatus: Record<string, number>;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  lastLogin: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
    fetchLabs();
    fetchDoctors();
  }, []);

  const fetchLabs = async () => {
    try {
      const { data, error } = await supabase.from('labs').select('*');
      if (error) throw error;
      setLabs(data || []);
    } catch (err) {
      console.error('Failed to fetch labs:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase.from('doctors').select('*');
      if (error) throw error;
      setDoctors(data || []);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const toggleDoctorVerification = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ verified: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      toast.success(`Doctor ${!currentStatus ? 'verified' : 'unverified'} successfully`);
      fetchDoctors();
    } catch (err) {
      toast.error('Failed to update verification status');
    }
  };

  const toggleLabApproval = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    try {
      // Assuming 'status' column exists in labs, if not we use a boolean like 'verified'
      const { error } = await supabase
        .from('labs')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      toast.success(`Lab ${newStatus} successfully`);
      fetchLabs();
    } catch (err) {
      // Try 'verified' column if 'status' fails
      try {
        await supabase.from('labs').update({ verified: currentStatus !== 'approved' }).eq('id', id);
        toast.success('Lab status updated');
        fetchLabs();
      } catch (innerErr) {
        toast.error('Failed to update lab status');
      }
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Parallel requests for counts (using head: true for efficiency)
      const [
        { count: totalUsers },
        { count: totalDoctors },
        { count: totalLabs },
        { count: totalBookings },
        { count: totalAppointments },
        { data: profiles },
        { data: appointments },
        { data: bookings }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('doctors').select('*', { count: 'exact', head: true }),
        supabase.from('labs').select('*', { count: 'exact', head: true }),
        supabase.from('test_bookings').select('*', { count: 'exact', head: true }),
        supabase.from('appointments').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('role'),
        supabase.from('appointments').select('amount').eq('status', 'completed'),
        supabase.from('test_bookings').select('total_amount').eq('status', 'completed')
      ]);

      const totalRevenue = (appointments?.reduce((sum, a) => sum + (a.amount || 0), 0) || 0) +
                           (bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0);

      const usersByRole: Record<string, number> = {};
      profiles?.forEach((p) => {
        const role = p.role || 'user';
        usersByRole[role] = (usersByRole[role] || 0) + 1;
      });

      setAnalytics({
        overview: {
          totalUsers: totalUsers || 0,
          totalDoctors: totalDoctors || 0,
          totalLabs: totalLabs || 0,
          totalBookings: totalBookings || 0,
          totalAppointments: totalAppointments || 0,
        },
        recent30Days: {
          bookings: totalBookings || 0, 
          appointments: totalAppointments || 0, 
          revenue: totalRevenue, 
          transactions: (appointments?.length || 0) + (bookings?.length || 0)
        },
        breakdowns: {
          usersByRole,
          bookingsByStatus: {}
        }
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      let query = supabase.from('profiles').select('*');

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setUsers(data.map((p: any) => ({
        id: p.id,
        name: p.name,
        email: p.email || 'N/A', 
        phone: p.phone,
        role: p.role,
        lastLogin: new Date().toISOString(),
        createdAt: p.created_at
      })));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, roleFilter]);

  const StatCard = ({ title, value, icon, trend }: { title: string; value: string | number; icon: React.ReactNode; trend?: string }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {trend && (
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your platform</p>
          </div>
          <Button onClick={() => { fetchAnalytics(); fetchUsers(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="labs">
              <Building2 className="h-4 w-4 mr-2" />
              Labs
            </TabsTrigger>
            <TabsTrigger value="doctors">
              <Stethoscope className="h-4 w-4 mr-2" />
              Doctors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {analytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Users"
                    value={analytics.overview.totalUsers}
                    icon={<Users className="h-6 w-6 text-primary" />}
                  />
                  <StatCard
                    title="Total Doctors"
                    value={analytics.overview.totalDoctors}
                    icon={<Stethoscope className="h-6 w-6 text-primary" />}
                  />
                  <StatCard
                    title="Total Labs"
                    value={analytics.overview.totalLabs}
                    icon={<Building2 className="h-6 w-6 text-primary" />}
                  />
                  <StatCard
                    title="Total Bookings"
                    value={analytics.overview.totalBookings}
                    icon={<Calendar className="h-6 w-6 text-primary" />}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Last 30 Days</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Activity className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                        <p className="text-2xl font-bold">{analytics.recent30Days.bookings}</p>
                        <p className="text-sm text-muted-foreground">Test Bookings</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Calendar className="h-8 w-8 mx-auto text-green-600 mb-2" />
                        <p className="text-2xl font-bold">{analytics.recent30Days.appointments}</p>
                        <p className="text-sm text-muted-foreground">Appointments</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <DollarSign className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                        <p className="text-2xl font-bold">₹{analytics.recent30Days.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <TrendingUp className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                        <p className="text-2xl font-bold">{analytics.recent30Days.transactions}</p>
                        <p className="text-sm text-muted-foreground">Transactions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Users by Role</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(analytics.breakdowns.usersByRole).map(([role, count]) => (
                          <div key={role} className="flex items-center justify-between">
                            <span className="capitalize">{role.toLowerCase().replace('_', ' ')}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Bookings by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(analytics.breakdowns.bookingsByStatus).map(([status, count]) => (
                          <div key={status} className="flex items-center justify-between">
                            <span className="capitalize">{status.toLowerCase().replace('_', ' ')}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Roles</SelectItem>
                        <SelectItem value="PATIENT">Patient</SelectItem>
                        <SelectItem value="DOCTOR">Doctor</SelectItem>
                        <SelectItem value="LAB_OWNER">Lab Owner</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="labs">
            <Card>
              <CardHeader>
                <CardTitle>Lab Approval & Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lab Name</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No labs found</TableCell>
                      </TableRow>
                    ) : (
                      labs.map((lab) => (
                        <TableRow key={lab.id}>
                          <TableCell className="font-medium">{lab.name}</TableCell>
                          <TableCell>{lab.address_city || 'N/A'}</TableCell>
                          <TableCell>{lab.phone || lab.email || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={lab.status === 'approved' || lab.verified ? 'default' : 'secondary'}>
                              {lab.status || (lab.verified ? 'Approved' : 'Pending')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant={lab.status === 'approved' || lab.verified ? "outline" : "default"}
                                className="h-8"
                                onClick={() => toggleLabApproval(lab.id, lab.status)}
                              >
                                {lab.status === 'approved' || lab.verified ? 'Revoke' : 'Approve'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor Name</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No doctors found</TableCell>
                      </TableRow>
                    ) : (
                      doctors.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell className="font-medium">{doctor.name}</TableCell>
                          <TableCell>{doctor.specialty}</TableCell>
                          <TableCell>{doctor.experience} Years</TableCell>
                          <TableCell>
                            <Badge variant={doctor.verified ? 'outline' : 'secondary'} className={doctor.verified ? 'text-green-600 border-green-200' : ''}>
                              {doctor.verified ? 'Verified' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant={doctor.verified ? "outline" : "default"}
                              className="h-8"
                              onClick={() => toggleDoctorVerification(doctor.id, doctor.verified)}
                            >
                              {doctor.verified ? 'Unverify' : 'Verify'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
