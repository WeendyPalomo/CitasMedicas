//file: src/services/doctorService.js
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
  },
    // Nuevas funciones para especialidades
  getEspecialidades: async (token) => {
    return api.get('/especialidades', token);
  },

  createEspecialidad: async (data, token) => {
    return api.post('/especialidades', data, token);
  },

  assignEspecialidadToMedico: async (medicoId, especialidadId, token) => {
    // Asumimos que el backend tiene un endpoint para asignar la relación
    return api.post(`/medicos/${medicoId}/especialidades`, { especialidad_id: especialidadId }, token);
  },

  removeEspecialidadFromMedico: async (medicoId, especialidadId, token) => {
    // Para eliminar la relación, asumimos método DELETE con query params o similar
    return api.delete(`/medicos/${medicoId}/especialidades/${especialidadId}`, token);
  },
};
