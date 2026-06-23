import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Appointment {
  id: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  departmentId?: number;
  appointmentDate: string; // ISO format
  appointmentTime: string; // HH:mm
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  symptoms: string;
  notes?: string;
}

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  statusFilter: 'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  dateFilter: string | null; // Date string format YYYY-MM-DD
  isLoading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  statusFilter: 'ALL',
  dateFilter: null,
  isLoading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setAppointments(state, action: PayloadAction<Appointment[]>) {
      state.appointments = action.payload;
    },
    setSelectedAppointment(state, action: PayloadAction<Appointment | null>) {
      state.selectedAppointment = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'>) {
      state.statusFilter = action.payload;
    },
    setDateFilter(state, action: PayloadAction<string | null>) {
      state.dateFilter = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  }
});

export const { setAppointments, setSelectedAppointment, setStatusFilter, setDateFilter, setLoading, setError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
