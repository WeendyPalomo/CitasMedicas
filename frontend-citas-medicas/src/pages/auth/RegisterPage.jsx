// src/pages/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('paciente');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const success = await register(name, email, password, role);
      if (success) {
        navigate('/login');
      } else {
        setError('Error al registrar. Inténtalo nuevamente.');
      }
    } catch (err) {
      setError('Error al registrar.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl space-y-8">
        <h2 className="text-center text-4xl font-extrabold">Registrarse</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField id="name" name="name" required placeholder="Nombre Completo" value={name} onChange={(e) => setName(e.target.value)} />
          <InputField id="email" name="email" type="email" required placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField id="password" name="password" type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">Registrarse como:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border rounded p-2">
              <option value="paciente">Paciente</option>
              <option value="medico">Médico</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">Registrarse</Button>
        </form>
        <p className="text-center text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
