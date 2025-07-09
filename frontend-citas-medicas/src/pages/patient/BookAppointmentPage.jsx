// file: src/pages/patient/BookAppointmentPage.jsx
import React, { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { useAuth } from '../../hooks/useAuth';

const BookAppointmentPage = () => {
  const { user } = useAuth();
  const token = user?.token;

  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [especialidadId, setEspecialidadId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);

  useEffect(() => {
    doctorService.getEspecialidades(token)
      .then(setEspecialidades)
      .catch(err => console.error('Error al cargar especialidades', err));
  }, [token]);

  useEffect(() => {
  if (especialidadId && token) {
    console.log('🎯 Especialidad seleccionada:', especialidadId);
    doctorService.getMedicosPorEspecialidad(especialidadId, token)
    .then((data) => {
   //   console.log('📦 Médicos recibidos:', data);
      setMedicos(data);
    })
    .catch(err => {
      console.error('❌ Error al cargar médicos', err);
      setMedicos([]);
    });
  } else {
    console.log('⚠️ No se ha seleccionado especialidad o no hay token');
    setMedicos([]);
  }
}, [especialidadId, token]);

useEffect(() => {
  const generarHorasDisponibles = async () => {
    if (!medicoId || !fecha) return;

    const obtenerDiaSemana = (fechaStr) => {
    const [año, mes, dia] = fechaStr.split('-').map(Number);
    const date = new Date(año, mes - 1, dia); // evita error de zona horaria
    return date.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
  };

const diaSemana = obtenerDiaSemana(fecha);


    const disponibilidadDia = disponibilidad.filter(d => d.dia_semana.toLowerCase() === diaSemana);

    console.log('diaSemana-desponibilidadDia: ', diaSemana, disponibilidadDia);

    if (!disponibilidadDia.length) {
      setHorasDisponibles([]);
      return;
    }

    const citasOcupadas = await appointmentService.getHorasOcupadas(medicoId, fecha, token);
    let horasFinales = [];

    disponibilidadDia.forEach(rango => {
      let [hInicio, hFin] = [rango.hora_inicio, rango.hora_fin];
      let horaActual = hInicio;

      while (horaActual < hFin) {
        if (!citasOcupadas.includes(horaActual)) {
          horasFinales.push(horaActual);
        }

        // Avanza en bloques de 1 hora
        const [h, m] = horaActual.split(':').map(Number);
        const siguiente = new Date();
        siguiente.setHours(h);
        siguiente.setMinutes(m + 60); // o +30 si quieres bloques de media hora

        horaActual = siguiente.toTimeString().slice(0, 5); // 'HH:MM'
      }
    });

    setHorasDisponibles(horasFinales);
  };

  generarHorasDisponibles();
}, [medicoId, fecha, disponibilidad]);

useEffect(() => {
if (medicoId && token) {
  doctorService.getDisponibilidadPorMedico(medicoId, token)
  .then(data => {
  console.log('✅ Disponibilidad recibida:', data);
  setDisponibilidad(data);
   if (data.length === 0) {
          setError('Este médico no tiene disponibilidad en este momento. Inténtalo más tarde.');
        }
  })
  .catch(err => {
  console.error('❌ Error al cargar disponibilidad', err);
  setDisponibilidad([]);
  setError('No se pudo cargar la disponibilidad del médico.');
});
} else {
  setDisponibilidad([]);
}
}, [medicoId, token]);


  useEffect(() => {
  if (!fecha || disponibilidad.length === 0) {
    setHorasDisponibles([]);
    return;
  }

  const dayName = new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase();

  const disponibleHoy = disponibilidad.find(d => d.dia_semana === dayName);

  if (!disponibleHoy) {
    setHorasDisponibles([]);
    return;
  }

  // Simula intervalos de 30 minutos entre hora_inicio y hora_fin
  const start = parseInt(disponibleHoy.hora_inicio.split(':')[0]);
  const end = parseInt(disponibleHoy.hora_fin.split(':')[0]);

  let hours = [];
  for (let h = start; h < end; h++) {
    hours.push(`${h.toString().padStart(2, '0')}:00`);
    hours.push(`${h.toString().padStart(2, '0')}:30`);
  }

  // 🧠 Llamar backend para obtener citas agendadas en esa fecha para ese médico
  appointmentService.getCitasPorMedicoYFecha(medicoId, fecha, token)
    .then(citas => {
      const ocupadas = citas.map(c => c.hora);
      const libres = hours.filter(h => !ocupadas.includes(h));
      setHorasDisponibles(libres);
    })
    .catch(err => {
      console.error('Error al cargar citas del día:', err);
      setHorasDisponibles(hours); // Muestra todo si hay error
    });
}, [fecha, disponibilidad, medicoId, token]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!medicoId || !fecha || !hora) {
      setError('Completa todos los campos antes de agendar.');
      setTimeout(() => setError(''), 4000);
      return;
    }

    try {
      await appointmentService.bookAppointment(
        {
          paciente_id: user.id,
          medico_id: parseInt(medicoId),
          fecha,
          hora,
        },
        token
      );
      setMensaje('Cita agendada correctamente');
      setMedicoId('');
      setEspecialidadId('');
      setFecha('');
      setHora('');
      setDisponibilidad([]);
      setHorasDisponibles([]);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError(msg);
    }
  };

  const isDiaHabil = (dateStr) => {
    const day = new Date(dateStr).toLocaleDateString('es-EC', { weekday: 'long' }).toUpperCase();
    return disponibilidad.some(d => d.dia_semana === day);
  };

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Agendar Cita Médica</h1>
      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>}
      {mensaje && <p className="bg-green-100 text-green-700 p-2 rounded mb-4">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={especialidadId}
          onChange={(e) => setEspecialidadId(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Seleccione una especialidad</option>
          {especialidades.map((e) => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>

        <select
          value={medicoId}
          onChange={(e) => setMedicoId(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Seleccione un médico</option>
          {Array.isArray(medicos) && medicos.length > 0 ? (
            medicos.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))
          ) : (
            <option disabled>No hay médicos disponibles</option>
          )}
        </select>

        <input
          type="date"
          min={hoy}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border p-2 w-full"
          required
        />

      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="font-bold text-lg mb-4">Aviso</h3>
            <p className="mb-4">{error}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setError('')}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}


        <select
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Seleccione una hora</option>
          {horasDisponibles.length > 0 ? (
            horasDisponibles.map((h, idx) => (
              <option key={idx} value={h}>{h}</option>
            ))
          ) : (
            <option disabled>No hay horas disponibles</option>
          )}
        </select>


        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Agendar
        </button>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
