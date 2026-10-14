import Icono from './Icono.jsx'
import './EstadoVacio.css'

export default function EstadoVacio({ icono = 'buscar', titulo, texto, children }) {
  return (
    <div className="estado-vacio">
      <span className="estado-vacio-icono">
        <Icono nombre={icono} size={32} />
      </span>
      <div className="estado-vacio-texto">
        <h2>{titulo}</h2>
        {texto && <p>{texto}</p>}
      </div>
      {children && <div className="estado-vacio-acciones">{children}</div>}
    </div>
  )
}
