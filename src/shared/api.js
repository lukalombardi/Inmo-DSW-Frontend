// URL del backend. No hace falta proxy porque el back ya usa app.use(cors()).
export const BASE_URL = 'http://localhost:3000'

export const JSON_HEADERS = { 'Content-Type': 'application/json' }

// Headers para las rutas protegidas del back (verifyToken pide "Bearer <token>")
export const authHeaders = (token) => ({
  ...JSON_HEADERS,
  Authorization: `Bearer ${token}`,
})

// fetch no falla con un 400 o un 401, así que lo revisamos a mano:
// si el status no es 2xx, mandamos el cuerpo del error al .catch
export const handleResponse = (res) =>
  res.json().then((data) => {
    if (!res.ok) throw data
    return data
  })

// Mensaje para mostrar en un toast.
// El back responde { error: 'texto' } o, si falla zod, { error: [lista de errores] }
export const getErrorMessage = (err) => {
  if (typeof err?.error === 'string') return err.error
  if (Array.isArray(err?.error)) return 'Revisá los datos marcados en el formulario.'
  return 'No pudimos conectarnos con el servidor. Probá de nuevo en un rato.'
}

// Arma { campo: mensaje } con los errores de zod que mandó el back (status 400).
// Los mensajes salen de nuestra lista en español, no del back.
export const getFieldErrors = (err, fieldMessages) => {
  const fieldErrors = {}
  if (!Array.isArray(err?.error)) return fieldErrors

  err.error.forEach((issue) => {
    const field = issue.path?.[0]
    if (fieldMessages[field]) fieldErrors[field] = fieldMessages[field]
  })
  return fieldErrors
}

// Las fotos se guardan en el back como "/uploads/archivo.jpg"
export const getPhotoUrl = (photo) => `${BASE_URL}${photo.url}`
