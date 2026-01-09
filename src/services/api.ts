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
        // We still store some data in localStorage for persistence if needed, 
        // but Supabase handles the session in its own way as well.
        const role = data.user.user_metadata?.role || 'user';
        localStorage.setItem('authToken', data.session?.access_token || '');
        localStorage.setItem('userRole', role);
        localStorage.setItem('userData', JSON.stringify(data.user));
        return { user: data.user, role, token: data.session?.access_token };
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
        const role = data.user.user_metadata?.role || 'user';
        localStorage.setItem('authToken', data.session?.access_token || '');
        localStorage.setItem('userRole', role);
        localStorage.setItem('userData', JSON.stringify(data.user));
        return { user: data.user, role, token: data.session?.access_token };
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

      // Clear interceptors and tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');

      // Force redirect to login with full page refresh
      window.location.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);

      // Ensure cleanup and redirect even if Supabase fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');

      window.location.replace('/login');
      throw error;
    }
  },

  getProfile: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { data: user };
  },

  updateProfile: async (profileData: any) => {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address
      }
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
    return user;
  }
};

// Doctor related API calls
export const doctorsAPI = {
  getAllDoctors: async (params?: any) => {
    return apiClient.get('/doctors', { params });
  },

  getDoctorById: async (id: string) => {
    return apiClient.get(`/doctors/${id}`);
  },

  bookAppointment: async (appointmentData: any) => {
    return apiClient.post('/appointments', appointmentData);
  },

  getSpecialties: async () => {
    return apiClient.get('/specialties');
  }
};

// Lab Test related API calls
export const labsAPI = {
  // Get all labs
  getAllLabs: async (params?: any) => {
    const response = await apiClient.get('/labs', { params });
    return response.data;
  },

  // Get all tests
  getAllTests: async (params?: any) => {
    const response = await apiClient.get('/tests', { params });
    return response.data;
  },

  getLabById: async (id: string) => {
    const response = await apiClient.get(`/labs/${id}`);
    return response.data;
  },

  bookTest: async (testData: any) => {
    // Note: The endpoint in backend is /test-bookings, but previously was /tests/book
    // Let's ensure this matches the refactored test-bookings logic
    const response = await apiClient.post('/test-bookings', testData);
    return response.data;
  },

  getLabsSortedByDiscountedPrice: async (sortOrder: 'asc' | 'desc' = 'asc') => {
    const response = await apiClient.get('/labs', { params: { sortBy: 'price', order: sortOrder } });
    return response.data;
  }
};

// Coupon related API calls
export const couponsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/coupons');
    return response.data;
  },

  validate: async (data: { code: string; orderTotal: number; labId?: string; testIds?: string[] }) => {
    const response = await apiClient.post('/coupons/validate', data);
    return response.data;
  },

  create: async (couponData: any) => {
    const response = await apiClient.post('/coupons', couponData);
    return response.data;
  },

  update: async (id: string, couponData: any) => {
    const response = await apiClient.put(`/coupons/${id}`, couponData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/coupons/${id}`);
    return response.data;
  }
};

// Payment related API calls
export const paymentsAPI = {
  createOrder: async (data: {
    amount: number;
    testBookingId?: string;
    appointmentId?: string;
    paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'COD' | 'WALLET';
    couponCode?: string;
    userId?: string;
  }) => {
    const response = await apiClient.post('/payments/create-order', data);
    return response.data;
  },

  verify: async (data: { transactionId: string; gatewayPaymentId: string; gatewaySignature?: string }) => {
    const response = await apiClient.post('/payments/verify', data);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },

  requestRefund: async (id: string, reason: string) => {
    const response = await apiClient.post(`/payments/${id}/refund`, { reason });
    return response.data;
  }
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
    const response = await apiClient.get('/lab-owner/stats');
    return response.data;
  },

  getOwnedLabs: async () => {
    const response = await apiClient.get('/lab-owner/labs');
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId: string, status: string) => {
    const response = await apiClient.put(`/test-bookings/${appointmentId}/status`, { status });
    return response.data;
  },

  deleteLab: async (id: string) => {
    const response = await apiClient.delete(`/labs/${id}`);
    return response.data;
  },

  addLab: async (labData: LabCreateRequest): Promise<LabCreateResponse> => {
    const response = await apiClient.post('/labs', {
      name: labData.name,
      description: labData.description,
      establishedDate: labData.establishedDate,
      registrationNumber: labData.registrationNumber,
      contact: labData.contact,
      address: labData.address,
      facilities: labData.facilities,
      certifications: labData.certifications,
      workingHours: labData.workingHours,
      staff: labData.staff,
      services: labData.services
    });
    return response.data;
  },
};

// User appointments and bookings
export const userAPI = {
  getAppointments: async () => {
    return apiClient.get('/user/appointments');
  },

  getTestBookings: async () => {
    return apiClient.get('/user/test-bookings');
  },

  cancelAppointment: async (id: string) => {
    return apiClient.delete(`/appointments/${id}`);
  },

  cancelTestBooking: async (id: string) => {
    return apiClient.delete(`/test-bookings/${id}`);
  },

  getProfile: async () => {
    return apiClient.get('/user/profile');
  },

  updateProfile: async (profileData: any) => {
    return apiClient.put('/user/profile', profileData);
  }
};

// Health records API calls
export const healthRecordsAPI = {
  getAllRecords: async () => {
    return apiClient.get('/health-records');
  },
  getRecordById: async (id: string) => {
    return apiClient.get(`/health-records/${id}`);
  },
  createRecord: async (data: any) => {
    return apiClient.post('/health-records', data);
  },
  updateRecord: async (id: string, data: any) => {
    return apiClient.put(`/health-records/${id}`, data);
  },
  deleteRecord: async (id: string) => {
    return apiClient.delete(`/health-records/${id}`);
  },
};

// Blog related API calls
export const blogAPI = {
  getAllPosts: async (params?: any) => {
    return apiClient.get('/blog/posts', { params });
  },

  getPostById: async (id: string) => {
    return apiClient.get(`/blog/posts/${id}`);
  },

  getCategories: async () => {
    return apiClient.get('/blog/categories');
  }
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
