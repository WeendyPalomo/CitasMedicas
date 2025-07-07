import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
      <p className="text-lg mb-2">Bienvenido, {user?.name || 'Administrador'}.</p>
      <ul className="list-disc list-inside">
        <li>Gestión de usuarios</li>
        <li>Visualización de estadísticas</li>
        <li>Control de citas y médicos</li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
