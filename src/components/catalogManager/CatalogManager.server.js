import { BASE_URL, authHeaders, handleResponse } from '../../shared/api'

// endpoint es "zones" o "property-types": los dos funcionan igual en el back

export const getItems = (endpoint, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/${endpoint}`)
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

export const createItem = (endpoint, item, token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(item),
  })
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

export const updateItem = (endpoint, id, item, token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/${endpoint}/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(item),
  })
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

export const deleteItem = (endpoint, id, token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/${endpoint}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
    .then(handleResponse)
    .then(() => onSuccess(id))
    .catch((err) => onError(err))
}
