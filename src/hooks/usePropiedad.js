import { useEffect, useState } from 'react'
import { getPropiedad } from '../api/propiedades.js'

// Carga una propiedad por id. estado: cargando | listo | no-existe | error
export function usePropiedad(id) {
  const [propiedad, setPropiedad] = useState(null)
  const [estado, setEstado] = useState('cargando')
  const [error, setError] = useState('')
  const [reintento, setReintento] = useState(0)

  useEffect(() => {
    // El backend responde 400 si el id no es un entero positivo: lo tratamos como "no existe".
    if (!/^\d+$/.test(id) || Number(id) <= 0) {
      setEstado('no-existe')
      return
    }
    const control = new AbortController()
    setEstado('cargando')
    getPropiedad(id, { signal: control.signal })
      .then((p) => {
        setPropiedad(p)
        setEstado('listo')
      })
      .catch((e) => {
        if (e.name === 'AbortError') return
        if (e.status === 404 || e.status === 400) {
          setEstado('no-existe')
        } else {
          setError(e.message)
          setEstado('error')
        }
      })
    return () => control.abort()
  }, [id, reintento])

  return { propiedad, estado, error, reintentar: () => setReintento((n) => n + 1) }
}
