import Icono from './Icono.jsx'
import './FotoPlaceholder.css'

// Fondo cálido para propiedades sin fotos (o si una foto no carga).
export default function FotoPlaceholder({ texto = 'Sin fotos por ahora', iconoSize = 48 }) {
  return (
    <div className="foto-placeholder">
      <Icono nombre="casa" size={iconoSize} strokeWidth={1.5} />
      {texto && <span>{texto}</span>}
    </div>
  )
}
