import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { useAuth } from '../../hooks/useAuth';

const AdminEspecialidadesPage = () => {
  const { user } = useAuth();
  const [especialidades, setEspecialidades] = useState([]);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [message, setMessage] = useState('');

  const cargarEspecialidades = async () => {
    try {
      const data = await doctorService.getEspecialidades(user.token);
      setEspecialidades(data);
    } catch (err) {
      console.error('Error al cargar especialidades:', err.message);
    }
  };

  const confirmarEliminar = (id) => {
    setIdAEliminar(id);
    setShowModal(true);
  };

  const eliminar = async () => {
    try {
      await doctorService.deleteEspecialidad(idAEliminar, user.token);
      setIdAEliminar(null);
      setShowModal(false);
      setMessage('Especialidad eliminada correctamente');
      cargarEspecialidades();

      setTimeout(() => setMessage(''), 4000);
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

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}

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
              onClick={() => confirmarEliminar(esp.id)}
              className="text-red-600 hover:text-red-800"
              title="Eliminar"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {/* Modal de Confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
            <p className="mb-6">¿Estás seguro de que deseas eliminar esta especialidad?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setIdAEliminar(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={eliminar}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEspecialidadesPage;
