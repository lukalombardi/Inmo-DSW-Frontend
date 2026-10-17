import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import Button from '../shared/button/Button'
import InquiryForm from '../inquiryForm/InquiryForm'
import { getPhotoUrl } from '../../shared/api'
import { OPERATION_LABELS, formatPrice, formatSquareMeters, formatYesNo } from '../../shared/format'
import { MAP_ZOOM_AREA } from './PropertyDetails.const'
import { getProperty } from './PropertyDetails.server'
import './PropertyDetails.scss'

const PropertyDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state } = useLocation()

  // Si venimos desde la tarjeta, la propiedad llega en el state.
  // Si entran directo por la URL, la pedimos al back.
  const [property, setProperty] = useState(state ?? null)
  const [isLoading, setIsLoading] = useState(!state)
  const [selectedPhoto, setSelectedPhoto] = useState(0)

  useEffect(() => {
    if (state) return

    getProperty(id, {
      onSuccess: (data) => {
        setProperty(data)
        setIsLoading(false)
      },
      onError: (err) => {
        console.error('getProperty failed:', err)
        setIsLoading(false)
      },
    })
  }, [id, state])

  if (isLoading)
    return <p className="status-text">Cargando propiedad…</p>

  if (!property)
    return (
      <div className="property-details__not-found">
        <p className="status-text">No encontramos la propiedad {id}.</p>
        <Button variant="secondary" onClick={() => navigate('/properties')}>Volver al listado</Button>
      </div>
    )

  const {
    photos, operation, price, currency, propertyType, zone, address, description,
    rooms, squareMeters, garage, creditEligible, latitude, longitude,
  } = property

  const mainPhotoSrc = photos.length > 0 ? getPhotoUrl(photos[selectedPhoto]) : '/placeholder.svg'
  const hasCoordinates = latitude !== null && longitude !== null

  // Mapa de OpenStreetMap: se le pasa un recuadro (bbox) alrededor del punto y el marcador.
  // Prisma manda las coordenadas como string, por eso Number().
  const lat = Number(latitude)
  const lon = Number(longitude)
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - MAP_ZOOM_AREA},${lat - MAP_ZOOM_AREA},${lon + MAP_ZOOM_AREA},${lat + MAP_ZOOM_AREA}&layer=mapnik&marker=${lat},${lon}`

  return (
    <article className="property-details">
      <Button variant="ghost" size="sm" onClick={() => navigate('/properties')}>← Volver al listado</Button>

      <div className="property-details__gallery">
        <img className="property-details__main-photo" src={mainPhotoSrc} alt={`Foto de ${address}`} />

        {photos.length > 1 && (
          <div className="property-details__thumbs">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                className={`property-details__thumb ${index === selectedPhoto ? 'property-details__thumb--active' : ''}`}
                onClick={() => setSelectedPhoto(index)}
              >
                <img src={getPhotoUrl(photo)} alt={`Foto ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="property-details__body">
        <div className="property-details__info">
          <p className="property-details__tags">
            <span className="property-details__badge">{OPERATION_LABELS[operation]}</span>
            {propertyType.description} · {zone.name}
          </p>
          <h1 className="property-details__price">{formatPrice(price, currency)}</h1>
          <p className="property-details__address">{address}</p>

          <dl className="property-details__features">
            <div className="property-details__feature">
              <dt>Superficie</dt>
              <dd>{formatSquareMeters(squareMeters)}</dd>
            </div>
            <div className="property-details__feature">
              <dt>Habitaciones</dt>
              <dd>{rooms}</dd>
            </div>
            <div className="property-details__feature">
              <dt>Cochera</dt>
              <dd>{formatYesNo(garage)}</dd>
            </div>
            <div className="property-details__feature">
              <dt>Apto crédito</dt>
              <dd>{formatYesNo(creditEligible)}</dd>
            </div>
          </dl>

          <section>
            <h2 className="property-details__section-title">Descripción</h2>
            <p className="property-details__description">{description}</p>
          </section>

          {hasCoordinates && (
            <section>
              <h2 className="property-details__section-title">Ubicación</h2>
              <iframe
                className="property-details__map"
                title={`Mapa de ${address}`}
                src={mapSrc}
                loading="lazy"
              />
              <p className="property-details__map-caption">
                Latitud {Number(latitude)} · Longitud {Number(longitude)} ·{' '}
                <a
                  className="property-details__map-link"
                  href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver en el mapa
                </a>
              </p>
            </section>
          )}
        </div>

        <aside className="property-details__aside">
          <InquiryForm propertyId={property.id} />
        </aside>
      </div>
    </article>
  )
}

export default PropertyDetails
