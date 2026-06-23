import { User } from '../store/slices/authSlice';
import { Department } from '../store/slices/departmentSlice';
import { Doctor } from '../store/slices/doctorSlice';
import { Patient } from '../store/slices/patientSlice';
import { Appointment } from '../store/slices/appointmentSlice';
import { DashboardStats } from '../store/slices/dashboardSlice';

// Helper to initialize and retrieve from localStorage to simulate database persistence
const getStoredOrInit = <T>(key: string, defaultVal: T): T => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored) as T;
    } catch {
      return defaultVal;
    }
  }
  localStorage.setItem(key, JSON.stringify(defaultVal));
  return defaultVal;
};

// 1. Initial Mock Users
export const initialUsers: User[] = [
  { id: 1, fullName: 'System Admin', email: 'admin@medicare.com', role: 'ADMIN', phone: '+1234567890', token: 'mock-jwt-admin-token' },
  { id: 2, fullName: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@medicare.com', role: 'DOCTOR', phone: '+1987654321', token: 'mock-jwt-doctor-token' },
  { id: 3, fullName: 'Alexander Pierce', email: 'alex@patient.com', role: 'PATIENT', phone: '+1555019922', token: 'mock-jwt-patient-token' },
];

// 2. Initial Mock Departments
export const initialDepartments: Department[] = [
  { id: 1, name: 'Cardiology', code: 'CARD', description: 'Advanced cardiovascular care, diagnostic imaging, electrophysiology, and treatment of complex heart conditions.', isActive: true },
  { id: 2, name: 'Pediatrics', code: 'PEDI', description: 'Compassionate pediatric care, developmental screenings, immunizations, and specialist treatment for youth.', isActive: true },
  { id: 3, name: 'Neurology', code: 'NEUR', description: 'Specialized diagnosis and clinical management of nervous system disorders, epilepsy, stroke, and chronic migraines.', isActive: true },
  { id: 4, name: 'Orthopedics', code: 'ORTH', description: 'Comprehensive musculoskeletal care, arthroscopy, joint reconstruction, and dedicated athletic sports rehabilitation.', isActive: true },
  { id: 5, name: 'General Medicine', code: 'GENM', description: 'Comprehensive primary care, chronic disease management, annual physical examinations, and general wellness checks.', isActive: true },
  { id: 6, name: 'Dermatology', code: 'DERM', description: 'Expert clinical treatment for chronic skin pathologies, dermatologic surgery, oncology screenings, and cosmetic procedures.', isActive: true },
];

// 3. Initial Mock Doctors
export const initialDoctors: Doctor[] = [
  { id: 1, fullName: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@medicare.com', departmentId: 1, departmentName: 'Cardiology', specialization: 'Interventional Cardiologist', qualification: 'MD, FACC, Harvard Medical School', experience: 16, consultationFee: 150, isActive: true, avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300' },
  { id: 2, fullName: 'Dr. Michael Chen', email: 'michael.chen@medicare.com', departmentId: 2, departmentName: 'Pediatrics', specialization: 'Pediatric Endocrinologist', qualification: 'MD, FAAP, Johns Hopkins University', experience: 11, consultationFee: 100, isActive: true, avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300' },
  { id: 3, fullName: 'Dr. Emily Watson', email: 'emily.watson@medicare.com', departmentId: 3, departmentName: 'Neurology', specialization: 'Clinical Neurologist & Neuroscientist', qualification: 'MD, PhD, Stanford Medicine', experience: 14, consultationFee: 180, isActive: true, avatarUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300' },
  { id: 4, fullName: 'Dr. James Anderson', email: 'james.anderson@medicare.com', departmentId: 5, departmentName: 'General Medicine', specialization: 'Internal Medicine Specialist', qualification: 'MBBS, MD, Mayo Clinic College', experience: 9, consultationFee: 80, isActive: true, avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300' },
  { id: 5, fullName: 'Dr. Lisa Vance', email: 'lisa.vance@medicare.com', departmentId: 6, departmentName: 'Dermatology', specialization: 'Clinical & Surgical Dermatologist', qualification: 'MD, FAAD, Yale School of Medicine', experience: 12, consultationFee: 120, isActive: true, avatarUrl: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=300' },
  { id: 6, fullName: 'Dr. Robert Vance', email: 'robert.vance@medicare.com', departmentId: 4, departmentName: 'Orthopedics', specialization: 'Orthopedic Joint Surgeon', qualification: 'MD, FAAOS, Columbia University Vagelos', experience: 15, consultationFee: 160, isActive: true, avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300' },
];

// 4. Initial Mock Patients
export const initialPatients: Patient[] = [
  { id: 1, fullName: 'John Doe', email: 'john.doe@gmail.com', phone: '+1555018899', gender: 'Male', dateOfBirth: '1981-06-15', bloodGroup: 'O+', address: '123 Pine St, Seattle, WA', medicalHistory: 'Hypertension, Seasonal allergies', isActive: true },
  { id: 2, fullName: 'Jane Smith', email: 'jane.smith@gmail.com', phone: '+1555017766', gender: 'Female', dateOfBirth: '1992-11-23', bloodGroup: 'A-', address: '456 Oak Rd, Portland, OR', medicalHistory: 'Asthma diagnosed in childhood', isActive: true },
  { id: 3, fullName: 'Alexander Pierce', email: 'alex@patient.com', phone: '+1555019922', gender: 'Male', dateOfBirth: '1988-03-08', bloodGroup: 'B+', address: '789 Maple Ave, Austin, TX', medicalHistory: 'No major history', isActive: true },
  { id: 4, fullName: 'Emma Wilson', email: 'emma.w@gmail.com', phone: '+1555015544', gender: 'Female', dateOfBirth: '1995-09-02', bloodGroup: 'AB+', address: '101 Cedar Ln, Denver, CO', medicalHistory: 'Lactose intolerance', isActive: true },
];

// 5. Initial Mock Appointments
export const initialAppointments: Appointment[] = [
  { id: 1, patientId: 1, patientName: 'John Doe', doctorId: 1, doctorName: 'Dr. Sarah Jenkins', departmentId: 1, appointmentDate: '2026-06-22', appointmentTime: '09:00', status: 'SCHEDULED', symptoms: 'Mild chest pain and shortness of breath during morning jogs.' },
  { id: 2, patientId: 2, patientName: 'Jane Smith', doctorId: 2, doctorName: 'Dr. Michael Chen', departmentId: 2, appointmentDate: '2026-06-22', appointmentTime: '10:30', status: 'SCHEDULED', symptoms: 'Child running high fever and dry cough since yesterday.' },
  { id: 3, patientId: 3, patientName: 'Alexander Pierce', doctorId: 3, doctorName: 'Dr. Emily Watson', departmentId: 3, appointmentDate: '2026-06-21', appointmentTime: '14:00', status: 'COMPLETED', symptoms: 'Frequent migraines and sensitivity to bright lights.', notes: 'Prescribed migraine preventative medication, follow up in 2 weeks.' },
  { id: 4, patientId: 4, patientName: 'Emma Wilson', doctorId: 4, doctorName: 'Dr. James Anderson', departmentId: 5, appointmentDate: '2026-06-20', appointmentTime: '11:00', status: 'CANCELLED', symptoms: 'Severe acid reflux and abdominal bloating.' },
];

// 6. Mock Medical Record Types
export interface MedicalRecord {
  id: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  diagnosis: string;
  symptoms: string;
  prescription: string; // List of drugs
  treatmentNotes: string;
  followUpDate?: string;
  createdAt: string;
}

export const initialMedicalRecords: MedicalRecord[] = [
  {
    id: 1,
    patientId: 3,
    patientName: 'Alexander Pierce',
    doctorId: 3,
    doctorName: 'Dr. Emily Watson',
    diagnosis: 'Classical Migraine with Aura',
    symptoms: 'Frequent severe left-sided headache, flashing lights in vision.',
    prescription: 'Sumatriptan 50mg (take at onset), Propranolol 40mg (once daily)',
    treatmentNotes: 'Advised lifestyle modifications including food trigger diary, avoiding sleep disruptions, and staying hydrated. Patient was responsive.',
    followUpDate: '2026-07-05',
    createdAt: '2026-06-21T14:30:00Z'
  },
  {
    id: 2,
    patientId: 1,
    patientName: 'John Doe',
    doctorId: 1,
    doctorName: 'Dr. Sarah Jenkins',
    diagnosis: 'Stage 1 Essential Hypertension',
    symptoms: 'Mild morning headache, blood pressure consistently around 142/92.',
    prescription: 'Lisinopril 10mg (once daily in morning)',
    treatmentNotes: 'Advised low sodium diet, regular moderate cardiovascular exercise (30 mins walking), and home blood pressure monitoring.',
    followUpDate: '2026-07-15',
    createdAt: '2026-05-15T10:00:00Z'
  }
];

// Get persisted states
export const getMockUsers = () => getStoredOrInit('mc_users', initialUsers);
export const getMockDepartments = () => getStoredOrInit('mc_departments', initialDepartments);
export const getMockDoctors = () => getStoredOrInit('mc_doctors', initialDoctors);
export const getMockPatients = () => getStoredOrInit('mc_patients', initialPatients);
export const getMockAppointments = () => getStoredOrInit('mc_appointments', initialAppointments);
export const getMockMedicalRecords = () => getStoredOrInit('mc_medical_records', initialMedicalRecords);

// Helper updates
export const saveMockData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Generate Dashboard Statistics dynamically
export const getMockDashboardStats = (): DashboardStats => {
  const patients = getMockPatients();
  const doctors = getMockDoctors();
  const departments = getMockDepartments();
  const appointments = getMockAppointments();

  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const totalDepartments = departments.length;
  const totalAppointments = appointments.length;

  const recentActivity = [
    { id: 1, type: 'APPOINTMENT' as const, message: 'New appointment booked for John Doe with Dr. Sarah Jenkins', timestamp: '2 hours ago' },
    { id: 2, type: 'PATIENT' as const, message: 'New patient Emma Wilson registered', timestamp: '5 hours ago' },
    { id: 3, type: 'RECORD' as const, message: 'Prescription added for Alexander Pierce', timestamp: '1 day ago' },
    { id: 4, type: 'APPOINTMENT' as const, message: 'Appointment cancelled for Emma Wilson', timestamp: '1 day ago' },
  ];

  const weeklyTrends = [
    { day: 'Mon', appointments: 15 },
    { day: 'Tue', appointments: 22 },
    { day: 'Wed', appointments: 18 },
    { day: 'Thu', appointments: 28 },
    { day: 'Fri', appointments: 24 },
    { day: 'Sat', appointments: 12 },
    { day: 'Sun', appointments: 5 },
  ];

  // Distribute doctors/appointments into departments
  const departmentDistribution = departments.map(d => {
    const docs = doctors.filter(doc => doc.departmentId === d.id).length;
    return {
      name: d.name,
      value: docs * 25 + 10 // Mock a good percentage
    };
  });

  return {
    totalPatients,
    totalDoctors,
    totalDepartments,
    totalAppointments,
    recentActivity,
    weeklyTrends,
    departmentDistribution
  };
};
