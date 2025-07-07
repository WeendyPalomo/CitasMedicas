// File: src/pages/auth/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de importar el contexto correctamente
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // useEffect para redirigir después del login
  useEffect(() => {
    if (user) {
      if (user.rol === 'medico') {
        navigate('/doctor-dashboard');
      } else if (user.rol === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Credenciales inválidas. Inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, inténtalo más tarde.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿O no tienes una cuenta?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Regístrate aquí
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            required
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full">Iniciar Sesión</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
