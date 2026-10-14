import { request } from './client.js'

// filtros: { zonaId, tipoId, operacion } (los vacíos no se mandan)
export function getPropiedades(filtros = {}, opciones) {
  const params = new URLSearchParams()
  for (const [clave, valor] of Object.entries(filtros)) {
    if (valor) params.set(clave, valor)
  }
  const query = params.toString()
  return request(`/propiedades${query ? `?${query}` : ''}`, opciones)
}

export function getPropiedad(id, opciones) {
  return request(`/propiedades/${encodeURIComponent(id)}`, opciones)
}
