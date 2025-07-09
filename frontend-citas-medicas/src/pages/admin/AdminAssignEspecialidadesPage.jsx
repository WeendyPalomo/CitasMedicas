// file: src/pages/admin/AdminAssignEspecialidadesPage.jsx
import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { useAuth } from '../../context/AuthContext';

const AdminAssignEspecialidadesPage = () => {
  const { user } = useAuth();
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [medicoRes, espRes] = await Promise.all([
      doctorService.getMedicos(user.token),
      doctorService.getEspecialidades(user.token)
    ]);
    setMedicos(medicoRes);
    setEspecialidades(espRes);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleEspecialidad = async (medicoId, espId, hasEspecialidad) => {
    if (hasEspecialidad) {
       // Si ya la tiene, hacemos unremove
       await doctorService.removeEspecialidadFromMedico(medicoId, espId, user.token);
     } else {
      // VALIDACIÓN: si no la tiene, ok, si la tiene (duplicado), avisar y salir
      const medico = medicos.find(m => m.id === medicoId);
      if (medico.especialidades.some(e => e.id === espId)) {
        alert('Esta especialidad ya está asignada a este médico.');
        return;
      }
       await doctorService.assignEspecialidadToMedico(medicoId, espId, user.token);
     }
     fetchData(); // refrescar
  };


  return (
    <div className="max-w-5xl mx-auto p-6 mt-8 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Asignar Especialidades a Médicos</h2>

      {loading ? <p>Cargando...</p> : (
        medicos.map((medico) => (
          <div key={medico.id} className="mb-6 border-b pb-4">
            <h3 className="text-xl font-semibold">{medico.nombre}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {especialidades.map((esp) => {
                const hasEspecialidad = medico.especialidades?.some(e => e.id === esp.id);
                return (
                  <button
                    key={esp.id}
                    onClick={() => toggleEspecialidad(medico.id, esp.id, hasEspecialidad)}
                    className={`px-3 py-1 rounded ${hasEspecialidad ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  >
                    {esp.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminAssignEspecialidadesPage;
