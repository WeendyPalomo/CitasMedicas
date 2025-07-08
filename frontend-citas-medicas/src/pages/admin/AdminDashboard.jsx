import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
      <p className="text-lg mb-2">Bienvenido, {user?.name || 'Administrador'}.</p>
      <ul className="list-disc list-inside mb-6">
        <li>Gestión de usuarios</li>
        <li>Visualización de estadísticas</li>
        <li>Control de citas y médicos</li>
      </ul>
      <button
        onClick={() => navigate('/admin/especialidades')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Gestionar Especialidades
      </button>
    </div>
  );
};

export default AdminDashboard;