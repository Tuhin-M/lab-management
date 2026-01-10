import axios from 'axios';
import { supabase } from '../lib/supabase';

// Base API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is important for cookies
});

// Add request interceptor for auth tokens
apiClient.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Check if we should stop refresh attempts
      if (error.response.data?.shouldStopRefresh) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Try to get a new token using the refresh endpoint
        const response = await apiClient.get('/auth/refresh');

        // If successful, update the token and retry
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('userData', JSON.stringify(response.data.user));

        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log the user out
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth related API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile from 'profiles' table which includes role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        const role = profile?.role || data.user.user_metadata?.role || 'user';

        localStorage.setItem('authToken', data.session?.access_token || '');
        localStorage.setItem('userRole', role);
        localStorage.setItem('userData', JSON.stringify({ ...data.user, ...profile }));

        return { user: { ...data.user, ...profile }, role, token: data.session?.access_token };
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  signup: async (userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'user',
            phone: userData.phone,
            address: userData.address
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Explicitly upsert into profiles to ensure name is saved
        // (the trigger may not copy user_metadata)
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name: userData.name,
            role: userData.role || 'user',
          }, { onConflict: 'id' });

        if (profileError) {
          console.warn('Could not save profile name:', profileError);
        }

        const role = userData.role || 'user';
        localStorage.setItem('authToken', data.session?.access_token || '');
        localStorage.setItem('userRole', role);
        localStorage.setItem('userData', JSON.stringify({ ...data.user, name: userData.name }));
        return { user: { ...data.user, name: userData.name }, role, token: data.session?.access_token };
      }
      return null;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear persistence and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      window.location.replace('/login');
    }
  },

  getProfile: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      return { data: { ...user, ...profile } };
    }
    return { data: null };
  },

  updateProfile: async (profileData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Update 'profiles' table
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        gender: profileData.gender,
        blood_group: profileData.bloodGroup,
        avatar_url: profileData.avatar
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    // Also update Supabase Auth metadata for consistency (optional but good)
    await supabase.auth.updateUser({
      data: {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        avatar: profileData.avatar
      }
    });

    return { data };
  },

  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: password
    });
    if (error) throw error;
    return { data: data.user };
  },

  refreshToken: async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return { data };
  },

  getCurrentUserRole: () => {
    return localStorage.getItem('userRole') || 'user';
  },

  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      return { ...user, ...profile };
    }
    return null;
  }
};

