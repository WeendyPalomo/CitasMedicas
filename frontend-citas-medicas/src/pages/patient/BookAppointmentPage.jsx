import React, { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { useAuth } from '../../hooks/useAuth';

const BookAppointmentPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4 text-center">Acceso no autorizado</h1>
        <p className="text-center">Por favor, inicia sesión para agendar una cita.</p>
      </div>
    );
  }

  const token = user.token;

  const [medicos, setMedicos] = useState([]);
  const [medicoId, setMedicoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const data = await doctorService.getMedicos(token);
        setMedicos(data);
      } catch (err) {
        console.error('Error al listar médicos:', err.message);
        setError('Error al cargar la lista de médicos');
        setTimeout(() => setError(''), 4000);
      }
    };
    if (token) fetchMedicos();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!medicoId || !fecha || !hora) {
      setError('Selecciona médico, fecha y hora antes de agendar.');
      setTimeout(() => setError(''), 4000);
      return;
    }

    try {
      await appointmentService.bookAppointment(
        {
          paciente_id: user.id,
          medico_id: parseInt(medicoId, 10),
          fecha,
          hora,
        },
        token
      );

      setMensaje('Cita agendada correctamente');
      setTimeout(() => setMensaje(''), 4000);

      setMedicoId('');
      setFecha('');
      setHora('');
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || 'Error al agendar cita';
      setError(msg);
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Agendar Cita Médica</h1>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
      )}
      {mensaje && (
        <p className="bg-green-100 text-green-700 p-2 rounded mb-4">{mensaje}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={medicoId}
          onChange={(e) => setMedicoId(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Seleccione un médico</option>
          {medicos.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="border p-2 w-full"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Agendar
        </button>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
