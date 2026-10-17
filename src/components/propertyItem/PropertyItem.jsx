import { Link } from 'react-router'
import { getPhotoUrl } from '../../shared/api'
import { OPERATION_LABELS, formatPrice, formatSquareMeters } from '../../shared/format'
import './PropertyItem.scss'

const PropertyItem = ({ property }) => {
  const { id, photos, operation, price, currency, propertyType, zone, address, squareMeters, rooms } = property

  // Si no tiene fotos, usamos la imagen de reemplazo de /public
  const photoSrc = photos.length > 0 ? getPhotoUrl(photos[0]) : '/placeholder.svg'

  return (
    <article className="property-card">
      {/* Mandamos la propiedad en el state para que el detalle no tenga que volver a pedirla */}
      <Link to={`/properties/${id}`} state={property} className="property-card__link">
        <div className="property-card__photo-wrap">
          <img
            className="property-card__photo"
            src={photoSrc}
            alt={`Foto de ${address}`}
            loading="lazy"
            onError={(event) => { event.currentTarget.src = '/placeholder.svg' }}
          />
          <span className="property-card__badge">{OPERATION_LABELS[operation]}</span>
        </div>

        <div className="property-card__body">
          <p className="property-card__price">{formatPrice(price, currency)}</p>
          <p className="property-card__type">{propertyType.description} · {zone.name}</p>
          <p className="property-card__address">{address}</p>
          <p className="property-card__features">
            {formatSquareMeters(squareMeters)} · {rooms} {rooms === 1 ? 'habitación' : 'habitaciones'}
          </p>
        </div>
      </Link>
    </article>
  )
}

export default PropertyItem
