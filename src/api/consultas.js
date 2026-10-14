import { request } from './client.js'

// POST /consultas exige el header x-api-key (ver .env.example).
// Ojo: todo lo que va en el bundle es visible en el navegador.
const API_KEY = import.meta.env.VITE_API_KEY

if (!API_KEY && import.meta.env.DEV) {
  console.warn('Falta VITE_API_KEY en el .env: el formulario de consulta no va a poder enviarse.')
}

export function crearConsulta({ nombre, email, mensaje, propiedadId }) {
  return request('/consultas', {
    method: 'POST',
    headers: API_KEY ? { 'x-api-key': API_KEY } : {},
    // el backend valida propiedadId con z.number(): tiene que ir como número
    body: { nombre, email, mensaje, propiedadId: Number(propiedadId) }
  })
}
