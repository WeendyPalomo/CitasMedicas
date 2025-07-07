// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center px-4">
      <h1 className="text-9xl font-extrabold text-blue-600 mb-4 animate-bounce">404</h1>
      <h2 className="text-4xl font-bold text-gray-800 mb-4">¡Página No Encontrada!</h2>
      <p className="text-lg text-gray-600 mb-8">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
      >
        Volver a Inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;
