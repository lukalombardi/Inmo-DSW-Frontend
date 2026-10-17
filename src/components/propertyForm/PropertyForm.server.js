import { BASE_URL, authHeaders, handleResponse } from '../../shared/api'

export const getProperty = (id, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/properties/${id}`)
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

export const getZones = ({ onSuccess, onError }) => {
  fetch(`${BASE_URL}/zones`)
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

export const getPropertyTypes = ({ onSuccess, onError }) => {
  fetch(`${BASE_URL}/property-types`)
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

// GET /users solo lo puede usar un ADMIN (requireAdmin en el back)
export const getUsers = (token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/users`, { headers: authHeaders(token) })
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

export const createProperty = (property, token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/properties`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(property),
  })
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

// El back edita con PATCH (no PUT)
export const updateProperty = (id, property, token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/properties/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(property),
  })
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}
