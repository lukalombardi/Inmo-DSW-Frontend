// Textos en español para los valores que manda el back
export const OPERATION_LABELS = {
  SALE: 'Venta',
  RENT: 'Alquiler',
}

// Prisma manda los Decimal como string ("150000"), por eso usamos Number()
export const formatPrice = (price, currency) =>
  `${currency} ${Number(price).toLocaleString('es-AR')}`

export const formatSquareMeters = (squareMeters) =>
  `${Number(squareMeters).toLocaleString('es-AR')} m²`

export const formatYesNo = (value) => (value ? 'Sí' : 'No')
