// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ManageAvailabilityPage from './pages/doctor/ManageAvailabilityPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext'; // Importa el proveedor de autenticación
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import AdminAssignEspecialidadesPage from './pages/admin/AdminAssignEspecialidadesPage';
import AdminEspecialidadesPage from './pages/admin/AdminEspecialidadesPage';
import AdminMedicosPage from './pages/admin/AdminMedicosPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReportesPage from './pages/admin/AdminReportesPage';

function App() {
  return (
    <Router>
      <AuthProvider> 
        <div className="flex flex-col min-h-screen font-inter">
          <Navbar />
          <main className="flex-grow container mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/book-appointment" element={<BookAppointmentPage />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/manage-availability" element={<ManageAvailabilityPage />} />
              <Route path="*" element={<NotFoundPage />} /> {/* Ruta para 404 */}
              <Route path="/doctor-appointments" element={<DoctorAppointmentsPage />} />
              <Route path="/my-appointments" element={<MyAppointmentsPage />} />

              <Route path="/admin/asignar-especialidades" element={<AdminAssignEspecialidadesPage />} />
              <Route path="/admin/especialidades" element={<AdminEspecialidadesPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/medicos" element={<AdminMedicosPage />} />
              <Route path="/admin/reportes" element={<AdminReportesPage />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;