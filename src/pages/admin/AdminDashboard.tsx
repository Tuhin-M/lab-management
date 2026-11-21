import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { adminService, AdminAnalytics, AdminUser, AdminLab, AdminDoctor } from '@/services/adminService';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminLabs } from '@/components/admin/AdminLabs';
import { AdminDoctors } from '@/components/admin/AdminDoctors';
import { AdminTestCatalog } from '@/components/admin/AdminTestCatalog';
import { AdminBookings } from '@/components/admin/AdminBookings';
import { AdminAppointments } from '@/components/admin/AdminAppointments';
import { AdminReviews } from '@/components/admin/AdminReviews';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, Lock, ArrowRight, RefreshCw, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [globalSearch, setGlobalSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auth & Access state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Data states
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [labs, setLabs] = useState<AdminLab[]>([]);
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  // 1. Check Authentication & Authorization
  const checkAccess = useCallback(async () => {
    try {
      setIsCheckingAuth(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (localStorage.getItem('userRole') === 'admin') {
          setIsAuthorized(true);
          setCurrentUser({
            id: 'admin-super-dev',
            name: 'Platform Administrator',
            email: 'admin@ekitsa.com',
            role: 'admin',
          });
          return;
        }
        setIsAuthorized(false);
        setCurrentUser(null);
        return;
      }

      // Fetch user profile from Supabase profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const userRole = profile?.role || user.user_metadata?.role || 'user';
      const userEmail = user.email || '';

      setCurrentUser({
        id: user.id,
        email: userEmail,
        name: profile?.name || user.user_metadata?.name || 'Administrator',
        role: userRole,
      });

      // Authorization rule:
      // - role is 'admin' or 'ADMIN'
      // - OR email is officialekitsa@gmail.com / contains admin
      // - OR userRole in localStorage is admin
      const hasAdminRights =
        userRole.toLowerCase() === 'admin' ||
        userEmail === 'officialekitsa@gmail.com' ||
        userEmail.includes('admin') ||
        localStorage.getItem('userRole') === 'admin';

      setIsAuthorized(hasAdminRights);
    } catch (err) {
      console.error('Admin auth check failed:', err);
      setIsAuthorized(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  // 2. Fetch Module Data
  const loadData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const [analyticsData, usersData, labsData, doctorsData, bookingsData, appointmentsData] =
        await Promise.all([
          adminService.getAnalytics(),
          adminService.getUsers(),
          adminService.getLabs(),
          adminService.getDoctors(),
          adminService.getAllBookings(),
          adminService.getAllAppointments(),
        ]);

      setAnalytics(analyticsData);
      setUsers(usersData);
      setLabs(labsData);
      setDoctors(doctorsData);
      setBookings(bookingsData);
      setAppointments(appointmentsData);
    } catch (err) {
      console.error('Admin data fetch error:', err);
      toast.error('Failed to sync administrative data');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      loadData();
    }
  }, [isAuthorized, loadData]);

  // Enable Admin Privileges for currently logged-in account (for setup / owner)
  const handleClaimAdminAccess = async () => {
    if (!currentUser?.id) return;
    try {
      await adminService.updateUserRole(currentUser.id, 'admin');
      localStorage.setItem('userRole', 'admin');
      toast.success('Admin privileges enabled for this account');
      setIsAuthorized(true);
      checkAccess();
    } catch (err: any) {
      toast.error('Could not grant admin access: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  // Section titles and subtitles
  const TAB_METADATA: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Platform Overview',
      subtitle: 'Real-time telemetry and executive performance metrics.',
    },
    users: {
      title: 'User Management',
      subtitle: 'Manage registered patients, doctors, lab owners, and system administrators.',
    },
    labs: {
      title: 'Laboratory Verification & Directory',
      subtitle: 'Inspect diagnostics laboratories, verify accreditations, and monitor test menus.',
    },
    doctors: {
      title: 'Doctor Directory & Verification',
      subtitle: 'Manage certified physicians, teleconsultation fees, and featured listings.',
    },
    tests: {
      title: 'Master Tests Catalog',
      subtitle: 'Universal diagnostic definitions, sample types, benchmark pricing, and lab availability.',
    },
    bookings: {
      title: 'Diagnostic Test Bookings',
      subtitle: 'Track order fulfillment, home sample collection details, and appointment statuses.',
    },
    appointments: {
      title: 'Doctor Teleconsultations',
      subtitle: 'Oversight of patient appointments with verified healthcare practitioners.',
    },
    reviews: {
      title: 'Reviews & Feedback Moderation',
      subtitle: 'Moderate patient star ratings and service testimonials.',
    },
    settings: {
      title: 'Platform Configuration',
      subtitle: 'Manage operational parameters, commissions, and database backups.',
    },
  };

  // 3. Render Loading State
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Verifying Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  // 4. Render Access Gate if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-900 border-slate-800 text-slate-100 shadow-2xl rounded-3xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-teal-500 via-emerald-400 to-indigo-500" />
          <CardHeader className="text-center pt-8 pb-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-4 border border-teal-500/20 shadow-lg shadow-teal-500/10">
              <Lock size={30} />
            </div>
            <CardTitle className="text-2xl font-black text-white tracking-tight">
              Ekitsa Admin Restricted
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              This area is restricted to authorized platform administrators and executive staff.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-2">
            {currentUser ? (
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Signed in as:</span>
                  <span className="font-bold text-white truncate max-w-[200px]">{currentUser.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Assigned Role:</span>
                  <Badge variant="outline" className="text-amber-400 border-amber-400/30 uppercase text-[10px]">
                    {currentUser.role}
                  </Badge>
                </div>

                <div className="pt-3 border-t border-slate-700/60 mt-3">
                  <p className="text-[11px] text-slate-400 mb-3">
                    Are you the platform owner or administrator? You can initialize admin privileges for this account.
                  </p>
                  <Button
                    onClick={handleClaimAdminAccess}
                    className="w-full h-10 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs gap-2 shadow-md shadow-teal-600/20"
                  >
                    <KeyRound size={15} /> Grant Admin Access to My Account
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/login', { state: { from: '/admin' } })}
                  className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs gap-2"
                >
                  Sign In with Administrator Account <ArrowRight size={15} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="w-full h-10 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Return to Patient Portal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // 5. Authorized Admin Panel Shell
  const currentMeta = TAB_METADATA[activeTab];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden selection:bg-teal-500/20">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          users: analytics?.overview.totalUsers || users.length,
          labs: analytics?.overview.totalLabs || labs.length,
          doctors: analytics?.overview.totalDoctors || doctors.length,
          tests: analytics?.overview.totalMasterTests,
          bookings: analytics?.overview.totalBookings || bookings.length,
          appointments: analytics?.overview.totalAppointments || appointments.length,
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <AdminHeader
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          onRefresh={loadData}
          isRefreshing={isRefreshing}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        {/* Scrollable Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'overview' && (
              <AdminOverview analytics={analytics} onNavigateTab={setActiveTab} />
            )}

            {activeTab === 'users' && (
              <AdminUsers users={users} onRefresh={loadData} isLoading={isRefreshing} />
            )}

            {activeTab === 'labs' && (
              <AdminLabs labs={labs} onRefresh={loadData} isLoading={isRefreshing} />
            )}

            {activeTab === 'doctors' && (
              <AdminDoctors doctors={doctors} onRefresh={loadData} isLoading={isRefreshing} />
            )}

            {activeTab === 'tests' && <AdminTestCatalog />}

            {activeTab === 'bookings' && (
              <AdminBookings bookings={bookings} onRefresh={loadData} isLoading={isRefreshing} />
            )}

            {activeTab === 'appointments' && (
              <AdminAppointments
                appointments={appointments}
                onRefresh={loadData}
                isLoading={isRefreshing}
              />
            )}

            {activeTab === 'reviews' && <AdminReviews />}

            {activeTab === 'settings' && <AdminSettings />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
