// src/components/layout/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Importa el hook de autenticación

const Navbar = () => {
  const { user, logout } = useAuth(); // Obtiene el usuario y la función de logout del contexto

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold tracking-wide">
          Citas Médicas
        </Link>
        <div className="space-x-6">
          <Link to="/" className="text-white hover:text-blue-200 transition duration-300">Inicio</Link>
          {user ? (
            <>
              {user.role === 'paciente' && (
                <Link to="/patient-dashboard" className="text-white hover:text-blue-200 transition duration-300">Mi Panel</Link>
              )}
              {user.role === 'medico' && (
                <Link to="/doctor-dashboard" className="text-white hover:text-blue-200 transition duration-300">Mi Panel</Link>
              )}
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-blue-200 transition duration-300">Iniciar Sesión</Link>
              <Link to="/register" className="bg-white text-blue-700 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-blue-100 transition duration-300">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;