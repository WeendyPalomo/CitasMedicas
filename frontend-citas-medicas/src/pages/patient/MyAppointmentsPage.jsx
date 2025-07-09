import React, { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';

const MyAppointmentsPage = () => {
  const { user } = useAuth();
  const token = user.token;

  const [citas, setCitas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const data = await appointmentService.getAppointmentsByPaciente(user.id, token);
        setCitas(data);
      } catch (err) {
        setError('Error al cargar tus citas');
        console.error(err);
      }
    };
    if (token) fetchCitas();
  }, [token, user.id]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mis Citas</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {citas.length === 0 ? (
        <p>No tienes citas agendadas.</p>
      ) : (
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {["Estado", "Fecha", "Hora", "Médico", "Especialidad"].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {citas.map(cita => (
            <tr key={cita.id}>
              <td>{cita.estado}</td>
              <td>{cita.fecha}</td>
              <td>{cita.hora}</td>
              <td>{cita.medico_nombre}</td>
              <td>{cita.especialidad_nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>

      )}
    </div>
  );
};

export default MyAppointmentsPage;
