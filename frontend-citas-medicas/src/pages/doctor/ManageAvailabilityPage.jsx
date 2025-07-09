// file: src/pages/doctor/ManageAvailabilityPage.jsx
import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { useAuth } from '../../hooks/useAuth';

const ManageAvailabilityPage = () => {
  const { user } = useAuth();
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [dia, setDia] = useState('lunes');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const token = user.token;

  const cargarDisponibilidades = async () => {
    try {
      const data = await doctorService.getDisponibilidadPorMedico(user.id, token);
      setDisponibilidades(data || []);
    } catch (error) {
      console.error('Error al obtener disponibilidades:', error);
    }
  };

  useEffect(() => {
    if (token && user.id) cargarDisponibilidades();
  }, [token, user.id]);

  const agregarDisponibilidad = async (e) => {
  e.preventDefault();

    // Validar que horaFin sea mayor que horaInicio
    const [hInicio, mInicio] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);
    const minutosInicio = hInicio * 60 + mInicio;
    const minutosFin = hFin * 60 + mFin;

    if (minutosFin <= minutosInicio) {
      setError('Por favor verificar las horas, no se puede agregar la disponibilidad.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      await doctorService.createDisponibilidad(user.id, {
        dia_semana: dia,
        hora_inicio: horaInicio,
        hora_fin: horaFin
      }, token);

      setMensaje('Disponibilidad agregada');
      setDia('lunes');
      setHoraInicio('');
      setHoraFin('');
      cargarDisponibilidades();
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error al agregar disponibilidad:', error);
      setMensaje('Error al agregar disponibilidad. Intente de nuevo.');
      setTimeout(() => setMensaje(''), 3000);
    }
  };



  const eliminarDisponibilidad = async (id) => {
    try {
      await doctorService.deleteDisponibilidad(id, token);
      setMensaje('Disponibilidad eliminada');
      cargarDisponibilidades();
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error('Error al eliminar disponibilidad:', error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestionar Disponibilidad</h1>

      {mensaje && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {mensaje}
        </div>
      )}

      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>}

      <form onSubmit={agregarDisponibilidad} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block font-medium mb-1">Día</label>
          <select
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            className="border p-2 w-full rounded"
          >
            {['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Hora inicio</label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Hora fin</label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Agregar
          </button>
        </div>
      </form>

      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Día</th>
            <th className="text-left p-3">Hora Inicio</th>
            <th className="text-left p-3">Hora Fin</th>
            <th className="text-left p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {disponibilidades.map(d => (
            <tr key={d.id} className="border-t hover:bg-gray-50">
              <td className="p-3 capitalize">{d.dia_semana}</td>
              <td className="p-3">{d.hora_inicio}</td>
              <td className="p-3">{d.hora_fin}</td>
              <td className="p-3">
                <button
                  onClick={() => eliminarDisponibilidad(d.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAvailabilityPage;