// Doctor related API calls
export const doctorsAPI = {
  getAllDoctors: async (params?: any) => {
    let query = supabase.from('doctors').select('*');

    if (params?.city) {
      query = query.eq('city', params.city);
    }
    if (params?.specialty && params.specialty !== 'all') {
      query = query.eq('specialty', params.specialty);
    }

    // Simple search implementation
    if (params?.search) {
      query = query.ilike('name', `%${params.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Map database fields to frontend expected format if needed, 
    // but schema matches closely so casting should work
    return { data: data };
  },

  getDoctorById: async (id: string) => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data };
  },

  bookAppointment: async (appointmentData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: user.id,
        doctor_id: appointmentData.doctorId,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.timeSlot,
        type: appointmentData.type || 'in-person',
        amount: appointmentData.fee,
        status: 'confirmed', // Auto-confirm for demo
        patient_name: appointmentData.patientName,
        patient_phone: appointmentData.patientPhone
      })
      .select()
      .single();

    if (error) throw error;
    return { data };
  },

  getSpecialties: async () => {
    // Get unique specialties from doctors table
    const { data, error } = await supabase
      .from('doctors')
      .select('specialty');

    if (error) throw error;

    // Return unique values
    const uniqueSpecialties = [...new Set(data.map(d => d.specialty))];
    return { data: uniqueSpecialties };
  }
};

// Lab Test related API calls
export const labsAPI = {
  // Get all labs
  getAllLabs: async (params?: any) => {
    // Correct join: labs -> lab_tests -> tests
    let query = supabase.from('labs').select('*, lab_tests(*, tests(*))');

    if (params?.city) {
      query = query.ilike('address_city', `%${params.city}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Transform data to flatten tests array for easier frontend consumption
    const transformedData = data?.map((lab: any) => ({
      ...lab,
      tests: lab.lab_tests?.map((lt: any) => ({
        ...lt.tests,
        price: lt.price,
        discountPrice: lt.discounted_price
      })) || []
    }));

    return transformedData;
  },

  // Get all tests
  getAllTests: async (params?: any) => {
    let query = supabase.from('tests').select('*');

    if (params?.search) {
      query = query.ilike('name', `%${params.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  getLabById: async (id: string) => {
    // First: Fetch lab with tests (no reviews join - that's broken)
    const { data, error } = await supabase
      .from('labs')
      .select('*, lab_tests(*, tests(*))')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Transform tests
    if (data && data.lab_tests) {
      data.tests = data.lab_tests.map((lt: any) => ({
        ...lt.tests,
        price: lt.price,
        discountPrice: lt.discounted_price
      }));
    }

    // Second: Fetch reviews separately
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('lab_id', id);

    // Third: Fetch author profiles for reviews
    if (reviews && reviews.length > 0) {
      const userIds = [...new Set(reviews.map(r => r.user_id).filter(Boolean))];
      let profilesMap: Record<string, any> = {};

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', userIds);

        profiles?.forEach(p => { profilesMap[p.id] = p; });
      }

      data.reviews = reviews.map(r => ({
        ...r,
        user: profilesMap[r.user_id] || { name: 'Verified User' },
        createdAt: r.created_at
      }));
    } else {
      data.reviews = [];
    }

    return data;
  },

  bookTest: async (testData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('test_bookings')
      .insert({
        user_id: user.id,
        lab_id: testData.labId,
        booking_date: testData.date,
        booking_time: testData.timeSlot,
        total_amount: testData.totalAmount,
        patient_name: testData.patientName,
        patient_phone: testData.patientPhone,
        home_collection: testData.homeCollection || false,
        status: 'confirmed'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getLabsSortedByDiscountedPrice: async (sortOrder: 'asc' | 'desc' = 'asc') => {
    // This is complex in logic, for now returning all labs, client side sorting can handle it
    // or we use an RPC function in Supabase if needed later.
    const { data, error } = await supabase.from('labs').select('*');
    if (error) throw error;
    return data;
  }
};

// User appointments and bookings
export const userAPI = {
  getAppointments: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };

    const { data, error } = await supabase
      .from('appointments')
      .select('*, doctors(*)')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: false });

    if (error) throw error;
    return { data };
  },

  getTestBookings: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };

    const { data, error } = await supabase
      .from('test_bookings')
      .select('*, labs(*)')
      .eq('user_id', user.id)
      .order('booking_date', { ascending: false });

    if (error) throw error;
    return { data };
  },

  cancelAppointment: async (id: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  cancelTestBooking: async (id: string) => {
    const { error } = await supabase
      .from('test_bookings')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  getProfile: authAPI.getProfile, // Reuse from authAPI
  updateProfile: authAPI.updateProfile // Reuse from authAPI
};

// Health records API calls
export const healthRecordsAPI = {
  getAllRecords: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Assuming we have a health_records table (not in schema yet, but good to placeholder)
    // or we store it in a JSONB column in profiles for now
    return { data: [] };
  },
  getRecordById: async (id: string) => {
    return { data: null };
  },
  createRecord: async (data: any) => {
    return { data: data };
  },
  updateRecord: async (id: string, data: any) => {
    return { data: data };
  },
  deleteRecord: async (id: string) => {
    return { success: true };
  },
};

// Blog related API calls
export const blogAPI = {
  getAllPosts: async (params?: any) => {
    let query = supabase.from('posts').select('*').order('created_at', { ascending: false });

    if (params?.category) {
      query = query.contains('tags', [params.category]);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Fetch author profiles separately to avoid FK join issues
    const userIds = [...new Set(data.map(p => p.user_id).filter(Boolean))];
    let profilesMap: Record<string, any> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', userIds);

      profiles?.forEach(p => { profilesMap[p.id] = p; });
    }

    // Transform to frontend format
    const posts = data.map(post => {
      const profile = profilesMap[post.user_id];
      console.log('Profile lookup:', { user_id: post.user_id, profile, profilesMap });
      const authorName = profile?.name || 'Community Member';
      return {
        ...post,
        author: {
          id: post.user_id,
          name: authorName,
          avatar_url: profile?.avatar_url || null
        },
        likes: 0,
        commentsCount: 0
      };
    });

    return { data: posts };
  },

  getPostById: async (id: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: { ...data, author: { name: 'Community Member' } } };
  },

  getCategories: async () => {
    return { data: ["Health Tips", "Nutrition", "Mental Health", "Fitness", "Medical News"] };
  },

  createPost: async (postData: { content: string; tags?: string[]; user_id: string }) => {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        content: postData.content,
        tags: postData.tags || [],
        user_id: postData.user_id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return { data: null, error };
    }
    return { data, error: null };
  },

  addComment: async (postId: string, text: string, userId: string) => {
    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        content: text,
        user_id: userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      return { data: null, error };
    }
    return { data, error: null };
  },

  likePost: async (postId: string, userId: string) => {
    const { data, error } = await supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        user_id: userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error liking post:', error);
      return { data: null, error };
    }
    return { data, error: null };
  },

  unlikePost: async (postId: string, userId: string) => {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error unliking post:', error);
      return { success: false, error };
    }
    return { success: true, error: null };
  },

  editPost: async (postId: string, updates: { content?: string; tags?: string[] }) => {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error editing post:', error);
      return { data: null, error };
    }
    return { data, error: null };
  },

  deletePost: async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      return { success: false, error };
    }
    return { success: true, error: null };
  }
};

// Coupon related API calls (Simplified for frontend-only)
export const couponsAPI = {
  getAll: async () => {
    // Stub: in real app, fetch from 'coupons' table
    return { data: [] };
  },
  validate: async (data: any) => {
    // Stub validation
    return { valid: true, discount: 0 };
  },
  create: async (data: any) => { return { data }; },
  update: async (id: string, data: any) => { return { data }; },
  delete: async (id: string) => { return { success: true }; }
};

interface LabAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  landmark?: string;
}

interface LabContact {
  email: string;
  phone: string;
  emergencyContact?: string;
  website?: string;
}

interface LabStaff {
  pathologists: number;
  technicians: number;
  receptionists: number;
}

interface LabWorkingHours {
  weekdays: string;
  weekends: string;
  holidays: string;
}

export interface LabCreateRequest {
  name: string;
  description: string;
  establishedDate: string;
  registrationNumber: string;
  address: LabAddress;
  contact: LabContact;
  facilities: string[];
  certifications: string[];
  workingHours: LabWorkingHours;
  staff: LabStaff;
  services: string[];
}

interface LabCreateResponse {
  id: string;
  name: string;
  message: string;
}

// Lab owner related API calls
export const labOwnerAPI = {
  getLabStats: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: {} };

    // Calculate stats from owned labs
    const { data: labs } = await supabase.from('labs').select('id').eq('owner_id', user.id);
    const labIds = labs?.map(l => l.id) || [];

    if (labIds.length === 0) return { data: { totalBookings: 0, revenue: 0 } };

    const { count } = await supabase
      .from('test_bookings')
      .select('*', { count: 'exact', head: true })
      .in('lab_id', labIds);

    return { data: { totalBookings: count || 0, revenue: 0, labs: labIds.length } };
  },

  getOwnedLabs: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [] };

    const { data, error } = await supabase
      .from('labs')
      .select('*')
      .eq('owner_id', user.id);

    if (error) throw error;
    return { data };
  },

  updateAppointmentStatus: async (appointmentId: string, status: string) => {
    const { data, error } = await supabase
      .from('test_bookings')
      .update({ status })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return { data };
  },

  deleteLab: async (id: string) => {
    const { error } = await supabase.from('labs').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  addLab: async (labData: LabCreateRequest): Promise<LabCreateResponse> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from('labs')
      .insert({
        owner_id: user.id,
        name: labData.name,
        description: labData.description,
        // Mapping address fields
        address_street: labData.address.street,
        address_city: labData.address.city,
        address_state: labData.address.state,
        address_zip: labData.address.zipCode,

        // Mapping other fields
        phone: labData.contact.phone,
        email: labData.contact.email,
        facilities: labData.facilities,
        // ... mapped fields
      })
      .select()
      .single();

    if (error) throw error;
    return { id: data.id, name: data.name, message: "Lab created successfully" };
  },
};

interface Lab {
  id: string;
  name: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  rating?: number;
  tests: Array<{
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
  }>;
}

interface ApiResponse<T> {
  data: T;
  isDummy?: boolean;
  error?: {
    message: string;
    originalError?: any;
  };
}

// Doctor chat API calls
export const doctorChatAPI = {
  getChats: async () => {
    return apiClient.get('/doctor-chats');
  },

  getChatById: async (id: string) => {
    return apiClient.get(`/doctor-chats/${id}`);
  },

  createChat: async (doctorId: string) => {
    return apiClient.post('/doctor-chats', { doctorId });
  },

  sendMessage: async (chatId: string, message: string) => {
    return apiClient.post(`/doctor-chats/${chatId}/messages`, { message });
  },

  initiateVideoCall: async (chatId: string) => {
    return apiClient.post(`/doctor-chats/${chatId}/video-call`);
  },

  acceptVideoCall: async (chatId: string) => {
    return apiClient.put(`/doctor-chats/${chatId}/video-call/accept`);
  },

  endVideoCall: async (chatId: string) => {
    return apiClient.put(`/doctor-chats/${chatId}/video-call/end`);
  },

  getVideoCallToken: async (chatId: string) => {
    return apiClient.get(`/doctor-chats/${chatId}/video-call/token`);
  }
};

export default apiClient;
