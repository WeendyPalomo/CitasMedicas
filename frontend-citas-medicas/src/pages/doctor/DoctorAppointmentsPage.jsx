import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const DoctorAppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await api.get(`/medicos/${user.id}/citas`, user.token);
        setAppointments(data);
      } catch (err) {
        console.error('Error al cargar las citas del médico:', err);
      }
    };
    if (user) fetchAppointments();
  }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">Mis Citas</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center">No tienes citas agendadas.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((cita) => (
            <li key={cita.id} className="p-4 bg-white shadow rounded">
              <p><strong>Paciente:</strong> {cita.nombre_paciente}</p>
              <p><strong>Fecha:</strong> {cita.fecha}</p>
              <p><strong>Hora:</strong> {cita.hora}</p>
              <p><strong>Especialidad(es):</strong> {cita.especialidades?.join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;
