import { api } from './api';

export const doctorService = {
  getMedicos: async (token) => {
    return api.get('/medicos', token);
  },

  getDisponibilidades: async (medicoId, token) => {
    return api.get(`/medicos/${medicoId}/disponibilidades`, token);
  },

  createDisponibilidad: async (medicoId, data, token) => {
    return api.post(`/medicos/${medicoId}/disponibilidades`, data, token);
  }
};
