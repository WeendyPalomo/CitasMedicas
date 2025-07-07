import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const BookAppointmentPage = () => {
  const { user, token } = useAuth();
  const [medicos, setMedicos] = useState([]);
  const [medicoId, setMedicoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const data = await api.get('/medicos', token);
        setMedicos(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchMedicos();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/citas', {
        paciente_id: user.id,
        medico_id: parseInt(medicoId),
        fecha,
        hora
      }, token);
      alert('Cita agendada correctamente');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Agendar Cita Médica</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={medicoId} onChange={(e) => setMedicoId(e.target.value)} className="border p-2">
          <option value="">Seleccione un médico</option>
          {medicos.map((medico) => (
            <option key={medico.id} value={medico.id}>
              {medico.nombre}
            </option>
          ))}
        </select>

        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="border p-2" required />
        <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className="border p-2" required />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Agendar</button>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
