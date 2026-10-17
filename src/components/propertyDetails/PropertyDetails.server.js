import { BASE_URL, handleResponse } from '../../shared/api'

export const getProperty = (id, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/properties/${id}`)
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}
