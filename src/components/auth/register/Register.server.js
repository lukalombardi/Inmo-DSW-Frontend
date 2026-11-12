import { BASE_URL, JSON_HEADERS, handleResponse } from '../../../shared/api'

// Crea un usuario VISITOR. Responde igual que el login: { token, user: { id, name, email, role } }
// 409 si el email ya está registrado, 400 si algún campo no pasa la validación
export const registerUser = (data, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  })
    .then(handleResponse)
    .then((result) => onSuccess(result))
    .catch((err) => onError(err))
}
