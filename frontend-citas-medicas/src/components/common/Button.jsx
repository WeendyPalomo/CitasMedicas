// src/components/common/Button.jsx
import React from 'react';

const Button = ({ children, type = 'button', onClick, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-md ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
