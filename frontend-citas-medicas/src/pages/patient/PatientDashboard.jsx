// src/pages/patient/PatientDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PatientDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'paciente') {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-red-600">Acceso Denegado</h2>
        <p className="text-gray-600 mt-4">Por favor, inicia sesión como paciente para acceder a este panel.</p>
        <Link to="/login" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
          Ir a Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
        Panel de Control del Paciente
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Bienvenido, <span className="font-semibold text-blue-600">{user.nombre || 'Paciente'}</span>. Aquí puedes gestionar tus citas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Agendar Nueva Cita</h2>
          <p className="text-gray-700 mb-4">
            Encuentra y reserva una cita con el médico de tu preferencia.
          </p>
          <Link
            to="/book-appointment"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300"
          >
            Agendar Cita
          </Link>
        </div>

        <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-3">Mis Citas</h2>
          <p className="text-gray-700 mb-4">
            Revisa el estado de tus citas agendadas, cancela o reagenda.
          </p>
            <Link
            to="/my-appointments"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300"
            >
            Ver Citas
            </Link>
            {/* Esta ruta aún no está definida en App.jsx, es un ejemplo */}

        </div>
      </div>

    </div>
  );
};

export default PatientDashboard;
