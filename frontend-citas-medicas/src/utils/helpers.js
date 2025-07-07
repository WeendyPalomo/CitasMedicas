// Convierte fecha ISO a formato legible
export function formatearFecha(fechaISO) {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fechaISO).toLocaleDateString('es-EC', opciones);
}

// Capitaliza la primera letra
export function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// Valida si es email válido
export function esCorreoValido(correo) {
  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return regex.test(correo);
}
