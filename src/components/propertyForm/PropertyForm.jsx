import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import Button from '../shared/button/Button'
import PhotoManager from '../photoManager/PhotoManager'
import { successToast, errorToast } from '../../shared/notifications'
import { getErrorMessage, getFieldErrors } from '../../shared/api'
import { OPERATION_LABELS } from '../../shared/format'
import { initialPropertyForm, currencyOptions, propertyFieldMessages } from './PropertyForm.data'
import { MAX_DESCRIPTION_LENGTH, MAX_ADDRESS_LENGTH } from './PropertyForm.const'
import { propertyToForm, formToBody, validateForm } from './PropertyForm.helpers'
import { getProperty, getZones, getPropertyTypes, getUsers, createProperty, updateProperty } from './PropertyForm.server'
import './PropertyForm.scss'

const PropertyForm = ({ token, user, onSaved, onPhotosChange }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state } = useLocation()
  const isEditing = !!id

  // Si venimos desde "Editar" la propiedad llega en el state.
  // Si es nueva, el usuario responsable arranca siendo el que está logueado.
  const [form, setForm] = useState(
    state ? propertyToForm(state) : { ...initialPropertyForm, userId: String(user.id) }
  )
  const [errors, setErrors] = useState({})
  const [isSending, setIsSending] = useState(false)

  const [zones, setZones] = useState([])
  const [propertyTypes, setPropertyTypes] = useState([])
  const [users, setUsers] = useState([])

  // Entraron a /admin/edit/:id directo por la URL: pedimos la propiedad
  useEffect(() => {
    if (!isEditing || state) return

    getProperty(id, {
      onSuccess: (property) => setForm(propertyToForm(property)),
      onError: (err) => {
        console.error('getProperty failed:', err)
        errorToast('No encontramos esa propiedad.')
        navigate('/admin', { replace: true })
      },
    })
  }, [id, isEditing, state, navigate])

  // Opciones de los selects
  useEffect(() => {
    getZones({
      onSuccess: (data) => setZones(data),
      onError: (err) => console.error('getZones failed:', err),
    })

    getPropertyTypes({
      onSuccess: (data) => setPropertyTypes(data),
      onError: (err) => console.error('getPropertyTypes failed:', err),
    })

    getUsers(token, {
      onSuccess: (data) => setUsers(data),
      // Un OPERATOR no puede listar usuarios: le dejamos solo su propio usuario
      onError: () => setUsers([user]),
    })
  }, [token, user])

  const handleInputChange = (event, attr) => {
    setForm((prevForm) => ({
      ...prevForm,
      [attr]: event.target.value,
    }))

    setErrors((prevErrors) => ({
      ...prevErrors,
      [attr]: '',
    }))
  }

  const handleCheckboxChange = (event, attr) => {
    setForm((prevForm) => ({
      ...prevForm,
      [attr]: event.target.checked,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const formErrors = validateForm(form)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      errorToast('Revisá los datos marcados en el formulario.')
      return
    }

    const callbacks = {
      onSuccess: (savedProperty) => {
        successToast(isEditing
          ? 'Propiedad actualizada correctamente.'
          : 'Propiedad creada. Ahora podés agregarle fotos.')
        onSaved(savedProperty, isEditing)
      },
      onError: (err) => {
        console.error('saveProperty failed:', err)
        // Si el back respondió 400, marcamos los campos con error
        setErrors(getFieldErrors(err, propertyFieldMessages))
        errorToast(getErrorMessage(err))
        setIsSending(false)
      },
    }

    setIsSending(true)
    if (isEditing)
      updateProperty(id, formToBody(form), token, callbacks)
    else
      createProperty(formToBody(form), token, callbacks)
  }

  const getInputClass = (field) =>
    `field__input ${errors[field] ? 'field__input--error' : ''}`

  const renderError = (field) =>
    errors[field] && <p className="field__error">{errors[field]}</p>

  return (
    <div className="property-form-page">
      <form className="property-form" onSubmit={handleSubmit} noValidate>
        <h2 className="property-form__heading">{isEditing ? `Editar propiedad #${id}` : 'Nueva propiedad'}</h2>

        {(zones.length === 0 || propertyTypes.length === 0) && (
          <p className="property-form__notice">
            Para crear una propiedad primero tiene que haber al menos una zona y un tipo cargados.
          </p>
        )}

        <div className="property-form__row">
          <div className="field">
            <label className="field__label" htmlFor="propertyTypeId">Tipo</label>
            <select
              className={getInputClass('propertyTypeId')}
              id="propertyTypeId"
              value={form.propertyTypeId}
              onChange={(event) => handleInputChange(event, 'propertyTypeId')}
            >
              <option value="">Elegí un tipo</option>
              {propertyTypes.map((propertyType) => (
                <option key={propertyType.id} value={propertyType.id}>{propertyType.description}</option>
              ))}
            </select>
            {renderError('propertyTypeId')}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="zoneId">Zona</label>
            <select
              className={getInputClass('zoneId')}
              id="zoneId"
              value={form.zoneId}
              onChange={(event) => handleInputChange(event, 'zoneId')}
            >
              <option value="">Elegí una zona</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>{zone.name}</option>
              ))}
            </select>
            {renderError('zoneId')}
          </div>
        </div>

        <div className="property-form__row">
          <div className="field">
            <label className="field__label" htmlFor="operation">Operación</label>
            <select
              className={getInputClass('operation')}
              id="operation"
              value={form.operation}
              onChange={(event) => handleInputChange(event, 'operation')}
            >
              {Object.keys(OPERATION_LABELS).map((operation) => (
                <option key={operation} value={operation}>{OPERATION_LABELS[operation]}</option>
              ))}
            </select>
            {renderError('operation')}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="userId">Usuario responsable</label>
            <select
              className={getInputClass('userId')}
              id="userId"
              value={form.userId}
              onChange={(event) => handleInputChange(event, 'userId')}
            >
              <option value="">Elegí un usuario</option>
              {users.map((option) => (
                <option key={option.id} value={option.id}>{option.name} ({option.email})</option>
              ))}
            </select>
            {renderError('userId')}
          </div>
        </div>

        <div className="property-form__row">
          <div className="field property-form__currency">
            <label className="field__label" htmlFor="currency">Moneda</label>
            <select
              className={getInputClass('currency')}
              id="currency"
              value={form.currency}
              onChange={(event) => handleInputChange(event, 'currency')}
            >
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            {renderError('currency')}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="price">Precio</label>
            <input
              className={getInputClass('price')}
              type="number"
              id="price"
              min={0}
              step="0.01"
              placeholder="120000"
              value={form.price}
              onChange={(event) => handleInputChange(event, 'price')}
            />
            {renderError('price')}
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="address">Dirección</label>
          <input
            className={getInputClass('address')}
            type="text"
            id="address"
            maxLength={MAX_ADDRESS_LENGTH}
            placeholder="Bv. Oroño 1234"
            value={form.address}
            onChange={(event) => handleInputChange(event, 'address')}
          />
          {renderError('address')}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="description">Descripción</label>
          <textarea
            className={getInputClass('description')}
            id="description"
            maxLength={MAX_DESCRIPTION_LENGTH}
            placeholder="Departamento luminoso con balcón al frente…"
            value={form.description}
            onChange={(event) => handleInputChange(event, 'description')}
          />
          <p className="property-form__counter">{form.description.length} / {MAX_DESCRIPTION_LENGTH}</p>
          {renderError('description')}
        </div>

        <div className="property-form__row">
          <div className="field">
            <label className="field__label" htmlFor="rooms">Habitaciones</label>
            <input
              className={getInputClass('rooms')}
              type="number"
              id="rooms"
              min={0}
              step={1}
              placeholder="2"
              value={form.rooms}
              onChange={(event) => handleInputChange(event, 'rooms')}
            />
            {renderError('rooms')}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="squareMeters">Metros cuadrados</label>
            <input
              className={getInputClass('squareMeters')}
              type="number"
              id="squareMeters"
              min={0}
              step="0.01"
              placeholder="65"
              value={form.squareMeters}
              onChange={(event) => handleInputChange(event, 'squareMeters')}
            />
            {renderError('squareMeters')}
          </div>
        </div>

        <div className="property-form__row">
          <div className="field">
            <label className="field__label" htmlFor="latitude">Latitud (opcional)</label>
            <input
              className={getInputClass('latitude')}
              type="number"
              id="latitude"
              step="any"
              placeholder="-32.9468"
              value={form.latitude}
              onChange={(event) => handleInputChange(event, 'latitude')}
            />
            {renderError('latitude')}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="longitude">Longitud (opcional)</label>
            <input
              className={getInputClass('longitude')}
              type="number"
              id="longitude"
              step="any"
              placeholder="-60.6393"
              value={form.longitude}
              onChange={(event) => handleInputChange(event, 'longitude')}
            />
            {renderError('longitude')}
          </div>
        </div>

        <div className="property-form__row">
          <div className="field field--checkbox">
            <input
              type="checkbox"
              id="garage"
              checked={form.garage}
              onChange={(event) => handleCheckboxChange(event, 'garage')}
            />
            <label className="field__label" htmlFor="garage">Tiene cochera</label>
          </div>

          <div className="field field--checkbox">
            <input
              type="checkbox"
              id="creditEligible"
              checked={form.creditEligible}
              onChange={(event) => handleCheckboxChange(event, 'creditEligible')}
            />
            <label className="field__label" htmlFor="creditEligible">Apta crédito</label>
          </div>
        </div>

        <div className="property-form__actions">
          <Button variant="secondary" onClick={() => navigate('/admin')}>Cancelar</Button>
          <Button type="submit" disabled={isSending}>
            {isSending ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear propiedad'}
          </Button>
        </div>
      </form>

      {/* Las fotos necesitan el id de la propiedad, por eso solo aparecen al editar */}
      {isEditing && <PhotoManager propertyId={id} token={token} onPhotosChange={onPhotosChange} />}
    </div>
  )
}

export default PropertyForm
