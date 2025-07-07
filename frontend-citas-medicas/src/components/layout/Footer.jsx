// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-8 rounded-t-lg">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Sistema de Gestión de Citas Médicas. Todos los derechos reservados.</p>
        <p className="mt-2">Desarrollado con ❤️ y React.js</p>
      </div>
    </footer>
  );
};

export default Footer;
