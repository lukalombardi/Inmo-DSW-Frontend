import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import PropertyItem from '../propertyItem/PropertyItem'
import Button from '../shared/button/Button'
import { errorToast } from '../../shared/notifications'
import { getErrorMessage } from '../../shared/api'
import { getMyLikes } from './Favorites.server'
import './Favorites.scss'

const Favorites = ({ token, likedIds, onLikedChange }) => {
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    getMyLikes(token, {
      // El back ya manda las propiedades: van tal cual a PropertyItem
      onSuccess: (data) => {
        setProperties(data)
        setIsLoading(false)
      },
      onError: (err) => {
        console.error('getMyLikes failed:', err)
        errorToast(getErrorMessage(err))
        setHasError(true)
        setIsLoading(false)
      },
    })
  }, [token])

  // Si sacan el like desde acá la tarjeta queda con el corazón vacío hasta que
  // vuelvan a entrar, así pueden deshacerlo si fue sin querer.
  const propertiesMapped = properties.map((property) => (
    <PropertyItem
      key={property.id}
      property={property}
      isLiked={likedIds.has(property.id)}
      token={token}
      onLikedChange={onLikedChange}
    />
  ))

  const renderContent = () => {
    if (isLoading)
      return <p className="status-text">Cargando tus favoritos…</p>

    if (hasError)
      return <p className="status-text">No pudimos cargar tus favoritos. Probá de nuevo en un rato.</p>

    if (properties.length === 0)
      return (
        <div className="favorites__empty">
          <p className="status-text">Todavía no guardaste propiedades.</p>
          <Button onClick={() => navigate('/properties')}>Ver propiedades</Button>
        </div>
      )

    return <div className="favorites__grid">{propertiesMapped}</div>
  }

  return (
    <section className="favorites">
      <header className="favorites__header">
        <h1 className="favorites__title">Mis favoritos</h1>
        <p className="favorites__subtitle">Las propiedades que guardaste, de la más reciente a la más vieja.</p>
      </header>

      {renderContent()}
    </section>
  )
}

export default Favorites
