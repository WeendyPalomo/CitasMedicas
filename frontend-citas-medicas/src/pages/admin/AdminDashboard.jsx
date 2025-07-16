import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-red-600">Acceso Denegado</h2>
        <p className="mt-4 text-gray-600">Inicia sesión como administrador para acceder a este panel.</p>
        <Link to="/login" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full">
          Ir a Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-800 text-center">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Médicos */}
        <Link to="/admin/medicos" className="p-6 bg-purple-50 rounded-lg shadow hover:bg-purple-100 transition">
          <h2 className="text-xl font-bold mb-2 text-purple-800">Gestión de Médicos</h2>
          <p className="text-gray-700">Asignar especialidades a médicos.</p>
        </Link>

        {/* Especialidades */}
        <Link to="/admin/especialidades" className="p-6 bg-yellow-50 rounded-lg shadow hover:bg-yellow-100 transition">
          <h2 className="text-xl font-bold mb-2 text-yellow-800">Gestionar Especialidades</h2>
          <p className="text-gray-700">Agregar, ver y eliminar especialidades.</p>
        </Link>

        {/* Reporte */}
        <Link to="/admin/reportes" className="p-6 bg-green-50 rounded-lg shadow hover:bg-green-100 transition">
          <h2 className="text-xl font-bold mb-2 text-green-800">Reporteria</h2>
          <p className="text-gray-700">Ver reportes de las citas y los usuarios (en desarrollo).</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
