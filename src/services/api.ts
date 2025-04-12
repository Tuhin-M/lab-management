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
      localStorage.setItem('userRole', response.data.role);
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
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  },
  
  getProfile: async () => {
    return apiClient.get('/auth/profile');
  },
  
  updateProfile: async (profileData: any) => {
    return apiClient.put('/auth/profile', profileData);
  },
  
  getCurrentUserRole: () => {
    return localStorage.getItem('userRole') || 'user';
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

// Lab Owner specific API calls
export const labOwnerAPI = {
  getOwnedLabs: async () => {
    return apiClient.get('/lab-owner/labs');
  },
  
  createLab: async (labData: any) => {
    return apiClient.post('/lab-owner/labs', labData);
  },
  
  updateLab: async (id: string, labData: any) => {
    return apiClient.put(`/lab-owner/labs/${id}`, labData);
  },
  
  deleteLab: async (id: string) => {
    return apiClient.delete(`/lab-owner/labs/${id}`);
  },
  
  getLabAppointments: async (labId: string) => {
    return apiClient.get(`/lab-owner/labs/${labId}/appointments`);
  },
  
  updateAppointmentStatus: async (appointmentId: string, status: string) => {
    return apiClient.put(`/lab-owner/appointments/${appointmentId}/status`, { status });
  }
};

export default apiClient;
