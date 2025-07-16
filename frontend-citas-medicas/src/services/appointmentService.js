// file: src/services/appointmentService.js
import { api } from './api';

export const appointmentService = {
  bookAppointment: async (data, token) => {
    return api.post('/citas', data, token);
  },

  getAppointmentsByPaciente: async (pacienteId, token) => {
    return api.get(`/citas/paciente/${pacienteId}`, token);
  },

  getAppointmentsByMedico: async (medicoId, token) => {
    return api.get(`/medicos/${medicoId}/citas`, token);
  },

  getCitasPorMedicoYFecha: async (medicoId, fecha, token) => {
    const res = await api.get(`/citas/medico/${medicoId}/fecha/${fecha}`, token);
    return res;
  },

  getHorasOcupadas: async (medicoId, fecha, token) => {
    const res = await api.get(`/medicos/${medicoId}/citas/${fecha}`, token);
    return res; // array de horas ocupadas - disponibilidad medicos
  },

  deleteAppointment: async (id, token) => {
    const res = await api.delete(`/citas/${id}`, token);
    return res;
  },

  cancelAppointment: async (id, token) => {
    return api.put(`/citas/${id}/cancelar`, {}, token);
  },



};
