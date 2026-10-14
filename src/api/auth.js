import { request } from './client.js'

// Responde { token, usuario: { id, nombre, email, rol } } o 401 "Email o contraseña incorrectos".
export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: { email, password } })
}
