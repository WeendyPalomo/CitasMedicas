import { api } from './api';

export const appointmentService = {
  bookAppointment: async (data, token) => {
    return api.post('/citas', data, token);
  },

  getAppointmentsByPaciente: async (pacienteId, token) => {
    return api.get(`/pacientes/${pacienteId}/citas`, token);
  },

  getAppointmentsByMedico: async (medicoId, token) => {
    return api.get(`/medicos/${medicoId}/citas`, token);
  }
};
