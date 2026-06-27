import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { ToastProvider } from './components/Toast';

// Layouts
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';

// Public Guest Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { DepartmentManagementPage } from './pages/admin/DepartmentManagementPage';
import { DoctorManagementPage } from './pages/admin/DoctorManagementPage';
import { PatientManagementPage } from './pages/admin/PatientManagementPage';
import { AppointmentManagementPage } from './pages/admin/AppointmentManagementPage';
import { MedicalRecordsPage } from './pages/admin/MedicalRecordsPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { SettingsPage } from './pages/admin/SettingsPage';

// Doctor Pages
import { DoctorDashboardPage } from './pages/doctor/DoctorDashboardPage';
import { DoctorAppointmentsPage } from './pages/doctor/DoctorAppointmentsPage';
import { DoctorPatientsPage } from './pages/doctor/DoctorPatientsPage';
import { DoctorMedicalRecordsPage } from './pages/doctor/DoctorMedicalRecordsPage';
import { DoctorProfilePage } from './pages/doctor/DoctorProfilePage';

// Patient Pages
import { PatientDashboardPage } from './pages/patient/PatientDashboardPage';
import { BookAppointmentPage } from './pages/patient/BookAppointmentPage';
import { PatientAppointmentsPage } from './pages/patient/PatientAppointmentsPage';
import { PatientMedicalRecordsPage } from './pages/patient/PatientMedicalRecordsPage';
import { PatientProfilePage } from './pages/patient/PatientProfilePage';

// Query Client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              
              <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/" element={<LandingPage />} />

              {/* ==================================================== */}
              {/* PROTECTED ADMIN PORTAL ROUTES */}
              {/* ==================================================== */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <DashboardLayout role="ADMIN" />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="departments" element={<DepartmentManagementPage />} />
                <Route path="doctors" element={<DoctorManagementPage />} />
                <Route path="patients" element={<PatientManagementPage />} />
                <Route path="appointments" element={<AppointmentManagementPage />} />
                <Route path="medical-records" element={<MedicalRecordsPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* ==================================================== */}
              {/* PROTECTED DOCTOR PORTAL ROUTES */}
              {/* ==================================================== */}
              <Route
                path="/doctor"
                element={
                  <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DashboardLayout role="DOCTOR" />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/doctor/dashboard" replace />} />
                <Route path="dashboard" element={<DoctorDashboardPage />} />
                <Route path="appointments" element={<DoctorAppointmentsPage />} />
                <Route path="patients" element={<DoctorPatientsPage />} />
                <Route path="medical-records" element={<DoctorMedicalRecordsPage />} />
                <Route path="profile" element={<DoctorProfilePage />} />
              </Route>

              {/* ==================================================== */}
              {/* PROTECTED PATIENT PORTAL ROUTES */}
              {/* ==================================================== */}
              <Route
                path="/patient"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT']}>
                    <DashboardLayout role="PATIENT" />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/patient/dashboard" replace />} />
                <Route path="dashboard" element={<PatientDashboardPage />} />
                <Route path="book-appointment" element={<BookAppointmentPage />} />
                <Route path="appointments" element={<PatientAppointmentsPage />} />
                <Route path="medical-records" element={<PatientMedicalRecordsPage />} />
                <Route path="profile" element={<PatientProfilePage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  );
};
export default App;
