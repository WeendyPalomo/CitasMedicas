// file: src/services/appointmentService.js
import { api } from './api';

export const appointmentService = {
  bookAppointment: async (data, token) => {
    return api.post('/citas', data, token);
  },

  getAppointmentsByPaciente: async (pacienteId, token) => {
    // Aquí ajustamos la ruta para que coincida con la que tienes en backend:
    return api.get(`/citas/paciente/${pacienteId}`, token);
  },

  getAppointmentsByMedico: async (medicoId, token) => {
    return api.get(`/medicos/${medicoId}/citas`, token);
  },
};
