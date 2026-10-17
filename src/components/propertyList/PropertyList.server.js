import { BASE_URL, handleResponse } from '../../shared/api'

// GET /properties ya trae la zona, el tipo y las fotos de cada propiedad
export const getProperties = ({ onSuccess, onError }) => {
  fetch(`${BASE_URL}/properties`)
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
