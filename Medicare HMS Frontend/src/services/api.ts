import axios from 'axios';
import * as mockDb from './mockData';
import { Appointment } from '../store/slices/appointmentSlice';

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

// Check if Mock Mode is active (Default: true)
export const isMockMode = (): boolean => {
  const flag = localStorage.getItem('medicare_use_mock');
  return flag !== 'false';
};

export const setMockMode = (active: boolean) => {
  localStorage.setItem('medicare_use_mock', active ? 'true' : 'false');
};

// Sleep helper for simulated network delay
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// 1. AUTHENTICATION SERVICES
// ==========================================
export const authService = {
  login: async (email: string, passwordHash: string) => {
    if (isMockMode()) {
      await delay(600);
      const users = mockDb.getMockUsers();
      // Match email (password matches any for mock ease)
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        return user;
      }
      // If patient email is typed and not found, auto-create a mock patient
      if (email.includes('@patient.com') || email.includes('patient')) {
        const newUser = { id: 4, fullName: 'New Patient', email, role: 'PATIENT' as const, phone: '+12345678', token: 'mock-token' };
        users.push(newUser);
        mockDb.saveMockData('mc_users', users);
        return newUser;
      }
      throw new Error('Invalid email or password');
    }
    const response = await apiClient.post('/api/auth/login', { email, passwordHash });
    return response.data;
  },

  register: async (fullName: string, email: string, role: string, phone: string, passwordHash: string) => {
    if (isMockMode()) {
      await delay(600);
      const users = mockDb.getMockUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already registered');
      }
      const newUserId = users.length + 1;
      const newUser = { id: newUserId, fullName, email, role: role as any, phone, token: `mock-token-${newUserId}` };
      users.push(newUser);
      mockDb.saveMockData('mc_users', users);

      // If patient, also onboard patient profile
      if (role === 'PATIENT') {
        const patients = mockDb.getMockPatients();
        patients.push({
          id: newUserId,
          fullName,
          email,
          phone,
          gender: 'Unspecified',
          dateOfBirth: '1990-01-01',
          bloodGroup: 'O+',
          isActive: true
        });
        mockDb.saveMockData('mc_patients', patients);
      } else if (role === 'DOCTOR') {
        const doctors = mockDb.getMockDoctors();
        doctors.push({
          id: newUserId,
          fullName,
          email,
          phone,
          departmentId: 1,
          departmentName: 'Cardiology',
          specialization: 'Consultant',
          qualification: 'MD',
          experience: 1,
          consultationFee: 50,
          isActive: true
        });
        mockDb.saveMockData('mc_doctors', doctors);
      }
      return newUser;
    }
    const response = await apiClient.post('/api/auth/register', { fullName, email, role, phone, passwordHash });
    return response.data;
  }
};

