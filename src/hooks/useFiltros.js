import { useSearchParams } from 'react-router-dom'

export const OPERACIONES = ['VENTA', 'ALQUILER']
export const FILTROS_VACIOS = { zonaId: '', tipoId: '', operacion: '' }

// Los filtros viven en la URL (?zonaId=&tipoId=&operacion=) para poder
// compartir un listado filtrado y volver a él desde el detalle.
export function useFiltros() {
  const [params, setParams] = useSearchParams()

  const filtros = {
    zonaId: /^\d+$/.test(params.get('zonaId') ?? '') ? params.get('zonaId') : '',
    tipoId: /^\d+$/.test(params.get('tipoId') ?? '') ? params.get('tipoId') : '',
    operacion: OPERACIONES.includes(params.get('operacion')) ? params.get('operacion') : ''
  }

  const setFiltros = (nuevos) => {
    const siguiente = new URLSearchParams()
    for (const [clave, valor] of Object.entries({ ...filtros, ...nuevos })) {
      if (valor) siguiente.set(clave, valor)
    }
    setParams(siguiente, { replace: true })
  }

  const limpiar = () => setParams(new URLSearchParams(), { replace: true })

  const cantidadActivos = Object.values(filtros).filter(Boolean).length

  return { filtros, setFiltros, limpiar, cantidadActivos, search: params.toString() }
}
