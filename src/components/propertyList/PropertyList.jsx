import { useEffect, useState } from 'react'
import PropertyItem from '../propertyItem/PropertyItem'
import Button from '../shared/button/Button'
import { OPERATION_LABELS } from '../../shared/format'
import { getProperties, getZones } from './PropertyList.server'
import './PropertyList.scss'

const PropertyList = () => {
  const [properties, setProperties] = useState([])
  const [zones, setZones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Filtros: '' significa "todas"
  const [operationFilter, setOperationFilter] = useState('')
  const [zoneFilter, setZoneFilter] = useState('')

  useEffect(() => {
    getProperties({
      onSuccess: (data) => {
        setProperties(data)
        setIsLoading(false)
      },
      onError: (err) => {
        console.error('getProperties failed:', err)
        setHasError(true)
        setIsLoading(false)
      },
    })

    getZones({
      onSuccess: (data) => setZones(data),
      onError: (err) => console.error('getZones failed:', err),
    })
  }, [])

  const handleClearFilters = () => {
    setOperationFilter('')
    setZoneFilter('')
  }

  // Filtramos en el cliente. El select devuelve texto, por eso Number(zoneFilter)
  const filteredProperties = properties.filter((property) =>
    (operationFilter === '' || property.operation === operationFilter) &&
    (zoneFilter === '' || property.zoneId === Number(zoneFilter))
  )

  const propertiesMapped = filteredProperties.map((property) => (
    <PropertyItem key={property.id} property={property} />
  ))

  const renderContent = () => {
    if (isLoading)
      return <p className="status-text">Cargando propiedades…</p>

    if (hasError)
      return <p className="status-text">No pudimos cargar las propiedades. ¿Está levantado el backend?</p>

    if (filteredProperties.length === 0)
      return (
        <div className="property-list__empty">
          <p className="status-text">No hay propiedades con esos filtros.</p>
          <Button variant="secondary" onClick={handleClearFilters}>Limpiar filtros</Button>
        </div>
      )

    return <div className="property-list__grid">{propertiesMapped}</div>
  }

  return (
    <section className="property-list">
      <header className="property-list__hero">
        <h1 className="property-list__title">Encontrá tu lugar en Rosario</h1>
        <p className="property-list__subtitle">Casas y departamentos en venta y alquiler.</p>
      </header>

      <div className="property-list__filters">
        <div className="property-list__operations">
          <button
            type="button"
            className={`property-list__operation ${operationFilter === '' ? 'property-list__operation--active' : ''}`}
            onClick={() => setOperationFilter('')}
          >
            Todas
          </button>
          {Object.keys(OPERATION_LABELS).map((operation) => (
            <button
              key={operation}
              type="button"
              className={`property-list__operation ${operationFilter === operation ? 'property-list__operation--active' : ''}`}
              onClick={() => setOperationFilter(operation)}
            >
              {OPERATION_LABELS[operation]}
            </button>
          ))}
        </div>

        <select
          className="field__input property-list__zone"
          aria-label="Filtrar por zona"
          value={zoneFilter}
          onChange={(event) => setZoneFilter(event.target.value)}
        >
          <option value="">Todas las zonas</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>{zone.name}</option>
          ))}
        </select>
      </div>

      {!isLoading && !hasError && (
        <p className="property-list__count">
          {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad' : 'propiedades'}
        </p>
      )}

      {renderContent()}
    </section>
  )
}

export default PropertyList
