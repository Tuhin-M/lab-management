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
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage even if the API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
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
  },
  
  getLabsSortedByDiscountedPrice: async (sortOrder: 'asc' | 'desc' = 'asc') => {
    const response = await apiClient.get('/labs');
    
    const labsWithDiscountedPrice = response.data.map((lab: any) => {
      const avgDiscountedPrice = lab.tests.reduce((acc: number, test: any) => {
        const discountedPrice = test.price - (test.price * (test.discount || 0) / 100);
        return acc + discountedPrice;
      }, 0) / (lab.tests.length || 1);
      
      return {
        ...lab,
        avgDiscountedPrice
      };
    });
    
    const sortedLabs = labsWithDiscountedPrice.sort((a: any, b: any) => {
      return sortOrder === 'asc' 
        ? a.avgDiscountedPrice - b.avgDiscountedPrice
        : b.avgDiscountedPrice - a.avgDiscountedPrice;
    });
    
    return { data: sortedLabs };
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
