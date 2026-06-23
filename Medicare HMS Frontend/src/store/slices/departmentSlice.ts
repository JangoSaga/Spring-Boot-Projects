import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Department {
  id: number;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
}

interface DepartmentState {
  departments: Department[];
  selectedDepartmentId: number | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  selectedDepartmentId: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    setDepartments(state, action: PayloadAction<Department[]>) {
      state.departments = action.payload;
    },
    setSelectedDepartment(state, action: PayloadAction<number | null>) {
      state.selectedDepartmentId = action.payload;
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

export const { setDepartments, setSelectedDepartment, setSearchQuery, setLoading, setError } = departmentSlice.actions;
export default departmentSlice.reducer;
