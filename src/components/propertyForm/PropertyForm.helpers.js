import { propertyFieldMessages } from './PropertyForm.data'

// Campos que no pueden quedar vacíos
const REQUIRED_FIELDS = ['propertyTypeId', 'zoneId', 'userId', 'price', 'address', 'description', 'rooms', 'squareMeters']

// Propiedad que viene del back → valores para los inputs (todo como texto)
export const propertyToForm = (property) => ({
  propertyTypeId: String(property.propertyTypeId),
  zoneId: String(property.zoneId),
  userId: String(property.userId),
  operation: property.operation,
  currency: property.currency,
  price: String(property.price),
  address: property.address,
  description: property.description,
  rooms: String(property.rooms),
  squareMeters: String(property.squareMeters),
  garage: property.garage,
  creditEligible: property.creditEligible,
  latitude: property.latitude ?? '',
  longitude: property.longitude ?? '',
})

// Valores del formulario → body para POST / PATCH /properties
export const formToBody = (form) => {
  const body = {
    propertyTypeId: Number(form.propertyTypeId),
    zoneId: Number(form.zoneId),
    userId: Number(form.userId),
    operation: form.operation,
    currency: form.currency,
    price: Number(form.price),
    address: form.address,
    description: form.description,
    rooms: Number(form.rooms),
    squareMeters: Number(form.squareMeters),
    garage: form.garage,
    creditEligible: form.creditEligible,
  }

  // Las coordenadas son opcionales: si están vacías no las mandamos
  // (si mandáramos '' el back lo convertiría en 0)
  if (form.latitude !== '' && form.longitude !== '') {
    body.latitude = Number(form.latitude)
    body.longitude = Number(form.longitude)
  }

  return body
}

// Validación simple antes de mandar. El back vuelve a validar todo igual.
export const validateForm = (form) => {
  const errors = {}

  REQUIRED_FIELDS.forEach((field) => {
    if (String(form[field]).trim() === '') errors[field] = propertyFieldMessages[field]
  })

  // Latitud y longitud van juntas: o las dos o ninguna
  const hasLatitude = form.latitude !== ''
  const hasLongitude = form.longitude !== ''
  if (hasLatitude && !hasLongitude) errors.longitude = propertyFieldMessages.longitude
  if (!hasLatitude && hasLongitude) errors.latitude = propertyFieldMessages.latitude

  return errors
}
