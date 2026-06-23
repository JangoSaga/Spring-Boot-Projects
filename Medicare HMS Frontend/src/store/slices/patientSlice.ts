import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Patient {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  address?: string;
  medicalHistory?: string;
  isActive: boolean;
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  selectedPatient: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatients(state, action: PayloadAction<Patient[]>) {
      state.patients = action.payload;
    },
    setSelectedPatient(state, action: PayloadAction<Patient | null>) {
      state.selectedPatient = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  }
});

export const { setPatients, setSelectedPatient, setSearchQuery, setLoading, setError } = patientSlice.actions;
export default patientSlice.reducer;
