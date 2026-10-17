import { BASE_URL, authHeaders, handleResponse } from '../../shared/api'

// Leer consultas pide estar logueado
export const getInquiries = (token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/inquiries`, { headers: authHeaders(token) })
    .then(handleResponse)
    .then((data) => onSuccess(data))
    .catch((err) => onError(err))
}

export const deleteInquiry = (inquiryId, token, { onSuccess, onError }) => {
  fetch(`${BASE_URL}/inquiries/${inquiryId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
    .then(handleResponse)
    .then(() => onSuccess(inquiryId))
    .catch((err) => onError(err))
}
