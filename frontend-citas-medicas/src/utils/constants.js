export const ROLES = {
  DOCTOR: 'medico',
  PATIENT: 'paciente',
  ADMIN: 'admin',
};

export const API_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/registro',
  CITA: '/citas',
  DISPONIBILIDAD: (id) => `/medicos/${id}/disponibilidades`,
  ESPECIALIDADES: '/especialidades',
};
