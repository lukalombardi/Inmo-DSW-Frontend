import { BASE_URL, authHeaders, handleResponse } from '../../shared/api'

export const getPhotos = (propertyId, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/photos?propertyId=${propertyId}`)
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

// Un archivo no se manda como JSON sino como FormData (campos "image" y "propertyId").
// Solo va el header Authorization: el Content-Type lo arma el navegador.
export const uploadPhoto = (propertyId, file, token, { onSuccess, onError }) => {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('propertyId', propertyId)

  fetch(`${BASE_URL}/photos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

export const deletePhoto = (photoId, token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/photos/${photoId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
    .then(handleResponse)
    .then(() => onSuccess(photoId))
    .catch((err) => onError(err))
}
