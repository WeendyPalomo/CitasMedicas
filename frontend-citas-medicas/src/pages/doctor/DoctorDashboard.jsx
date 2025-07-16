// src/pages/doctor/DoctorDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DoctorDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'medico') {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-red-600">Acceso Denegado</h2>
        <p className="text-gray-600 mt-4">Por favor, inicia sesión como médico para acceder a este panel.</p>
        <Link to="/login" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
          Ir a Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
        Panel de Control del Médico
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Bienvenido, <span className="font-semibold text-green-600">{user.nombre || 'Dr./Dra.'}</span>. Gestiona tu agenda y disponibilidad.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-50 p-6 rounded-lg shadow-md border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-800 mb-3">Gestionar Disponibilidad</h2>
          <p className="text-gray-700 mb-4">
            Define y actualiza tus horarios disponibles para citas.
          </p>
          <Link
            to="/manage-availability"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300"
          >
            Administrar Horarios
          </Link>
        </div>

            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
              <h2 className="text-3xl font-bold mb-4">Bienvenido Dr. {user?.nombre}</h2>
              <p className="text-gray-700 text-lg mb-4">Correo: {user?.correo}</p>

              {user?.especialidades && user.especialidades.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">Especialidades:</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {user.especialidades.map((esp) => (
                      <li key={esp.id}>{esp.nombre}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

        <div className="bg-orange-50 p-6 rounded-lg shadow-md border border-orange-200">
          <h2 className="text-2xl font-bold text-orange-800 mb-3">Ver Mis Citas</h2>
          <p className="text-gray-700 mb-4">
            Revisa tus próximas citas y el historial de pacientes.
          </p>
            <Link
            to="/doctor-appointments"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300"
            >
            Ver Agenda
            </Link>

        </div>
      </div>

    </div>

    

  );
};

export default DoctorDashboard;