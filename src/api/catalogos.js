import { request } from './client.js'

export const getZonas = (opciones) => request('/zonas', opciones)
export const getTipos = (opciones) => request('/tipos', opciones)
