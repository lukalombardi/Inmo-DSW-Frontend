import Button from '../shared/button/Button'
import './ConfirmModal.scss'

const ConfirmModal = ({
  open,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null

  // Si se hace clic afuera de la caja, se cierra
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onCancel()
  }

  return (
    <div className="confirm-modal__overlay" onClick={handleOverlayClick}>
      <div className="confirm-modal" role="dialog" aria-modal="true">
        <h2 className="confirm-modal__title">{title}</h2>
        <p className="confirm-modal__message">{message}</p>
        <div className="confirm-modal__actions">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant="primary" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
