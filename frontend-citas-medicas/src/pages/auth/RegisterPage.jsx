// src/pages/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Importa el hook de autenticación
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('paciente'); // 'paciente' o 'doctor'
  const [error, setError] = useState('');
  const { register } = useAuth(); // Obtiene la función de registro del contexto
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Aquí se llamaría a la API de backend para registrar al usuario
      // Por ahora, simulamos una respuesta exitosa
      const success = await register(name, email, password, role); // Llama a la función de registro del contexto
      if (success) {
        navigate('/login'); // Redirige al login después de un registro exitoso
      } else {
        setError('Error al registrar. Por favor, inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Error al registrar. Por favor, inténtalo más tarde.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Registrarse
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <InputField
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Nombre Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Registrarse como:
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
            >
              <option value="paciente">Paciente</option>
              <option value="medico">Médico</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full">
            Registrarse
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;