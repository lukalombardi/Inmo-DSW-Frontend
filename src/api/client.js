export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

// Error con el status HTTP y el cuerpo que devolvió el backend.
// El backend responde { error: 'texto' } o, si falla Zod, { error: [issues] }.
export class ApiError extends Error {
  constructor(status, data) {
    const mensaje = typeof data?.error === 'string' ? data.error : 'Ocurrió un error inesperado'
    super(mensaje)
    this.status = status
    this.data = data
    this.issues = Array.isArray(data?.error) ? data.error : []
  }
}

export async function request(path, { method = 'GET', body, headers = {}, signal } = {}) {
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json', ...headers } : headers,
      body: body ? JSON.stringify(body) : undefined
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError(0, { error: 'No pudimos conectarnos con el servidor. Probá de nuevo en un rato.' })
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, data)
  return data
}
