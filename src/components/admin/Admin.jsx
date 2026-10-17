import { useEffect, useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router'
import Button from '../shared/button/Button'
import ConfirmModal from '../confirmModal/ConfirmModal'
import PropertyForm from '../propertyForm/PropertyForm'
import CatalogManager from '../catalogManager/CatalogManager'
import InquiryList from '../inquiryList/InquiryList'
import PageNotFound from '../pageNotFound/PageNotFound'
import { successToast, errorToast } from '../../shared/notifications'
import { getErrorMessage } from '../../shared/api'
import { OPERATION_LABELS, formatPrice } from '../../shared/format'
import { getProperties, deleteProperty } from './Admin.server'
import './Admin.scss'

const Admin = ({ token, user }) => {
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // Propiedad que se quiere borrar (null = modal cerrado)
  const [propertyToDelete, setPropertyToDelete] = useState(null)

  const navigate = useNavigate()
  const isAdmin = user.role === 'ADMIN'

  const loadProperties = () => {
    getProperties({
      onSuccess: (data) => {
        setProperties(data)
        setIsLoading(false)
      },
      onError: (err) => {
        console.error('getProperties failed:', err)
        errorToast('No se pudieron cargar las propiedades.')
        setIsLoading(false)
      },
    })
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const handleEditProperty = (property) => {
    navigate(`/admin/edit/${property.id}`, { state: property })
  }

  const handleConfirmDelete = () => {
    const { id, address } = propertyToDelete
    setPropertyToDelete(null)

    deleteProperty(id, token, {
      onSuccess: (deletedId) => {
        setProperties((prev) => prev.filter((property) => property.id !== deletedId))
        successToast(`Se eliminó la propiedad de ${address}.`)
      },
      onError: (err) => {
        console.error('deleteProperty failed:', err)
        errorToast(getErrorMessage(err))
      },
    })
  }

  // Lo llama PropertyForm cuando guardó bien.
  // Si era nueva, vamos a editarla para que se le puedan cargar fotos.
  const handlePropertySaved = (savedProperty, wasEditing) => {
    loadProperties()
    if (wasEditing)
      navigate('/admin', { replace: true })
    else
      navigate(`/admin/edit/${savedProperty.id}`, { replace: true })
  }

  const getLinkClass = ({ isActive }) =>
    isActive ? 'admin__tab admin__tab--active' : 'admin__tab'

  const propertiesMapped = properties.map((property) => (
    <tr key={property.id}>
      <td>{property.id}</td>
      <td>{property.address}</td>
      <td>{property.propertyType.description}</td>
      <td>{property.zone.name}</td>
      <td>{OPERATION_LABELS[property.operation]}</td>
      <td className="admin__price">{formatPrice(property.price, property.currency)}</td>
      <td>{property.photos.length}</td>
      <td>
        <div className="admin__row-actions">
          <Button variant="secondary" size="sm" onClick={() => handleEditProperty(property)}>Editar</Button>
          <Button variant="danger" size="sm" onClick={() => setPropertyToDelete(property)}>Eliminar</Button>
        </div>
      </td>
    </tr>
  ))

  const propertyTable = (
    <section>
      <div className="admin__section-header">
        <h2 className="admin__section-title">Propiedades</h2>
        <Button onClick={() => navigate('/admin/new')}>+ Nueva propiedad</Button>
      </div>

      {isLoading && <p className="status-text">Cargando propiedades…</p>}

      {!isLoading && properties.length === 0 && (
        <p className="status-text">Todavía no hay propiedades. Creá la primera con “Nueva propiedad”.</p>
      )}

      {properties.length > 0 && (
        // El contenedor permite scroll horizontal de la tabla en el celular
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Dirección</th>
                <th>Tipo</th>
                <th>Zona</th>
                <th>Operación</th>
                <th>Precio</th>
                <th>Fotos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>{propertiesMapped}</tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={propertyToDelete !== null}
        title="Eliminar propiedad"
        message={`¿Seguro que querés eliminar la propiedad de ${propertyToDelete?.address}? También se borran sus fotos y consultas. No se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPropertyToDelete(null)}
      />
    </section>
  )

  return (
    <div className="admin">
      <header className="admin__topbar">
        <div>
          <p className="admin__eyebrow">Panel de {isAdmin ? 'administración' : 'operador'}</p>
          <h1 className="admin__title">Hola, {user.name}</h1>
        </div>
        <nav className="admin__tabs">
          <NavLink to="/admin" end className={getLinkClass}>Propiedades</NavLink>
          {/* Zonas y tipos solo los puede modificar un ADMIN (requireAdmin en el back) */}
          {isAdmin && <NavLink to="/admin/zones" className={getLinkClass}>Zonas</NavLink>}
          {isAdmin && <NavLink to="/admin/property-types" className={getLinkClass}>Tipos</NavLink>}
          <NavLink to="/admin/inquiries" className={getLinkClass}>Consultas</NavLink>
        </nav>
      </header>

      {/* Rutas relativas a /admin */}
      <Routes>
        <Route index element={propertyTable} />
        {/* key distinta para que React arme el formulario de cero al pasar de "nueva" a "editar" */}
        <Route path="new" element={<PropertyForm key="new" token={token} user={user} onSaved={handlePropertySaved} onPhotosChange={loadProperties} />} />
        <Route path="edit/:id" element={<PropertyForm key="edit" token={token} user={user} onSaved={handlePropertySaved} onPhotosChange={loadProperties} />} />
        <Route
          path="zones"
          element={<CatalogManager key="zones" token={token} endpoint="zones" fieldName="name" title="Zonas" itemLabel="zona" placeholder="Fisherton" />}
        />
        <Route
          path="property-types"
          element={<CatalogManager key="types" token={token} endpoint="property-types" fieldName="description" title="Tipos de propiedad" itemLabel="tipo" placeholder="Departamento" />}
        />
        <Route path="inquiries" element={<InquiryList token={token} properties={properties} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  )
}

export default Admin
