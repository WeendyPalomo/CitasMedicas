// file: src/pages/doctor/DoctorAppointmentsPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const DoctorAppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedCita, setSelectedCita] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    diagnostico: '',
    tratamiento: '',
    notas: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchAppointments = async () => {
    try {
      const data = await api.get(`/medicos/${user.id}/citas`, user.token);
      setAppointments(data.filter(cita => cita.estado !== 'finalizado'));
    } catch (err) {
      console.error('Error al cargar las citas del médico:', err);
    }
  };

  useEffect(() => {
    if (user?.id && user?.token) {
      fetchAppointments();
    }
  }, [user]);

  const handleOpenModal = (cita) => {
    setSelectedCita(cita);
    setModalOpen(true);
    setForm({ diagnostico: '', tratamiento: '', notas: '' });
    setError('');
    setMessage('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCita(null);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAtenderCita = async (e) => {
    e.preventDefault();
    if (!form.diagnostico || !form.tratamiento) {
      setError('Diagnóstico y tratamiento son requeridos.');
      return;
    }
    
      console.log({
        cita_id: selectedCita.id,
        diagnostico: form.diagnostico,
        tratamiento: form.tratamiento,
        notas: form.notas
      });

    try {
      await api.post('/historial', {
        cita_id: selectedCita.id,
        diagnostico: form.diagnostico,
        tratamiento: form.tratamiento,
        notas: form.notas,
       // fecha_creacion: new Date().toISOString().split('T')[0],
      }, user.token);

      await api.put(`/citas/${selectedCita.id}/estado`, {
        estado: 'finalizado',
      }, user.token);

      setMessage('Cita atendida con éxito');
      setTimeout(() => {
        handleCloseModal();
        fetchAppointments();
      }, 1500);
    } catch (err) {
      console.error('Error al registrar atención:', err);
      setError('Error al registrar la atención médica.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">Mis Citas</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center">No tienes citas agendadas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="px-4 py-2">Paciente</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Hora</th>
                <th className="px-4 py-2">Especialidad</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
            {appointments.map((cita) => (
              <tr key={cita.id} className="border-t">
                <td className="px-4 py-2">{cita.paciente?.nombre}</td>
                <td className="px-4 py-2">{cita.fecha}</td>
                <td className="px-4 py-2">{cita.hora}</td>
                <td className="px-4 py-2">{cita.especialidad?.nombre}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleOpenModal(cita)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Atender Cita
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Atender Cita</h3>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            {message && <p className="text-green-600 mb-2">{message}</p>}
            <form onSubmit={handleAtenderCita} className="space-y-4">
              <div>
                <label className="block font-medium">Diagnóstico</label>
                <textarea
                  name="diagnostico"
                  value={form.diagnostico}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Tratamiento</label>
                <textarea
                  name="tratamiento"
                  value={form.tratamiento}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Notas adicionales</label>
                <textarea
                  name="notas"
                  value={form.notas}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Registrar Atención
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;
