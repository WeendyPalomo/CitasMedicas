// file: src/pages/admin/AdminMedicosPage.jsx
import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { useAuth } from '../../hooks/useAuth';

const AdminMedicosPage = () => {
  const { user } = useAuth();
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [asignarMedicoId, setAsignarMedicoId] = useState('');
  const [medicoEspSelec, setMedicoEspSelec] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [asignaciones, setAsignaciones] = useState([]);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    if (!user?.token) return;
    // médicos: eliminamos duplicados en cada lista de especialidades
   doctorService.getMedicos(user.token)
     .then(rawMedicos => {
       const deduped = rawMedicos.map(m => {
         const seen = new Set();
         const uniqueEsps = [];
         (m.especialidades || []).forEach(e => {
           if (!seen.has(e.id)) {
             seen.add(e.id);
             uniqueEsps.push(e);
           }
         });
         return { ...m, especialidades: uniqueEsps };
       });
       setMedicos(deduped);
     });

    doctorService.getEspecialidades(user.token).then(setEspecialidades);
    doctorService.getAsignaciones(user.token).then(setAsignaciones);
    
  }, [user]);

  const toggleEsp = (id) => {
    setMedicoEspSelec(prev =>
      // medicos: previene que el mismo id aparezca dos veces en el state
      prev.includes(id) ? prev.filter(x => x !== id) : Array.from(new Set([...prev, id]))
    );
  };

 const handleGuardar = async () => {
  if (!asignarMedicoId) {
    setModalError('Selecciona un médico.');
    setTimeout(() => setMessage(''), 3000);
    return;
  }

  const medico = medicos.find(m => m.id === parseInt(asignarMedicoId));
  const actuales = medico.especialidades.map(e => e.id);

  // 1. VALIDAR DUPLICADOS
  const duplicados = medicoEspSelec.filter(id => actuales.includes(id));
  if (duplicados.length > 0) {
    setModalError('Selecciona otra especialidad, esa ya se asignó.');
    setTimeout(() => setMessage(''), 3000);
    return;
  }

  for (let id of medicoEspSelec) {
    if (!actuales.includes(id)) {
      await doctorService.assignEspecialidadToMedico(medico.id, id, user.token);
    }
  }

  const nuevasEsps = especialidades.filter(e => [...actuales, ...medicoEspSelec].includes(e.id));
  setMedicos(prev =>
    prev.map(m =>
      m.id === medico.id
        ? { ...m, especialidades: nuevasEsps }
        : m
    )
  );

  setMessage('Especialidad(es) asignadas correctamente');
  setTimeout(() => setMessage(''), 4000);
  setShowModal(false);
  setAsignarMedicoId('');
  setMedicoEspSelec([]);
};

// AdminMédicosPage.jsx
const handleEliminarAsignacion = async (medicoId, especialidadId) => {
  await doctorService.removeEspecialidadFromMedico(medicoId, especialidadId, user.token);

  setMedicos(prev =>
    prev.map(m =>
      m.id === medicoId
        ? {
            ...m,
            especialidades: m.especialidades.filter(e => e.id !== especialidadId),
          }
        : m
    )
  );

  setMessage('Asignación eliminada correctamente');
  setTimeout(() => setMessage(''), 4000);
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Médicos</h1>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}

      <div className="mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Asignar Especialidades
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Matriz de Médicos</h2>

      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4">Médico</th>
            <th className="py-2 px-4">Especialidad</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medicos.flatMap(medico =>
            (medico.especialidades || []).map(especialidad => (
              <tr key={`${medico.id}-${especialidad.id}`} className="border-t">
                <td className="py-2 px-4">{medico.nombre}</td>
                <td className="py-2 px-4">{especialidad.nombre}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEliminarAsignacion(medico.id, especialidad.id)}
                  >
                    Eliminar Asignación
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAL */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <h3 className="font-bold mb-4 text-lg">Asignar Especialidades</h3>

                <div className="mb-4">
                <label className="block mb-1 font-medium">Médico</label>
                <select
                    className="w-full border px-3 py-2 rounded"
                    value={asignarMedicoId}
                    onChange={(e) => {
                    const id = e.target.value;
                    setAsignarMedicoId(id);
                    const medico = medicos.find(m => m.id === parseInt(id));
                    setMedicoEspSelec(medico?.especialidades?.map(e => e.id) || []);
                    }}
                >
                    <option value="">Selecciona un médico</option>
                    {medicos.map((m) => (
                    <option key={m.id} value={m.id}>
                        {m.nombre}
                    </option>
                    ))}
                </select>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                {especialidades.map((esp) => (
                    <div key={esp.id}>
                    <label className="flex items-center gap-2">
                        <input
                        type="checkbox"
                        checked={medicoEspSelec.includes(esp.id)}
                        onChange={() => toggleEsp(esp.id)}
                        />
                        {esp.nombre}
                    </label>
                    </div>
                ))}
                </div>

 {modalError && (
      <p className="text-red-600 mb-2">{modalError}</p>
    )}

                <div className="flex justify-end gap-2">
                <button
                    onClick={() => {
                    // setShowModal(true);
                    setShowModal(false);
                    setAsignarMedicoId('');
                    setMedicoEspSelec([]);
                    setModalError('');
                    }}
                    className="px-4 py-2 border rounded"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleGuardar}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Guardar
                </button>
                </div>
            </div>
            </div>
        )}
    </div>
  );
};

export default AdminMedicosPage;
