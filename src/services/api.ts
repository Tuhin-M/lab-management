import axios from 'axios';

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
  (config) => {
    const token = localStorage.getItem('authToken');
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
      const response = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  signup: async (userData: any) => {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      
      // Clear interceptors and tokens
      apiClient.interceptors.response.clear();
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      
      // Force redirect to login with full page refresh
      window.location.replace('/login');
      
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Ensure cleanup and redirect even if API fails
      apiClient.interceptors.response.clear();
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      
      window.location.replace('/login');
      
      throw error;
    }
  },
  
  getProfile: async () => {
    return apiClient.get('/auth/profile');
  },
  
  updateProfile: async (profileData: any) => {
    return apiClient.put('/auth/profile', profileData);
  },
  
  refreshToken: async () => {
    return apiClient.get('/auth/refresh');
  },
  
  getCurrentUserRole: () => {
    return localStorage.getItem('userRole') || 'user';
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
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
  // Enhanced dummy Indian labs data
  dummyLabs: [
    {
      id: 'lab1',
      name: 'Thyrocare Technologies',
      location: 'Mumbai, Maharashtra',
      rating: 4.5,
      specializations: ['Endocrinology', 'Hematology'],
      operatingHours: {
        weekdays: '7:00 AM - 8:00 PM',
        weekends: '7:00 AM - 3:00 PM'
      },
      tests: [
        { name: 'Thyroid Profile', price: 1200, discountPrice: 999, category: 'Endocrinology' },
        { name: 'Complete Blood Count', price: 500, discountPrice: 399, category: 'Hematology' },
        { name: 'Lipid Profile', price: 900, discountPrice: 699, category: 'Cardiology' }
      ]
    },
    {
      id: 'lab2',
      name: 'Dr. Lal PathLabs',
      location: 'Delhi NCR',
      rating: 4.7,
      specializations: ['Diabetes', 'Hepatology'],
      operatingHours: {
        weekdays: '6:30 AM - 9:00 PM',
        weekends: '6:30 AM - 2:00 PM'
      },
      tests: [
        { name: 'Diabetes Screening', price: 1500, discountPrice: 1199, category: 'Diabetes' },
        { name: 'Liver Function Test', price: 800, discountPrice: 599, category: 'Hepatology' },
        { name: 'Kidney Function Test', price: 1000, discountPrice: 799, category: 'Nephrology' }
      ]
    },
    {
      id: 'lab3',
      name: 'SRL Diagnostics',
      location: 'Bangalore, Karnataka',
      rating: 4.3,
      specializations: ['Nutrition', 'Endocrinology'],
      operatingHours: {
        weekdays: '8:00 AM - 7:30 PM',
        weekends: '8:00 AM - 1:00 PM'
      },
      tests: [
        { name: 'Vitamin D Test', price: 1100, discountPrice: 899, category: 'Nutrition' },
        { name: 'HbA1c', price: 600, discountPrice: 499, category: 'Diabetes' },
        { name: 'Thyroid Stimulating Hormone', price: 700, discountPrice: 599, category: 'Endocrinology' }
      ]
    },
    {
      id: 'lab4',
      name: 'Metropolis Healthcare',
      location: 'Chennai, Tamil Nadu',
      rating: 4.6,
      specializations: ['Cardiology', 'Infectious Diseases'],
      operatingHours: {
        weekdays: '7:30 AM - 8:30 PM',
        weekends: '7:30 AM - 2:30 PM'
      },
      tests: [
        { name: 'Cardiac Risk Markers', price: 2000, discountPrice: 1799, category: 'Cardiology' },
        { name: 'Iron Studies', price: 900, discountPrice: 749, category: 'Hematology' },
        { name: 'Dengue NS1 Antigen', price: 800, discountPrice: 699, category: 'Infectious Diseases' }
      ]
    },
    {
      id: 'lab5',
      name: 'Apollo Diagnostics',
      location: 'Hyderabad, Telangana',
      rating: 4.4,
      specializations: ['Comprehensive Health', 'Women\'s Health'],
      operatingHours: {
        weekdays: '7:00 AM - 9:00 PM',
        weekends: '7:00 AM - 4:00 PM'
      },
      tests: [
        { name: 'Thyroid Profile', price: 1300, discountPrice: 1099, category: 'Endocrinology' },
        { name: 'Complete Blood Count', price: 550, discountPrice: 449, category: 'Hematology' },
        { name: 'Lipid Profile', price: 950, discountPrice: 799, category: 'Cardiology' },
        { name: 'Pap Smear Test', price: 1200, discountPrice: 999, category: 'Women\'s Health' }
      ]
    }
  ],

  // Get all labs (with dummy data fallback)
  getAllLabs: async (params?: any) => {
    try {
      const response = await apiClient.get('/labs', { params });
      return response.data;
    } catch (error) {
      console.error('Using dummy labs data', error);
      return this.dummyLabs;
    }
  },

  // Get all tests (with dummy data fallback)
  getAllTests: async (params?: any) => {
    try {
      const response = await apiClient.get('/tests', { params });
      return response.data;
    } catch (error) {
      console.error('Using dummy tests data', error);
      const allTests = new Set();
      this.dummyLabs.forEach(lab => {
        lab.tests.forEach(test => allTests.add(test.name));
      });
      return Array.from(allTests);
    }
  },

  getLabById: async (id: string) => {
    try {
      const response = await apiClient.get(`/labs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Using dummy lab data', error);
      return this.dummyLabs.find(lab => lab.id === id);
    }
  },

  bookTest: async (testData: any) => {
    const response = await apiClient.post('/tests/book', testData);
    return response.data;
  },

  getLabsSortedByDiscountedPrice: async (sortOrder: 'asc' | 'desc' = 'asc') => {
    try {
      const response = await apiClient.get('/labs/sorted', { params: { sortOrder } });
      return response.data;
    } catch (error) {
      console.error('Using dummy sorted labs data', error);
      return [...this.dummyLabs].sort((a, b) => {
        const avgPriceA = a.tests.reduce((sum, test) => sum + test.discountPrice, 0) / a.tests.length;
        const avgPriceB = b.tests.reduce((sum, test) => sum + test.discountPrice, 0) / b.tests.length;
        return sortOrder === 'asc' ? avgPriceA - avgPriceB : avgPriceB - avgPriceA;
      });
    }
  }
};

// Mock data for development
const mockStats = {
  totalLabs: 3,
  totalAppointments: 42,
  totalTests: 86,
  totalRevenue: 68400,
  pendingAppointments: 5
};

const mockLabs = [
  {
    _id: '1',
    name: 'Metropolis Lab',
    address: {
      street: '123 Medical Plaza',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400001'
    },
    tests: [],
    stats: {
      totalAppointments: 42,
      totalTests: 86,
      totalRevenue: 68400,
      pendingAppointments: 5
    }
  }
];

// Lab owner related API calls
export const labOwnerAPI = {
  getLabStats: async () => {
    if (process.env.NODE_ENV === 'development') {
      return { data: mockStats };
    }
    return apiClient.get('/lab-owner/stats');
  },
  getOwnedLabs: async () => {
    if (process.env.NODE_ENV === 'development') {
      return { data: mockLabs };
    }
    return apiClient.get('/lab-owner/labs');
  },
  updateAppointmentStatus: async (appointmentId: string, status: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Mock update: Appointment ${appointmentId} status changed to ${status}`);
      return { data: { success: true } };
    }
    return apiClient.put(`/lab-owner/appointments/${appointmentId}/status`, { status });
  },
  deleteLab: async (id: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Mock delete: Lab ${id} deleted`);
      return { data: { success: true } };
    }
    return apiClient.delete(`/lab-owner/labs/${id}`);
  }
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
    try {
      // This is a mock implementation - replace with actual API call when backend is ready
      return {
        data: [],
        status: 200,
      };
    } catch (error) {
      console.error("Error fetching health records:", error);
      throw error;
    }
  },
  getRecordById: async (id: string) => {
    try {
      // Mock implementation
      return {
        data: {},
        status: 200,
      };
    } catch (error) {
      console.error(`Error fetching health record with id ${id}:`, error);
      throw error;
    }
  },
  createRecord: async (data: any) => {
    try {
      // Mock implementation
      return {
        data: { ...data, _id: Date.now().toString() },
        status: 201,
      };
    } catch (error) {
      console.error("Error creating health record:", error);
      throw error;
    }
  },
  updateRecord: async (id: string, data: any) => {
    try {
      // Mock implementation
      return {
        data: { ...data, _id: id },
        status: 200,
      };
    } catch (error) {
      console.error(`Error updating health record with id ${id}:`, error);
      throw error;
    }
  },
  deleteRecord: async (id: string) => {
    try {
      // Mock implementation
      return {
        data: { message: "Record deleted successfully" },
        status: 200,
      };
    } catch (error) {
      console.error(`Error deleting health record with id ${id}:`, error);
      throw error;
    }
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
