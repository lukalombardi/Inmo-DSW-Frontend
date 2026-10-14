const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const esEmailValido = (email) => EMAIL.test(email.trim())

// Reglas del diseño + límites del backend (nombre 2–100, mensaje hasta 500).
export const LIMITES_CONSULTA = { nombreMax: 100, mensajeMin: 10, mensajeMax: 500 }

export function validarConsulta({ nombre, email, mensaje }) {
  const errores = {}
  const n = nombre.trim()
  const m = mensaje.trim()

  if (!n) errores.nombre = 'Ingresá tu nombre'
  else if (n.length < 2) errores.nombre = 'Tu nombre tiene que tener al menos 2 letras'
  else if (n.length > LIMITES_CONSULTA.nombreMax) errores.nombre = `Usá hasta ${LIMITES_CONSULTA.nombreMax} caracteres`

  if (!email.trim()) errores.email = 'Ingresá tu email'
  else if (!esEmailValido(email)) errores.email = 'Ingresá un email válido'

  if (m.length < LIMITES_CONSULTA.mensajeMin) errores.mensaje = `Contanos un poco más (mínimo ${LIMITES_CONSULTA.mensajeMin} caracteres)`
  else if (m.length > LIMITES_CONSULTA.mensajeMax) errores.mensaje = `Usá hasta ${LIMITES_CONSULTA.mensajeMax} caracteres`

  return errores
}

export function validarLogin({ email, password }) {
  const errores = {}
  if (!email.trim()) errores.email = 'Ingresá tu email'
  else if (!esEmailValido(email)) errores.email = 'Ingresá un email válido'
  if (!password) errores.password = 'Ingresá tu contraseña'
  return errores
}

// Pasa los issues de Zod que devuelve el backend ({ path: ['email'], ... }) a errores por campo.
export function erroresDelServidor(issues, mensajes) {
  const errores = {}
  for (const issue of issues) {
    const campo = issue.path?.[0]
    if (campo in mensajes && !errores[campo]) errores[campo] = mensajes[campo]
  }
  return errores
}
