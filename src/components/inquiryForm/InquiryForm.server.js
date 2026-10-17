import { BASE_URL, JSON_HEADERS, handleResponse } from '../../shared/api'

// POST /inquiries es público: cualquiera consulta sin loguearse, no lleva token
export const createInquiry = (inquiry, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/inquiries`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(inquiry),
  })
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}
