import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import departmentReducer from './slices/departmentSlice';
import doctorReducer from './slices/doctorSlice';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    department: departmentReducer,
    doctor: doctorReducer,
    patient: patientReducer,
    appointment: appointmentReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
