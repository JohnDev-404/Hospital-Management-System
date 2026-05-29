import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BookAppointment } from './pages/BookAppointment';
import { TrackQueue } from './pages/TrackQueue';
import { MainLayout } from './layouts/MainLayout';
import { useAuth } from './hooks/useAuth';

// Admin imports
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DoctorsManagement } from './pages/admin/DoctorsManagement';

// Super Admin imports
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';
import { UserManagement } from './pages/superadmin/UserManagement';

// Receptionist imports
import { PatientRegistration } from './components/receptionist/PatientRegistration';
import { PatientList } from './components/receptionist/PatientList';
import { CreateAppointment } from './components/receptionist/CreateAppointment';
import { AppointmentList } from './components/receptionist/AppointmentList';

// Doctor imports
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DoctorSchedule } from './components/doctor/DoctorSchedule';
import { DoctorQueue } from './components/doctor/DoctorQueue';
import { MyPatientQueue } from './components/doctor/MyPatientQueue';

const PrivateRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const dashboardPath = `/${user.role.toLowerCase()}/dashboard`;
    return <Navigate to={dashboardPath} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ========== PUBLIC ROUTES (No authentication required) ========== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/track-queue" element={<TrackQueue />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* ========== PROTECTED ROUTES (Authentication required) ========== */}
        <Route path="/" element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          {/* Super Admin Routes */}
          <Route path="superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="superadmin/users" element={<UserManagement />} />
          
          {/* Admin Routes */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/doctors" element={<DoctorsManagement />} />
          <Route path="admin/receptionists" element={<UserManagement />} />
          <Route path="admin/appointments" element={<AppointmentList />} />
          
          {/* Receptionist Routes */}
          <Route path="receptionist/dashboard" element={<AppointmentList />} />
          <Route path="receptionist/patients" element={<PatientList />} />
          <Route path="receptionist/patients/register" element={<PatientRegistration />} />
          <Route path="receptionist/appointments" element={<AppointmentList />} />
          <Route path="receptionist/appointments/create" element={<CreateAppointment />} />
          <Route path="receptionist/appointments/create/:patientId" element={<CreateAppointment />} />
          <Route path="receptionist/queue" element={<DoctorQueue />} />
          
          {/* Doctor Routes */}
          <Route path="doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="doctor/schedule" element={<DoctorSchedule />} />
          <Route path="doctor/queue" element={<DoctorQueue />} />
          <Route path="doctor/my-queue" element={<MyPatientQueue />} />
        </Route>
        
        {/* ========== 404 FALLBACK ========== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;