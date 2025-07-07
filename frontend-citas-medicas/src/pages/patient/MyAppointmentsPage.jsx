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
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Fecha</th>
              <th className="border border-gray-300 p-2">Hora</th>
              <th className="border border-gray-300 p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id} className="text-center">
                <td className="border border-gray-300 p-2">{new Date(cita.fecha).toLocaleDateString()}</td>
                <td className="border border-gray-300 p-2">{new Date(cita.hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                <td className="border border-gray-300 p-2 capitalize">{cita.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
