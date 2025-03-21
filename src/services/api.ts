
import axios from 'axios';

// Base API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
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
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
  },
  
  getProfile: async () => {
    return apiClient.get('/auth/profile');
  },
  
  updateProfile: async (profileData: any) => {
    return apiClient.put('/auth/profile', profileData);
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
  getAllLabs: async (params?: any) => {
    return apiClient.get('/labs', { params });
  },
  
  getLabById: async (id: string) => {
    return apiClient.get(`/labs/${id}`);
  },
  
  getAllTests: async (params?: any) => {
    return apiClient.get('/tests', { params });
  },
  
  bookTest: async (testData: any) => {
    return apiClient.post('/test-bookings', testData);
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
    return apiClient.get('/health-records');
  },
  
  getRecordById: async (id: string) => {
    return apiClient.get(`/health-records/${id}`);
  },
  
  createRecord: async (recordData: any) => {
    return apiClient.post('/health-records', recordData);
  },
  
  deleteRecord: async (id: string) => {
    return apiClient.delete(`/health-records/${id}`);
  }
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

export default apiClient;
