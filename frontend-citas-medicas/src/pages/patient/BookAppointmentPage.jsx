import React, { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { useAuth } from '../../hooks/useAuth';

const BookAppointmentPage = () => {
  const { user } = useAuth();
  const token = user?.token;

  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [especialidadId, setEspecialidadId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    doctorService.getEspecialidades()
      .then(setEspecialidades)
      .catch(err => console.error('Error al cargar especialidades', err));
  }, []);

  useEffect(() => {
    if (especialidadId) {
      doctorService.getMedicosPorEspecialidad(especialidadId)
        .then(setMedicos)
        .catch(err => {
          console.error('Error al cargar médicos', err);
          setMedicos([]);
        });
    } else {
      setMedicos([]);
    }
  }, [especialidadId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!medicoId || !fecha || !hora) {
      setError('Completa todos los campos antes de agendar.');
      setTimeout(() => setError(''), 4000);
      return;
    }

    try {
      await appointmentService.bookAppointment(
        {
          paciente_id: user.id,
          medico_id: parseInt(medicoId),
          fecha,
          hora,
        },
        token
      );
      setMensaje('Cita agendada correctamente');
      setMedicoId('');
      setEspecialidadId('');
      setFecha('');
      setHora('');
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError(msg);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Agendar Cita Médica</h1>
      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>}
      {mensaje && <p className="bg-green-100 text-green-700 p-2 rounded mb-4">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={especialidadId}
          onChange={(e) => setEspecialidadId(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Seleccione una especialidad</option>
          {especialidades.map((e) => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>

        <select
          value={medicoId}
          onChange={(e) => setMedicoId(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Seleccione un médico</option>
          {medicos.map((m) => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>

        <input
          type="date"
          min={new Date().toISOString().split('T')[0]}
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
