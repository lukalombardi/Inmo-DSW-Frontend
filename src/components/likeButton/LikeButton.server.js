import { BASE_URL, authHeaders, handleResponse } from '../../shared/api'

// El back valida el body con z.strictObject({}): hay que mandar un objeto vacío,
// sin body responde 400. El usuario sale del token y la propiedad de la URL.
export const addLike = (propertyId, token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/properties/${propertyId}/likes`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({}),
  })
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

export const removeLike = (propertyId, token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/properties/${propertyId}/likes`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}
