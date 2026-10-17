import { useEffect, useState } from 'react'
import Button from '../shared/button/Button'
import ConfirmModal from '../confirmModal/ConfirmModal'
import { successToast, errorToast } from '../../shared/notifications'
import { getErrorMessage } from '../../shared/api'
import { getItems, createItem, updateItem, deleteItem } from './CatalogManager.server'
import './CatalogManager.scss'

// Sirve para zonas y para tipos de propiedad: cambia el endpoint y el nombre del campo.
// fieldName: "name" en zonas, "description" en tipos.
const CatalogManager = ({ token, endpoint, fieldName, title, itemLabel, placeholder }) => {
  const [items, setItems] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [fieldError, setFieldError] = useState('')
  // null = estamos creando; un id = estamos editando ese item
  const [editingId, setEditingId] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    getItems(endpoint, {
      onSuccess: (data) => setItems(data),
      onError: (err) => {
        console.error('getItems failed:', err)
        errorToast(`No se pudieron cargar los datos de ${title.toLowerCase()}.`)
      },
    })
  }, [endpoint, title])

  const resetForm = () => {
    setInputValue('')
    setEditingId(null)
    setFieldError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // Misma regla que el back: entre 2 y 100 caracteres
    if (inputValue.trim().length < 2) {
      setFieldError('Tiene que tener al menos 2 caracteres.')
      return
    }

    const body = { [fieldName]: inputValue }
    const onError = (err) => {
      console.error('saveItem failed:', err)
      errorToast(getErrorMessage(err))
    }

    if (editingId === null) {
      createItem(endpoint, body, token, {
        onSuccess: (newItem) => {
          setItems((prev) => [...prev, newItem])
          successToast(`Se creó la ${itemLabel} "${newItem[fieldName]}".`)
          resetForm()
        },
        onError,
      })
    } else {
      updateItem(endpoint, editingId, body, token, {
        onSuccess: (updatedItem) => {
          setItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
          successToast('Cambios guardados.')
          resetForm()
        },
        onError,
      })
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setInputValue(item[fieldName])
    setFieldError('')
  }

  const handleConfirmDelete = () => {
    const { id } = itemToDelete
    setItemToDelete(null)

    deleteItem(endpoint, id, token, {
      onSuccess: (deletedId) => {
        setItems((prev) => prev.filter((item) => item.id !== deletedId))
        successToast(`Se eliminó la ${itemLabel}.`)
      },
      onError: (err) => {
        console.error('deleteItem failed:', err)
        // Ej: 409 "No se puede eliminar la zona porque tiene propiedades asociadas"
        errorToast(getErrorMessage(err))
      },
    })
  }

  const itemsMapped = items.map((item) => (
    <li key={item.id} className="catalog-manager__item">
      <span className="catalog-manager__name">{item[fieldName]}</span>
      <div className="catalog-manager__actions">
        <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>Editar</Button>
        <Button variant="danger" size="sm" onClick={() => setItemToDelete(item)}>Eliminar</Button>
      </div>
    </li>
  ))

  return (
    <section className="catalog-manager">
      <h2 className="catalog-manager__title">{title}</h2>

      <form className="catalog-manager__form" onSubmit={handleSubmit}>
        <div className="field catalog-manager__field">
          <label className="field__label" htmlFor={`${endpoint}-input`}>
            {editingId === null ? `Nueva ${itemLabel}` : `Editar ${itemLabel}`}
          </label>
          <input
            className={`field__input ${fieldError ? 'field__input--error' : ''}`}
            id={`${endpoint}-input`}
            type="text"
            maxLength={100}
            placeholder={placeholder}
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value)
              setFieldError('')
            }}
          />
          {fieldError && <p className="field__error">{fieldError}</p>}
        </div>
        <div className="catalog-manager__form-actions">
          {editingId !== null && <Button variant="secondary" onClick={resetForm}>Cancelar</Button>}
          <Button type="submit">{editingId === null ? 'Agregar' : 'Guardar'}</Button>
        </div>
      </form>

      {items.length > 0
        ? <ul className="catalog-manager__list">{itemsMapped}</ul>
        : <p className="status-text">Todavía no hay datos cargados.</p>}

      <ConfirmModal
        open={itemToDelete !== null}
        title={`Eliminar ${itemLabel}`}
        message={`¿Seguro que querés eliminar "${itemToDelete?.[fieldName]}"?`}
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </section>
  )
}

export default CatalogManager
