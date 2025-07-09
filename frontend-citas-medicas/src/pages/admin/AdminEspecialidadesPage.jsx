import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { useAuth } from '../../hooks/useAuth';

const AdminEspecialidadesPage = () => {
  const { user } = useAuth();
  const [especialidades, setEspecialidades] = useState([]);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState('');

  const cargarEspecialidades = async () => {
    try {
      const data = await doctorService.getEspecialidades(user.token);
      setEspecialidades(data);
    } catch (err) {
      console.error('Error al cargar especialidades:', err.message);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Deseas eliminar esta especialidad?')) return;
    try {
      await doctorService.deleteEspecialidad(id, user.token); // ✅ aquí se pasa el token
      cargarEspecialidades();
    } catch (err) {
      console.error('Error al eliminar especialidad:', err.message);
    }
  };

  const agregar = async (e) => {
    e.preventDefault();
    if (!nuevaEspecialidad.trim()) return;
    try {
      await doctorService.createEspecialidad({ nombre: nuevaEspecialidad }, user.token);
      setNuevaEspecialidad('');
      cargarEspecialidades();
    } catch (err) {
      console.error('Error al agregar especialidad:', err.message);
    }
  };

  useEffect(() => {
    if (user?.token) {
      cargarEspecialidades();
    }
  }, [user]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestionar Especialidades</h1>

      <form onSubmit={agregar} className="mb-4 flex gap-2">
        <input
          type="text"
          className="border p-2 flex-1"
          value={nuevaEspecialidad}
          onChange={(e) => setNuevaEspecialidad(e.target.value)}
          placeholder="Nueva especialidad"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Agregar
        </button>
      </form>

      <ul className="divide-y divide-gray-200 bg-white rounded shadow">
        {especialidades.map((esp) => (
          <li key={esp.id} className="flex items-center justify-between px-4 py-2">
            <span>{esp.nombre}</span>
            <button
              onClick={() => eliminar(esp.id)}
              className="text-red-600 hover:text-red-800"
              title="Eliminar"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminEspecialidadesPage;
