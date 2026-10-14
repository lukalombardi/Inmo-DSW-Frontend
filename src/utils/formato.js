import { API_URL } from '../api/client.js'

const numeroAR = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })
const decimalAR = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 })

// Prisma serializa los Decimal como string ("95000.00"), por eso el Number().
export function formatPrecio(precio, moneda) {
  const monto = numeroAR.format(Number(precio))
  return moneda === 'USD' ? `USD ${monto}` : `$ ${monto}`
}

export function formatMetros(metros) {
  return `${decimalAR.format(Number(metros))} m²`
}

export function formatOperacion(operacion) {
  return operacion === 'ALQUILER' ? 'Alquiler' : 'Venta'
}

export function siNo(valor) {
  return valor ? 'Sí' : 'No'
}

// Las fotos vienen como "/uploads/archivo.jpg": se sirven desde el backend.
export function urlFoto(url) {
  if (!url) return null
  return /^https?:\/\//.test(url) ? url : `${API_URL}${url}`
}
