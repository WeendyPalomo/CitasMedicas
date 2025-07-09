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
    return api.post(`/medicos/${medicoId}/especialidades`, { especialidad_id: especialidadId }, token);
  },

  getMedicosPorEspecialidad: async (especialidadId) => {
  const response = await api.get(`/especialidades/${especialidadId}/medicos`);
  return response.data;
},

deleteEspecialidad: async (id, token) => {
  await api.delete(`/especialidades/${id}`, token);
  return true; // Ya no espera respuesta JSON
},

getMedicosConEspecialidades: (token) =>
  api.get('/medicos-con-especialidades', token),

// doctorService.js
removeEspecialidadFromMedico: async (medicoId, especialidadId, token) => {
  // api.delete(path, token) añadirá el Bearer automáticamente
  await api.delete(`/medicos/${medicoId}/especialidades/${especialidadId}`, token);
  return true;
},


getAsignaciones: async (token) => {
  const response = await api.get('/medicos-con-especialidades', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}


};
