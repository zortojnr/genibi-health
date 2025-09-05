import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Health API endpoints
export const healthApi = {
  // Vital Signs
  getVitalSigns: () => api.get('/health/vitals'),
  addVitalSigns: (data: any) => api.post('/health/vitals', data),
  
  // Medications
  getMedications: () => api.get('/health/medications'),
  addMedication: (data: any) => api.post('/health/medications', data),
  updateMedication: (id: string, data: any) => api.put(`/health/medications/${id}`, data),
  deleteMedication: (id: string) => api.delete(`/health/medications/${id}`),
  
  // Appointments
  getAppointments: () => api.get('/appointments'),
  bookAppointment: (data: any) => api.post('/appointments', data),
  updateAppointment: (id: string, data: any) => api.put(`/appointments/${id}`, data),
  cancelAppointment: (id: string) => api.delete(`/appointments/${id}`),
  
  // Mood Tracking
  getMoodEntries: () => api.get('/health/mood'),
  addMoodEntry: (data: any) => api.post('/health/mood', data),
  
  // Health Records
  getHealthRecords: () => api.get('/health-records'),
  uploadHealthRecord: (data: FormData) => api.post('/health-records', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  // Wellness
  getWellnessData: () => api.get('/wellness'),
  updateWellnessGoals: (data: any) => api.put('/wellness/goals', data),
  
  // Chat
  sendChatMessage: (message: string, sessionId: string) => 
    api.post('/chat/message', { message, sessionId }),
  getChatHistory: (sessionId: string) => api.get(`/chat/history/${sessionId}`),
};

export default api;
