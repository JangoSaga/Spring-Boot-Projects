import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalDepartments: number;
  totalAppointments: number;
  recentActivity: Array<{
    id: number;
    type: 'APPOINTMENT' | 'PATIENT' | 'RECORD';
    message: string;
    timestamp: string;
  }>;
  weeklyTrends: Array<{
    day: string;
    appointments: number;
  }>;
  departmentDistribution: Array<{
    name: string;
    value: number;
  }>;
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardStats(state, action: PayloadAction<DashboardStats>) {
      state.stats = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  }
});

export const { setDashboardStats, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
