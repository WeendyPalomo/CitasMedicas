import React, { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';

const MyAppointmentsPage = () => {
const { user } = useAuth();
const token = user.token;

const [citas, setCitas] = useState([]);
const [error, setError] = useState('');
const [mensaje, setMensaje] = useState('');

const [citaSeleccionada, setCitaSeleccionada] = useState(null);
const [showModal, setShowModal] = useState(false);

useEffect(() => {
const fetchCitas = async () => {
try {
const data = await appointmentService.getAppointmentsByPaciente(user.id, token);
setCitas(data || []);
} catch (err) {
setError('Error al cargar tus citas');
console.error(err);
}
};
if (token) fetchCitas();
}, [token, user.id]);

const confirmarCancelacion = (cita) => {
setCitaSeleccionada(cita);
setShowModal(true);
};

const cancelarCita = async () => {
if (!citaSeleccionada) return;
try {
  await appointmentService.deleteAppointment(citaSeleccionada.id, token);
  setCitas(prev => prev.filter(c => c.id !== citaSeleccionada.id));
  setMensaje('Cita cancelada correctamente.');
  setTimeout(() => setMensaje(''), 4000);
} catch (err) {
  console.error('❌ Error al cancelar cita:', err);
  setError('No se pudo cancelar la cita.');
} finally {
  setShowModal(false);
  setCitaSeleccionada(null);
}
};

return (
<div className="p-6 max-w-3xl mx-auto">
<h1 className="text-2xl font-bold mb-4">Mis Citas</h1>
{error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>}
{mensaje && <p className="bg-green-100 text-green-700 p-2 rounded mb-4">{mensaje}</p>}
  {Array.isArray(citas) && citas.length === 0 ? (
    <p>No tienes citas agendadas.</p>
  ) : (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          {["Estado", "Fecha", "Hora", "Médico", "Especialidad", "Acciones"].map((h) => (
            <th key={h} className="text-left px-4 py-2 font-medium text-gray-700">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {citas.map((cita) => (
          <tr key={cita.id} className="border-b hover:bg-gray-50">
            <td className="px-4 py-2">{cita.estado}</td>
            <td className="px-4 py-2">{cita.fecha}</td>
            <td className="px-4 py-2">{cita.hora}</td>
            <td className="px-4 py-2">{cita.medico}</td>
            <td className="px-4 py-2">{cita.especialidad}</td>
            <td className="px-4 py-2">
              <button
                onClick={() => confirmarCancelacion(cita)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Cancelar Cita
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

  {/* Modal de confirmación */}
  {showModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Confirmar cancelación</h2>
        <p className="mb-4">¿Estás seguro de que deseas cancelar esta cita?</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            onClick={() => setShowModal(false)}
          >
            No, volver
          </button>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={cancelarCita}
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  )}
</div>
);
};

export default MyAppointmentsPage;