// ==========================================
// 2. DEPARTMENT SERVICES
// ==========================================
export const departmentService = {
  getAll: async () => {
    if (isMockMode()) {
      await delay();
      return mockDb.getMockDepartments();
    }
    const response = await apiClient.get('/api/departments');
    // Handle Pageable response or direct list
    return response.data.content || response.data;
  },
  create: async (data: any) => {
    if (isMockMode()) {
      await delay();
      const depts = mockDb.getMockDepartments();
      const newItem = { id: depts.length + 1, ...data, isActive: true };
      depts.push(newItem);
      mockDb.saveMockData('mc_departments', depts);
      return newItem;
    }
    const response = await apiClient.post('/api/departments', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    if (isMockMode()) {
      await delay();
      const depts = mockDb.getMockDepartments();
      const index = depts.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Department not found');
      depts[index] = { ...depts[index], ...data };
      mockDb.saveMockData('mc_departments', depts);
      return depts[index];
    }
    const response = await apiClient.put(`/api/departments/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    if (isMockMode()) {
      await delay();
      let depts = mockDb.getMockDepartments();
      depts = depts.filter(d => d.id !== id);
      mockDb.saveMockData('mc_departments', depts);
      return { message: 'Department deleted successfully' };
    }
    const response = await apiClient.delete(`/api/departments/${id}`);
    return response.data;
  }
};

// ==========================================
// 3. DOCTOR SERVICES
// ==========================================
export const doctorService = {
  getAll: async () => {
    if (isMockMode()) {
      await delay();
      return mockDb.getMockDoctors();
    }
    const response = await apiClient.get('/api/doctors');
    return response.data.content || response.data;
  },
  getByDepartment: async (deptId: number) => {
    if (isMockMode()) {
      await delay();
      const doctors = mockDb.getMockDoctors();
      return doctors.filter(d => d.departmentId === deptId);
    }
    const response = await apiClient.get(`/api/doctors/department/${deptId}`);
    return response.data.content || response.data;
  },
  getById: async (id: number) => {
    if (isMockMode()) {
      await delay();
      const doctors = mockDb.getMockDoctors();
      const doc = doctors.find(d => d.id === id);
      if (!doc) throw new Error('Doctor not found');
      return doc;
    }
    const response = await apiClient.get(`/api/doctors/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    if (isMockMode()) {
      await delay();
      const doctors = mockDb.getMockDoctors();
      const newDoc = { id: doctors.length + 1, ...data, isActive: true };
      doctors.push(newDoc);
      mockDb.saveMockData('mc_doctors', doctors);
      return newDoc;
    }
    const response = await apiClient.post('/api/doctors', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    if (isMockMode()) {
      await delay();
      const doctors = mockDb.getMockDoctors();
      const idx = doctors.findIndex(d => d.id === id);
      if (idx === -1) throw new Error('Doctor not found');
      doctors[idx] = { ...doctors[idx], ...data };
      mockDb.saveMockData('mc_doctors', doctors);
      return doctors[idx];
    }
    const response = await apiClient.put(`/api/doctors/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    if (isMockMode()) {
      await delay();
      let doctors = mockDb.getMockDoctors();
      doctors = doctors.filter(d => d.id !== id);
      mockDb.saveMockData('mc_doctors', doctors);
      return { message: 'Doctor deleted successfully' };
    }
    const response = await apiClient.delete(`/api/doctors/${id}`);
    return response.data;
  }
};

// ==========================================
// 4. PATIENT SERVICES
// ==========================================
export const patientService = {
  getAll: async () => {
    if (isMockMode()) {
      await delay();
      return mockDb.getMockPatients();
    }
    const response = await apiClient.get('/api/patients');
    return response.data.content || response.data;
  },
  getById: async (id: number) => {
    if (isMockMode()) {
      await delay();
      const patients = mockDb.getMockPatients();
      const pat = patients.find(p => p.id === id);
      if (!pat) throw new Error('Patient not found');
      return pat;
    }
    const response = await apiClient.get(`/api/patients/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    if (isMockMode()) {
      await delay();
      const patients = mockDb.getMockPatients();
      const newPat = { id: patients.length + 1, ...data, isActive: true };
      patients.push(newPat);
      mockDb.saveMockData('mc_patients', patients);
      return newPat;
    }
    const response = await apiClient.post('/api/patients', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    if (isMockMode()) {
      await delay();
      const patients = mockDb.getMockPatients();
      const idx = patients.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Patient not found');
      patients[idx] = { ...patients[idx], ...data };
      mockDb.saveMockData('mc_patients', patients);
      return patients[idx];
    }
    const response = await apiClient.put(`/api/patients/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    if (isMockMode()) {
      await delay();
      let patients = mockDb.getMockPatients();
      patients = patients.filter(p => p.id !== id);
      mockDb.saveMockData('mc_patients', patients);
      return { message: 'Patient deleted successfully' };
    }
    const response = await apiClient.delete(`/api/patients/${id}`);
    return response.data;
  }
};

// ==========================================
// 5. APPOINTMENT SERVICES
// ==========================================
export const appointmentService = {
  getAll: async () => {
    if (isMockMode()) {
      await delay();
      return mockDb.getMockAppointments();
    }
    const response = await apiClient.get('/api/appointments');
    return response.data.content || response.data;
  },
  getByDoctor: async (doctorId: number) => {
    if (isMockMode()) {
      await delay();
      const appts = mockDb.getMockAppointments();
      return appts.filter(a => a.doctorId === doctorId);
    }
    const response = await apiClient.get(`/api/appointments/doctor/${doctorId}`);
    return response.data.content || response.data;
  },
  getByPatient: async (patientId: number) => {
    if (isMockMode()) {
      await delay();
      const appts = mockDb.getMockAppointments();
      return appts.filter(a => a.patientId === patientId);
    }
    const response = await apiClient.get(`/api/appointments/patient/${patientId}`);
    return response.data.content || response.data;
  },
  create: async (data: any) => {
    if (isMockMode()) {
      await delay();
      const appts = mockDb.getMockAppointments();
      const patients = mockDb.getMockPatients();
      const doctors = mockDb.getMockDoctors();

      const patient = patients.find(p => p.id === data.patientId);
      const doctor = doctors.find(d => d.id === data.doctorId);

      const newAppt: Appointment = {
        id: appts.length + 1,
        patientId: data.patientId,
        patientName: patient?.fullName || 'Unknown Patient',
        doctorId: data.doctorId,
        doctorName: doctor?.fullName || 'Unknown Doctor',
        departmentId: doctor?.departmentId || 1,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        symptoms: data.symptoms,
        status: 'SCHEDULED'
      };

      appts.push(newAppt);
      mockDb.saveMockData('mc_appointments', appts);
      return newAppt;
    }
    const response = await apiClient.post('/api/appointments', data);
    return response.data;
  },
  cancel: async (id: number) => {
    if (isMockMode()) {
      await delay();
      const appts = mockDb.getMockAppointments();
      const idx = appts.findIndex(a => a.id === id);
      if (idx === -1) throw new Error('Appointment not found');
      appts[idx].status = 'CANCELLED';
      mockDb.saveMockData('mc_appointments', appts);
      return appts[idx];
    }
    const response = await apiClient.patch(`/api/appointments/${id}/cancel`);
    return response.data;
  },
  complete: async (id: number) => {
    if (isMockMode()) {
      await delay();
      const appts = mockDb.getMockAppointments();
      const idx = appts.findIndex(a => a.id === id);
      if (idx === -1) throw new Error('Appointment not found');
      appts[idx].status = 'COMPLETED';
      mockDb.saveMockData('mc_appointments', appts);
      return appts[idx];
    }
    const response = await apiClient.patch(`/api/appointments/${id}/complete`);
    return response.data;
  }
};

// ==========================================
// 6. MEDICAL RECORD SERVICES
// ==========================================
export const medicalRecordService = {
  getByPatient: async (patientId: number) => {
    if (isMockMode()) {
      await delay();
      const records = mockDb.getMockMedicalRecords();
      return records.filter(r => r.patientId === patientId);
    }
    const response = await apiClient.get(`/api/medical-records/patient/${patientId}`);
    return response.data;
  },
  create: async (data: any) => {
    if (isMockMode()) {
      await delay();
      const records = mockDb.getMockMedicalRecords();
      const patients = mockDb.getMockPatients();
      const doctors = mockDb.getMockDoctors();

      const patient = patients.find(p => p.id === Number(data.patientId));
      const doctor = doctors.find(d => d.id === Number(data.doctorId));

      const newRecord: mockDb.MedicalRecord = {
        id: records.length + 1,
        patientId: Number(data.patientId),
        patientName: patient?.fullName || 'Unknown Patient',
        doctorId: Number(data.doctorId),
        doctorName: doctor?.fullName || 'Unknown Doctor',
        diagnosis: data.diagnosis,
        symptoms: data.symptoms,
        prescription: data.prescription,
        treatmentNotes: data.treatmentNotes,
        followUpDate: data.followUpDate,
        createdAt: new Date().toISOString()
      };

      records.push(newRecord);
      mockDb.saveMockData('mc_medical_records', records);
      return newRecord;
    }
    const response = await apiClient.post('/api/medical-records', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    if (isMockMode()) {
      await delay();
      const records = mockDb.getMockMedicalRecords();
      const idx = records.findIndex(r => r.id === id);
      if (idx === -1) throw new Error('Record not found');
      records[idx] = { ...records[idx], ...data };
      mockDb.saveMockData('mc_medical_records', records);
      return records[idx];
    }
    const response = await apiClient.put(`/api/medical-records/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    if (isMockMode()) {
      await delay();
      let records = mockDb.getMockMedicalRecords();
      records = records.filter(r => r.id !== id);
      mockDb.saveMockData('mc_medical_records', records);
      return { message: 'Medical record deleted successfully' };
    }
    const response = await apiClient.delete(`/api/medical-records/${id}`);
    return response.data;
  }
};

// ==========================================
// 7. DASHBOARD / METRICS SERVICES
// ==========================================
export const dashboardService = {
  getStats: async () => {
    if (isMockMode()) {
      await delay();
      return mockDb.getMockDashboardStats();
    }
    // Fetch individual metrics and assemble
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
      recentActivity: [],
      weeklyTrends: [],
      departmentDistribution: []
    };
  }
};
