import { BASE_URL, authHeaders, handleResponse } from '../../shared/api'

// Devuelve directamente un array de PROPIEDADES (no de likes), cada una con
// propertyType, zone y photos, de la que se marcó más reciente a la más vieja.
// También lo usa App para armar el Set de ids marcados al iniciar sesión.
export const getMyLikes = (token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/likes/mine`, { headers: authHeaders(token) })
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}
