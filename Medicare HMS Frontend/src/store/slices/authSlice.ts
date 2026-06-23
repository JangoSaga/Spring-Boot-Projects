import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
  phone?: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const getStoredAuth = (): AuthState | null => {
  try {
    const stored = localStorage.getItem('medicare_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.user && parsed.isAuthenticated) {
        return {
          user: parsed.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        };
      }
    }
  } catch (e) {
    console.error('Failed to parse stored auth', e);
  }
  return null;
};

const initialState: AuthState = getStoredAuth() || {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      localStorage.setItem('medicare_auth', JSON.stringify({
        user: action.payload,
        isAuthenticated: true
      }));
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      localStorage.removeItem('medicare_auth');
    },
    clearError(state) {
      state.error = null;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
