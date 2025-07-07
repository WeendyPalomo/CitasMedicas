// src/services/authService.js
import { api } from './api'; // Asegúrate de que `api` esté correctamente configurado

export const authService = {
  login: async (correo, contrasena) => {
    try {
      const response = await api.post('/login', { correo, contrasena }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Asegura que las credenciales (como las cookies de sesión o el token) se envíen correctamente
      });

      // Aquí ya obtienes la respuesta con token y usuario
      return response.data; // Debes retornar la data de la respuesta (que tiene el token y usuario)
    } catch (error) {
      console.error('Error en login:', error.message);
      throw error; // Lanza el error para que el componente lo maneje
    }
  },
};
