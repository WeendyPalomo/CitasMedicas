// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        Bienvenido al Sistema de Gestión de Citas Médicas
      </h1>
      <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
        Conecta con médicos y gestiona tus citas de forma sencilla y eficiente.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Link
          to="/register"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
        >
          Registrarse Ahora
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Para Pacientes</h2>
          <p className="text-gray-600 mb-6">
            Encuentra médicos, revisa sus especialidades y agenda citas a tu conveniencia.
          </p>
          <Link
            to="/patient-dashboard"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
          >
            Explorar como Paciente
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Para Médicos</h2>
          <p className="text-gray-600 mb-6">
            Gestiona tu disponibilidad, especialidades y el historial de tus citas.
          </p>
          <Link
            to="/doctor-dashboard"
            className="text-green-600 hover:text-green-800 font-medium flex items-center justify-center"
          >
            Explorar como Médico
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HomePage;