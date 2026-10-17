// Todo va como texto porque así lo devuelven los inputs.
// Antes de mandarlo al back lo pasamos a número (ver PropertyForm.helpers.js).
export const initialPropertyForm = {
  propertyTypeId: '',
  zoneId: '',
  userId: '',
  operation: 'SALE',
  currency: 'USD',
  price: '',
  address: '',
  description: '',
  rooms: '',
  squareMeters: '',
  garage: false,
  creditEligible: false,
  latitude: '',
  longitude: '',
}

export const currencyOptions = ['USD', 'ARS']

// Mensajes en español para cada campo que valida el back (property.schema.js)
export const propertyFieldMessages = {
  propertyTypeId: 'Elegí un tipo de propiedad.',
  zoneId: 'Elegí una zona.',
  userId: 'Elegí el usuario responsable.',
  operation: 'Elegí si es venta o alquiler.',
  currency: 'Elegí la moneda.',
  price: 'Ingresá un precio mayor a 0.',
  address: 'Ingresá la dirección (entre 2 y 191 caracteres).',
  description: 'Escribí una descripción de entre 2 y 256 caracteres.',
  rooms: 'Ingresá la cantidad de habitaciones (número entero, 0 o más).',
  squareMeters: 'Ingresá los metros cuadrados (mayor a 0).',
  garage: 'Indicá si tiene cochera.',
  creditEligible: 'Indicá si es apta crédito.',
  latitude: 'La latitud va de -90 a 90 y se carga junto con la longitud.',
  longitude: 'La longitud va de -180 a 180 y se carga junto con la latitud.',
}
