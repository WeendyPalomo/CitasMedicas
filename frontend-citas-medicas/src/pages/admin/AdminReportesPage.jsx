import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F'];

const AdminReportesPage = () => {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    api.get('/admin/reportes')
      .then(setDatos)
      .catch(err => console.error('Error al cargar datos del reporte:', err));
  }, []);

  if (!datos) return <p className="text-center mt-10">Cargando reporte...</p>;

  const usuariosData = Object.entries(datos.usuarios_por_rol).map(([rol, valor]) => ({ name: rol, value: valor }));
  const citasData = Object.entries(datos.citas_por_estado).map(([estado, cantidad]) => ({ name: estado, value: cantidad }));
  const especialidadesData = datos.citas_por_especialidad;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Dashboard Administrativo</h2>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4 text-center">Distribución de Usuarios</h3>
          <PieChart width={300} height={250}>
            <Pie data={usuariosData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {usuariosData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4 text-center">Estado de las Citas</h3>
          <BarChart width={350} height={250} data={citasData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4 text-center">Especialidades más Solicitadas</h3>
        <table className="min-w-full text-left">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2">Especialidad</th>
              <th className="px-4 py-2">Total de Citas</th>
            </tr>
          </thead>
          <tbody>
            {especialidadesData.map((esp, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{esp.especialidad}</td>
                <td className="px-4 py-2">{esp.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReportesPage;
