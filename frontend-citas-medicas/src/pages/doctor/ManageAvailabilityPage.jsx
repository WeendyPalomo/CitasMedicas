// file: src/pages/doctor/ManageAvailabilityPage.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const ManageAvailabilityPage = () => {
  const { user, token } = useAuth();
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [dia, setDia] = useState('');
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [mensaje, setMensaje] = useState(''); // Nuevo estado para mensajes

  const fetchDisponibilidades = async () => {
    try {
      const data = await api.get(`/medicos/${user.id}/disponibilidades`, token);
      setDisponibilidades(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchDisponibilidades();
  }, [token, user.id]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Validar que hora_fin sea mayor que hora_inicio
  const [inicioHora, inicioMinuto] = inicio.split(':').map(Number);
  const [finHora, finMinuto] = fin.split(':').map(Number);

  const inicioTotal = inicioHora * 60 + inicioMinuto;
  const finTotal = finHora * 60 + finMinuto;

  if (finTotal <= inicioTotal) {
    setMensaje("La hora de fin debe ser mayor que la hora de inicio.");
    setTimeout(() => setMensaje(''), 4000);
    return;
  }

  try {
    const availabilityData = {
      dia_semana: dia.toLowerCase(),
      hora_inicio: inicio,
      hora_fin: fin,
    };

    await api.post(`/medicos/${user.id}/disponibilidades`, availabilityData, user.token);

    setMensaje("Disponibilidad guardada con éxito.");
    setTimeout(() => setMensaje(''), 4000);

    setDia('');
    setInicio('');
    setFin('');
    fetchDisponibilidades();
  } catch (error) {
    const msg =
      error?.response?.data?.error ||
      "Error al guardar disponibilidad: " + error.message;
    setMensaje(msg);
    setTimeout(() => setMensaje(''), 4000);
    console.error("Error al guardar:", error);
  }
};

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gestionar Disponibilidad</h1>

      {mensaje && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={dia} onChange={(e) => setDia(e.target.value)} className="border p-2">
          <option value="">Día de la semana</option>
          {['lunes','martes','miércoles','jueves','viernes','sábado','domingo'].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <input type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} className="border p-2" required />
        <input type="time" value={fin} onChange={(e) => setFin(e.target.value)} className="border p-2" required />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
      </form>

      <h2 className="text-lg font-semibold mt-6">Disponibilidades existentes:</h2>
      <ul className="mt-2">
        {disponibilidades.map((disp) => (
          <li key={disp.id}>
            {disp.dia_semana}: {disp.hora_inicio} - {disp.hora_fin}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageAvailabilityPage;
