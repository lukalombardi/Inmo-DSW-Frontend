import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Button from '../shared/button/Button'
import ConfirmModal from '../confirmModal/ConfirmModal'
import { successToast, errorToast } from '../../shared/notifications'
import { getErrorMessage } from '../../shared/api'
import { getInquiries, deleteInquiry } from './InquiryList.server'
import './InquiryList.scss'

const InquiryList = ({ token, properties }) => {
  const [inquiries, setInquiries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [inquiryToDelete, setInquiryToDelete] = useState(null)

  useEffect(() => {
    getInquiries(token, {
      // Las más nuevas primero
      onSuccess: (data) => {
        setInquiries([...data].reverse())
        setIsLoading(false)
      },
      onError: (err) => {
        console.error('getInquiries failed:', err)
        errorToast(getErrorMessage(err))
        setIsLoading(false)
      },
    })
  }, [token])

  const handleConfirmDelete = () => {
    const { id } = inquiryToDelete
    setInquiryToDelete(null)

    deleteInquiry(id, token, {
      onSuccess: (deletedId) => {
        setInquiries((prev) => prev.filter((inquiry) => inquiry.id !== deletedId))
        successToast('Consulta eliminada.')
      },
      onError: (err) => {
        console.error('deleteInquiry failed:', err)
        errorToast(getErrorMessage(err))
      },
    })
  }

  // La consulta solo trae propertyId: buscamos la dirección en la lista de propiedades
  const getPropertyAddress = (propertyId) => {
    const property = properties.find((item) => item.id === propertyId)
    return property ? property.address : `Propiedad #${propertyId}`
  }

  const inquiriesMapped = inquiries.map((inquiry) => (
    <li key={inquiry.id} className="inquiry-list__item">
      <div className="inquiry-list__header">
        <div>
          <p className="inquiry-list__name">{inquiry.name}</p>
          <a className="inquiry-list__email" href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
        </div>
        <p className="inquiry-list__date">{new Date(inquiry.createdAt).toLocaleString('es-AR')}</p>
      </div>
      <p className="inquiry-list__message">{inquiry.message}</p>
      <div className="inquiry-list__footer">
        <Link className="inquiry-list__property" to={`/properties/${inquiry.propertyId}`}>
          {getPropertyAddress(inquiry.propertyId)}
        </Link>
        <Button variant="danger" size="sm" onClick={() => setInquiryToDelete(inquiry)}>Eliminar</Button>
      </div>
    </li>
  ))

  return (
    <section className="inquiry-list">
      <h2 className="inquiry-list__title">Consultas recibidas</h2>

      {isLoading && <p className="status-text">Cargando consultas…</p>}
      {!isLoading && inquiries.length === 0 && <p className="status-text">Todavía no llegó ninguna consulta.</p>}
      {inquiries.length > 0 && <ul className="inquiry-list__list">{inquiriesMapped}</ul>}

      <ConfirmModal
        open={inquiryToDelete !== null}
        title="Eliminar consulta"
        message={`¿Seguro que querés eliminar la consulta de ${inquiryToDelete?.name}?`}
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setInquiryToDelete(null)}
      />
    </section>
  )
}

export default InquiryList
