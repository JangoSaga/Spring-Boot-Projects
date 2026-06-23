import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Doctor {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  departmentId: number;
  departmentName?: string;
  specialization: string;
  qualification: string;
  experience: number; // in years
  consultationFee: number;
  isActive: boolean;
  avatarUrl?: string;
}

interface DoctorState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  searchQuery: string;
  filterDepartmentId: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
  searchQuery: '',
  filterDepartmentId: null,
  isLoading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setDoctors(state, action: PayloadAction<Doctor[]>) {
      state.doctors = action.payload;
    },
    setSelectedDoctor(state, action: PayloadAction<Doctor | null>) {
      state.selectedDoctor = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setFilterDepartmentId(state, action: PayloadAction<number | null>) {
      state.filterDepartmentId = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  }
});

export const { setDoctors, setSelectedDoctor, setSearchQuery, setFilterDepartmentId, setLoading, setError } = doctorSlice.actions;
export default doctorSlice.reducer;
