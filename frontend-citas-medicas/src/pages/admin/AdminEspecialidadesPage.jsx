import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { useAuth } from '../../context/AuthContext';

const AdminEspecialidadesPage = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [newNombre, setNewNombre] = useState('');
  const { user } = useAuth();

  const fetchEspecialidades = async () => {
    const data = await doctorService.getEspecialidades(user.token);
    setEspecialidades(data);
  };

  const handleAdd = async () => {
    if (newNombre.trim()) {
      await doctorService.createEspecialidad({ nombre: newNombre }, user.token);
      setNewNombre('');
      fetchEspecialidades();
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">Gestión de Especialidades</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newNombre}
          onChange={(e) => setNewNombre(e.target.value)}
          placeholder="Nombre de la especialidad"
          className="border px-3 py-2 rounded w-full"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
          Agregar
        </button>
      </div>

      <ul className="list-disc list-inside text-gray-700">
        {especialidades.map((esp) => (
          <li key={esp.id}>{esp.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminEspecialidadesPage;
