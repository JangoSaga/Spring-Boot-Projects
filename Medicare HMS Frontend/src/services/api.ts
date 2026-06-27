import axios from 'axios';
import { Appointment } from '../store/slices/appointmentSlice';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Backend configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for JWT Injector
apiClient.interceptors.request.use((config) => {
  const auth = localStorage.getItem('medicare_auth');
  if (auth) {
    try {
      const { user } = JSON.parse(auth);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error('Failed to parse token for request interceptor', e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor for handling 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

// Mock database mode is removed entirely. All calls go directly to the live backend.
export const isMockMode = (): boolean => false;
export const setMockMode = (_active: boolean) => {};

// ==========================================
// 1. AUTHENTICATION SERVICES
// ==========================================
export const authService = {
  login: async (email: string, passwordHash: string) => {
    const response = await apiClient.post('/api/auth/login', { email, passwordHash });
    return response.data;
  },

  register: async (fullName: string, email: string, role: string, phone: string, passwordHash: string) => {
    const response = await apiClient.post('/api/auth/register', { fullName, email, role, phone, passwordHash });
    return response.data;
  }
};

// ==========================================
// 2. DEPARTMENT SERVICES
// ==========================================
export const departmentService = {
  getAll: async () => {
    const response = await apiClient.get('/api/departments');
    return response.data.content || response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/api/departments', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/api/departments/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/api/departments/${id}`);
    return response.data;
  }
};

// ==========================================
// 3. DOCTOR SERVICES
// ==========================================
export const doctorService = {
  getAll: async () => {
    const response = await apiClient.get('/api/doctors');
    return response.data.content || response.data;
  },
  getByDepartment: async (deptId: number) => {
    const response = await apiClient.get(`/api/doctors/department/${deptId}`);
    return response.data.content || response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get(`/api/doctors/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/api/doctors', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/api/doctors/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/api/doctors/${id}`);
    return response.data;
  }
};

// ==========================================
// 4. PATIENT SERVICES
// ==========================================
export const patientService = {
  getAll: async () => {
    const response = await apiClient.get('/api/patients');
    return response.data.content || response.data;
  },
  getById: async (id: number) => {
    const response = await apiClient.get(`/api/patients/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/api/patients', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/api/patients/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/api/patients/${id}`);
    return response.data;
  }
};

// ==========================================
// 5. APPOINTMENT SERVICES
// ==========================================
export const appointmentService = {
  getAll: async () => {
    const response = await apiClient.get('/api/appointments');
    return response.data.content || response.data;
  },
  getByDoctor: async (doctorId: number) => {
    const response = await apiClient.get(`/api/appointments/doctor/${doctorId}`);
    return response.data.content || response.data;
  },
  getByPatient: async (patientId: number) => {
    const response = await apiClient.get(`/api/appointments/patient/${patientId}`);
    return response.data.content || response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/api/appointments', data);
    return response.data;
  },
  cancel: async (id: number) => {
    const response = await apiClient.patch(`/api/appointments/${id}/cancel`);
    return response.data;
  },
  complete: async (id: number) => {
    const response = await apiClient.patch(`/api/appointments/${id}/complete`);
    return response.data;
  }
};

// ==========================================
// 6. MEDICAL RECORD SERVICES
// ==========================================
export const medicalRecordService = {
  getByPatient: async (patientId: number) => {
    const response = await apiClient.get(`/api/medical-records/patient/${patientId}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/api/medical-records', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/api/medical-records/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await apiClient.delete(`/api/medical-records/${id}`);
    return response.data;
  }
};

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalDepartments: number;
  totalAppointments: number;
  recentActivity: any[];
  weeklyTrends: any[];
  departmentDistribution: any[];
}

// ==========================================
// 7. DASHBOARD / METRICS SERVICES
// ==========================================
export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const [pts, docs, depts, appts] = await Promise.all([
      apiClient.get('/api/patients'),
      apiClient.get('/api/doctors'),
      apiClient.get('/api/departments'),
      apiClient.get('/api/appointments')
    ]);
    
    return {
      totalPatients: pts.data.totalElements || pts.data.length || 0,
      totalDoctors: docs.data.totalElements || docs.data.length || 0,
      totalDepartments: depts.data.totalElements || depts.data.length || 0,
      totalAppointments: appts.data.totalElements || appts.data.length || 0,
      recentActivity: [] as any[],
      weeklyTrends: [] as any[],
      departmentDistribution: [] as any[]
    };
  }
};
