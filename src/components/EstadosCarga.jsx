import { Link } from 'react-router-dom'
import EstadoVacio from './EstadoVacio.jsx'
import Icono from './Icono.jsx'

// Estados compartidos por las pantallas que cargan una propiedad.
export function Cargando({ texto = 'Cargando…' }) {
  return (
    <p className="texto-secundario" role="status" style={{ padding: 'var(--esp-6) 0' }}>
      {texto}
    </p>
  )
}

export function PropiedadNoExiste() {
  return (
    <EstadoVacio
      icono="casa"
      titulo="No encontramos esta propiedad"
      texto="Puede que ya no esté publicada o que el enlace esté mal escrito."
    >
      <Link to="/" className="btn btn-primario">Ver todas las propiedades</Link>
    </EstadoVacio>
  )
}

export function ErrorCarga({ mensaje, onReintentar }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--esp-2)', padding: 'var(--esp-4) 0' }}>
      <p className="alerta-error">
        <Icono nombre="alerta" size={20} /> {mensaje}
      </p>
      <button type="button" className="btn btn-secundario" onClick={onReintentar}>Reintentar</button>
    </div>
  )
}
