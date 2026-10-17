import { BASE_URL, authHeaders, handleResponse } from '../../shared/api'

export const getProperties = ({ onSuccess, onError }) => {
  fetch(`${BASE_URL}/properties`)
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

// Borrar pide estar logueado: mandamos el token en el header Authorization
export const deleteProperty = (propertyId, token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/properties/${propertyId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
    .then(handleResponse)
    .then(() => onSuccess(propertyId))
    .catch((err) => onError(err))
}
