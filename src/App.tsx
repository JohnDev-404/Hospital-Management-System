import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { MainLayout } from './layouts/MainLayout';
import { useAuth } from './hooks/useAuth';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PatientRegistration } from './components/receptionist/PatientRegistration';
import { DoctorsManagement } from './pages/admin/DoctorsManagement';
import { PatientList } from './components/receptionist/PatientList';
import { CreateAppointment } from './components/receptionist/CreateAppointment';
import { AppointmentList } from './components/receptionist/AppointmentList';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DoctorSchedule } from './components/doctor/DoctorSchedule';
import { DoctorQueue } from './components/doctor/DoctorQueue';


// Temporary placeholder components (we'll build these next)
const ReceptionistDashboard: React.FC = () => <div className="card">Receptionist Dashboard - Coming Soon</div>;
const PatientManagement: React.FC = () => <div className="card">Patient Management - Coming Soon</div>;
const AppointmentManagement: React.FC = () => <div className="card">Appointment Management - Coming Soon</div>;
const QueueManager: React.FC = () => <div className="card">Queue Manager - Coming Soon</div>;
// const DoctorDashboard: React.FC = () => <div className="card">Doctor Dashboard - Coming Soon</div>;

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          {/* Receptionist Routes */}
          <Route path="receptionist/dashboard" element={<ReceptionistDashboard />} />
          <Route path="receptionist/patients" element={<PatientManagement />} />
          <Route path="receptionist/patients/register" element={<PatientRegistration />} />
          <Route path="receptionist/appointments" element={<AppointmentManagement />} />
          <Route path="receptionist/queue" element={<QueueManager />} />
          <Route path="receptionist/patients" element={<PatientList />} />
          <Route path="receptionist/patients/register" element={<PatientRegistration />} />
          <Route path="receptionist/appointments/create" element={<CreateAppointment />} />
          <Route path="receptionist/appointments/create/:patientId" element={<CreateAppointment />} />
          <Route path="receptionist/appointments" element={<AppointmentList />} />
          <Route path="receptionist/appointments/create" element={<CreateAppointment />} />
          <Route path="receptionist/appointments/create/:patientId" element={<CreateAppointment />} />   
          
          {/* Doctor Routes */}
          <Route path="doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="doctor/schedule" element={<DoctorSchedule />} />
          <Route path="doctor/queue" element={<DoctorQueue />} />
          <Route path="doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="doctor/schedule" element={<DoctorSchedule />} />
          <Route path="doctor/queue" element={<DoctorQueue />} />

          {/* Admin Routes */}
<Route path="admin/dashboard" element={<AdminDashboard />} />
<Route path="admin/doctors" element={<DoctorsManagement />} />
<Route path="admin/receptionists" element={<div>Receptionists Management - Coming Soon</div>} />
<Route path="admin/appointments" element={<div>All Appointments - Coming Soon</div>} />
          
          {/* Default redirect */}
          <Route path="" element={<Navigate to="/receptionist/dashboard" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;