import { Link } from 'react-router-dom'
import Foto from './Foto.jsx'
import { formatPrecio, formatOperacion } from '../utils/formato.js'
import './PropiedadCard.css'

export default function PropiedadCard({ propiedad, desde }) {
  const { id, fotos, operacion, precio, moneda, tipo, zona, direccion } = propiedad

  return (
    <article className="prop-card tarjeta">
      <Link to={`/propiedades/${id}`} state={{ desde }} className="prop-card-link">
        <div className="prop-card-foto">
          <Foto
            foto={fotos?.[0]}
            alt={`Foto de ${direccion}`}
            loading="lazy"
            placeholderTexto={fotos?.length ? null : 'Sin fotos por ahora'}
          />
          <span className="badge prop-card-badge">{formatOperacion(operacion)}</span>
        </div>
        <div className="prop-card-cuerpo">
          <p className="prop-card-precio">{formatPrecio(precio, moneda)}</p>
          <p className="prop-card-tipo">
            {tipo?.descTipo} · {zona?.nombreZona}
          </p>
          <p className="prop-card-direccion">{direccion}</p>
        </div>
      </Link>
    </article>
  )
}
