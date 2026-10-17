import { useState } from 'react'
import Button from '../shared/button/Button'
import { successToast, errorToast } from '../../shared/notifications'
import { getErrorMessage, getFieldErrors } from '../../shared/api'
import { initialInquiryForm, inquiryFieldMessages } from './InquiryForm.data'
import { MAX_MESSAGE_LENGTH } from './InquiryForm.const'
import { createInquiry } from './InquiryForm.server'
import './InquiryForm.scss'

const InquiryForm = ({ propertyId }) => {
  const [form, setForm] = useState(initialInquiryForm)
  const [errors, setErrors] = useState({})
  const [isSending, setIsSending] = useState(false)

  const handleInputChange = (event, field) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: event.target.value,
    }))

    // Al escribir, sacamos el error de ese campo
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '',
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSending(true)

    // El back valida propertyId con z.number(), por eso Number()
    createInquiry({ ...form, propertyId: Number(propertyId) }, {
      onSuccess: () => {
        successToast('¡Listo! Recibimos tu consulta, te vamos a escribir pronto.')
        setForm(initialInquiryForm)
        setIsSending(false)
      },
      onError: (err) => {
        console.error('createInquiry failed:', err)
        setErrors(getFieldErrors(err, inquiryFieldMessages))
        errorToast(getErrorMessage(err))
        setIsSending(false)
      },
    })
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <h2 className="inquiry-form__title">¿Te interesa?</h2>
      <p className="inquiry-form__subtitle">Dejanos tus datos y te contactamos.</p>

      <div className="field">
        <label className="field__label" htmlFor="inquiry-name">Nombre</label>
        <input
          className={`field__input ${errors.name ? 'field__input--error' : ''}`}
          type="text"
          id="inquiry-name"
          value={form.name}
          onChange={(event) => handleInputChange(event, 'name')}
          placeholder="Juana Pérez"
        />
        {errors.name && <p className="field__error">{errors.name}</p>}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="inquiry-email">Email</label>
        <input
          className={`field__input ${errors.email ? 'field__input--error' : ''}`}
          type="email"
          id="inquiry-email"
          value={form.email}
          onChange={(event) => handleInputChange(event, 'email')}
          placeholder="juana@mail.com"
        />
        {errors.email && <p className="field__error">{errors.email}</p>}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="inquiry-message">Mensaje</label>
        <textarea
          className={`field__input ${errors.message ? 'field__input--error' : ''}`}
          id="inquiry-message"
          maxLength={MAX_MESSAGE_LENGTH}
          value={form.message}
          onChange={(event) => handleInputChange(event, 'message')}
          placeholder="Hola, quisiera coordinar una visita."
        />
        <p className="inquiry-form__counter">{form.message.length} / {MAX_MESSAGE_LENGTH}</p>
        {errors.message && <p className="field__error">{errors.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSending}>
        {isSending ? 'Enviando…' : 'Enviar consulta'}
      </Button>
    </form>
  )
}

export default InquiryForm
