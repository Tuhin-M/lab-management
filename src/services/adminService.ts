import { supabase } from '@/lib/supabase';

export interface AdminAnalytics {
  overview: {
    totalUsers: number;
    totalDoctors: number;
    totalLabs: number;
    totalMasterTests: number;
    totalBookings: number;
    totalAppointments: number;
    totalRevenue: number;
  };
  usersByRole: Record<string, number>;
  bookingsByStatus: Record<string, number>;
  appointmentsByStatus: Record<string, number>;
  recentBookings: any[];
  recentAppointments: any[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  created_at: string;
  address?: string | null;
}

export interface AdminLab {
  id: string;
  name: string;
  address_city?: string | null;
  address_state?: string | null;
  address_street?: string | null;
  phone?: string | null;
  email?: string | null;
  accredited: boolean;
  rating?: number | null;
  test_count?: number;
  created_at?: string;
  owner_id?: string;
}

export interface AdminDoctor {
  id: string;
  name: string;
  specialty: string;
  qualifications?: string | null;
  experience?: number | null;
  fee: number;
  city?: string | null;
  hospital?: string | null;
  verified: boolean;
  featured?: boolean;
  rating?: number | null;
  available_today?: boolean;
  created_at?: string;
}

export interface AdminMasterTest {
  id: string;
  name: string;
  category: string;
  sample_type?: string | null;
  description?: string | null;
  market_price?: number | null;
  parameters?: any;
  lab_count?: number;
  created_at?: string;
}

export const adminService = {
  // 1. Analytics & Overview
  getAnalytics: async (): Promise<AdminAnalytics> => {
    const [
      { count: totalUsers },
      { count: totalDoctors },
      { count: totalLabs },
      { count: totalMasterTests },
      { count: totalBookings },
      { count: totalAppointments },
      { data: profiles },
      { data: bookings },
      { data: appointments },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('doctors').select('*', { count: 'exact', head: true }),
      supabase.from('labs').select('*', { count: 'exact', head: true }),
      supabase.from('tests').select('*', { count: 'exact', head: true }),
      supabase.from('test_bookings').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('role'),
      supabase
        .from('test_bookings')
        .select('*, labs(name, address_city)')
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('appointments')
        .select('*, doctors(name, specialty)')
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    const usersByRole: Record<string, number> = {};
    profiles?.forEach((p) => {
      const r = p.role || 'user';
      usersByRole[r] = (usersByRole[r] || 0) + 1;
    });

    // Compute gross revenue from completed bookings and appointments
    const bookingsRevenue = (bookings || []).reduce((acc: number, b: any) => acc + (b.total_amount || 0), 0);
    const appointmentsRevenue = (appointments || []).reduce((acc: number, a: any) => acc + (a.amount || 0), 0);
    const totalRevenue = bookingsRevenue + appointmentsRevenue;

    const bookingsByStatus: Record<string, number> = {};
    (bookings || []).forEach((b: any) => {
      const st = b.status || 'scheduled';
      bookingsByStatus[st] = (bookingsByStatus[st] || 0) + 1;
    });

    const appointmentsByStatus: Record<string, number> = {};
    (appointments || []).forEach((a: any) => {
      const st = a.status || 'scheduled';
      appointmentsByStatus[st] = (appointmentsByStatus[st] || 0) + 1;
    });

    return {
      overview: {
        totalUsers: totalUsers || 0,
        totalDoctors: totalDoctors || 0,
        totalLabs: totalLabs || 0,
        totalMasterTests: totalMasterTests || 0,
        totalBookings: totalBookings || 0,
        totalAppointments: totalAppointments || 0,
        totalRevenue,
      },
      usersByRole,
      bookingsByStatus,
      appointmentsByStatus,
      recentBookings: bookings || [],
      recentAppointments: appointments || [],
    };
  },

  // 2. User Management
  getUsers: async (filters?: { search?: string; role?: string }): Promise<AdminUser[]> => {
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });

    if (filters?.role && filters.role !== 'all') {
      query = query.eq('role', filters.role);
    }

    if (filters?.search) {
      const term = `%${filters.search.trim()}%`;
      query = query.or(`name.ilike.${term},email.ilike.${term}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.name || 'Unnamed User',
      email: p.email || 'No Email',
      phone: p.phone,
      role: p.role || 'user',
      created_at: p.created_at,
      address: p.address,
    }));
  },

  updateUserRole: async (userId: string, newRole: string): Promise<void> => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
  },

  // 3. Lab Management
  getLabs: async (filters?: { search?: string; accredited?: string }): Promise<AdminLab[]> => {
    let query = supabase
      .from('labs')
      .select('*, lab_tests(count)')
      .order('created_at', { ascending: false });

    if (filters?.accredited === 'true') {
      query = query.eq('accredited', true);
    } else if (filters?.accredited === 'false') {
      query = query.eq('accredited', false);
    }

    if (filters?.search) {
      const term = `%${filters.search.trim()}%`;
      query = query.or(`name.ilike.${term},address_city.ilike.${term},address_state.ilike.${term}`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((l: any) => ({
      id: l.id,
      name: l.name,
      address_city: l.address_city,
      address_state: l.address_state,
      address_street: l.address_street,
      phone: l.phone,
      email: l.email,
      accredited: Boolean(l.accredited),
      rating: l.rating,
      test_count: l.lab_tests?.[0]?.count || 0,
      created_at: l.created_at,
      owner_id: l.owner_id,
    }));
  },

  toggleLabAccreditation: async (labId: string, currentStatus: boolean): Promise<boolean> => {
    const nextStatus = !currentStatus;
    const { error } = await supabase
      .from('labs')
      .update({ accredited: nextStatus })
      .eq('id', labId);
    if (error) throw error;
    return nextStatus;
  },

  deleteLab: async (labId: string): Promise<void> => {
    // Delete lab tests first if cascade is not enabled
    await supabase.from('lab_tests').delete().eq('lab_id', labId);
    const { error } = await supabase.from('labs').delete().eq('id', labId);
    if (error) throw error;
  },

  // 4. Doctor Management
  getDoctors: async (filters?: { search?: string; specialty?: string }): Promise<AdminDoctor[]> => {
    let query = supabase.from('doctors').select('*').order('created_at', { ascending: false });

    if (filters?.specialty && filters.specialty !== 'all') {
      query = query.eq('specialty', filters.specialty);
    }

    if (filters?.search) {
      const term = `%${filters.search.trim()}%`;
      query = query.or(`name.ilike.${term},specialty.ilike.${term},city.ilike.${term}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  toggleDoctorVerification: async (doctorId: string, currentStatus: boolean): Promise<boolean> => {
    const nextStatus = !currentStatus;
    const { error } = await supabase
      .from('doctors')
      .update({ verified: nextStatus })
      .eq('id', doctorId);
    if (error) throw error;
    return nextStatus;
  },

  toggleDoctorFeatured: async (doctorId: string, currentStatus: boolean): Promise<boolean> => {
    const nextStatus = !currentStatus;
    const { error } = await supabase
      .from('doctors')
      .update({ featured: nextStatus })
      .eq('id', doctorId);
    if (error) throw error;
    return nextStatus;
  },

  saveDoctor: async (docData: Partial<AdminDoctor>): Promise<any> => {
    if (docData.id) {
      const { data, error } = await supabase
        .from('doctors')
        .update(docData)
        .eq('id', docData.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('doctors')
        .insert(docData)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  deleteDoctor: async (doctorId: string): Promise<void> => {
    const { error } = await supabase.from('doctors').delete().eq('id', doctorId);
    if (error) throw error;
  },

  // 5. Master Tests Catalog
  getMasterTests: async (filters?: {
    search?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: AdminMasterTest[]; total: number }> => {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let countQuery = supabase.from('tests').select('*', { count: 'exact', head: true });
    let query = supabase
      .from('tests')
      .select('*, lab_tests(count)')
      .order('name', { ascending: true })
      .range(from, to);

    if (filters?.category && filters.category !== 'all') {
      countQuery = countQuery.eq('category', filters.category);
      query = query.eq('category', filters.category);
    }

    if (filters?.search) {
      const term = `%${filters.search.trim()}%`;
      countQuery = countQuery.ilike('name', term);
      query = query.ilike('name', term);
    }

    const [{ count }, { data, error }] = await Promise.all([countQuery, query]);
    if (error) throw error;

    const formatted: AdminMasterTest[] = (data || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      sample_type: t.sample_type,
      description: t.description,
      market_price: t.market_price,
      parameters: t.parameters,
      lab_count: t.lab_tests?.[0]?.count || 0,
      created_at: t.created_at,
    }));

    return {
      data: formatted,
      total: count || 0,
    };
  },

  createMasterTest: async (testData: {
    name: string;
    category: string;
    sample_type?: string;
    market_price?: number;
    description?: string;
    parameters?: any[];
  }): Promise<any> => {
    const { data, error } = await supabase
      .from('tests')
      .insert({
        name: testData.name.trim(),
        category: testData.category,
        sample_type: testData.sample_type || 'Blood',
        market_price: testData.market_price || 0,
        description: testData.description || `Diagnostic laboratory test for ${testData.name.trim()}.`,
        parameters: testData.parameters || [{ name: testData.name.trim() }],
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateMasterTest: async (
    id: string,
    testData: {
      name?: string;
      category?: string;
      sample_type?: string;
      market_price?: number;
      description?: string;
    }
  ): Promise<any> => {
    const { data, error } = await supabase
      .from('tests')
      .update(testData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteMasterTest: async (id: string): Promise<void> => {
    // Delete linked lab tests first
    await supabase.from('lab_tests').delete().eq('test_id', id);
    const { error } = await supabase.from('tests').delete().eq('id', id);
    if (error) throw error;
  },

  // 6. Test Bookings Oversight
  getAllBookings: async (filters?: { status?: string; search?: string }): Promise<any[]> => {
    let query = supabase
      .from('test_bookings')
      .select('*, labs(name, address_city, phone)')
      .order('booking_date', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      const term = `%${filters.search.trim()}%`;
      query = query.or(`patient_name.ilike.${term},patient_phone.ilike.${term}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  updateBookingStatus: async (bookingId: string, status: string): Promise<void> => {
    const { error } = await supabase
      .from('test_bookings')
      .update({ status })
      .eq('id', bookingId);
    if (error) throw error;
  },

  // 7. Doctor Appointments Oversight
  getAllAppointments: async (filters?: { status?: string }): Promise<any[]> => {
    let query = supabase
      .from('appointments')
      .select('*, doctors(name, specialty, hospital)')
      .order('appointment_date', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  updateAppointmentStatus: async (appointmentId: string, status: string): Promise<void> => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId);
    if (error) throw error;
  },

  // 8. Reviews Moderation
  getReviews: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, labs(name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (error) throw error;
  },
};
