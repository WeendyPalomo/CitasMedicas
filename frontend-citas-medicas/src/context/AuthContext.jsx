// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (correo, contrasena) => {
    try {
      const response = await api.post('/login', { correo, contrasena });
      console.log('Login response:', response);

      const userData = {
        id:     response.user.id,
        nombre: response.user.nombre,
        correo: response.user.correo,
        role:   response.user.rol,
        token:  response.token,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error durante el login:', error.message);
      setUser(null);
      localStorage.removeItem('user');
      return false;
    }
  };

const register = async (nombre, correo, contrasena, rol, especialidades = []) => {
  try {
    await api.post('/registro', {
      nombre,
      correo,
      contrasena,
      rol,
      especialidades, // array de IDs
    });
    return true;
  } catch (error) {
    console.error('Error en registro:', error.message);
    return false;
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const authContextValue = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
