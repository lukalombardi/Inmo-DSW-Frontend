import { BASE_URL, JSON_HEADERS, handleResponse } from '../../../shared/api'

// Responde { token, user: { id, name, email, role } } o 401 si los datos están mal
export const loginUser = (credentials, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(credentials),
  })
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}
