import { cloneElement, useId } from 'react'
import Icono from './Icono.jsx'

// Etiqueta + control + error, con los aria-* conectados.
// accion: botón opcional dentro del campo (ej. Mostrar/Ocultar contraseña).
export default function Campo({ etiqueta, error, ayuda, accion, children }) {
  const id = useId()
  const idError = `${id}-error`
  const idAyuda = `${id}-ayuda`
  const describedBy = [error && idError, ayuda && idAyuda].filter(Boolean).join(' ') || undefined

  const control = cloneElement(children, {
    id,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy
  })

  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      {accion ? <div className="input-con-accion">{control}{accion}</div> : control}
      {error && (
        <p className="error-campo" id={idError}>
          <Icono nombre="alerta" size={16} strokeWidth={2} /> {error}
        </p>
      )}
      {ayuda && !error && <p className="campo-ayuda" id={idAyuda}>{ayuda}</p>}
    </div>
  )
}
