import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Button from '../../shared/button/Button'
import { errorToast } from '../../../shared/notifications'
import { getErrorMessage, getFieldErrors } from '../../../shared/api'
import {
  initialRegisterData,
  registerFieldMessages,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
} from './Register.data'
import { registerUser } from './Register.server'
import './Register.scss'

// Chequeo simple de formato; el back igual vuelve a validar el email
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Devuelve { campo: mensaje } solo con los campos que tienen error
const validateForm = (form) => {
  const errors = {}
  const name = form.name.trim()

  if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH)
    errors.name = registerFieldMessages.name

  if (!EMAIL_PATTERN.test(form.email.trim()))
    errors.email = registerFieldMessages.email

  if (!form.password.trim())
    errors.password = registerFieldMessages.password

  return errors
}

const Register = ({ onSignIn }) => {
  const [form, setForm] = useState(initialRegisterData)
  const [errors, setErrors] = useState({})
  const [isSending, setIsSending] = useState(false)

  // Referencias a los inputs para hacerle foco al primero que tenga error
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const navigate = useNavigate()

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

  // Foco al primer campo con error, en el orden del formulario
  const focusFirstError = (fieldErrors) => {
    if (fieldErrors.name) nameRef.current.focus()
    else if (fieldErrors.email) emailRef.current.focus()
    else if (fieldErrors.password) passwordRef.current.focus()
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const fieldErrors = validateForm(form)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      focusFirstError(fieldErrors)
      return
    }

    setIsSending(true)
    registerUser(form, {
      onSuccess: (data) => {
        // El back ya devuelve { token, user }: queda logueado igual que con el login
        onSignIn(data)
        navigate('/properties', { replace: true })
      },
      onError: (err) => {
        console.error('registerUser failed:', err)
        const backErrors = getFieldErrors(err, registerFieldMessages)
        setErrors(backErrors)
        focusFirstError(backErrors)
        // 409 "email ya registrado" u otro error del back
        errorToast(getErrorMessage(err))
        setIsSending(false)
      },
    })
  }

  return (
    <div className="register">
      <form className="register__card" onSubmit={handleSubmit} noValidate>
        <header className="register__header">
          <p className="register__eyebrow">Creá tu cuenta</p>
          <h1 className="register__title">Registrarse</h1>
          <p className="register__subtitle">Guardá las propiedades que te interesan y volvé a verlas cuando quieras.</p>
        </header>

        <div className="field">
          <label className="field__label" htmlFor="register-name">Nombre</label>
          <input
            ref={nameRef}
            className={`field__input ${errors.name ? 'field__input--error' : ''}`}
            type="text"
            id="register-name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => handleInputChange(event, 'name')}
          />
          {errors.name && <p className="field__error">{errors.name}</p>}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="register-email">Email</label>
          <input
            ref={emailRef}
            className={`field__input ${errors.email ? 'field__input--error' : ''}`}
            type="email"
            id="register-email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => handleInputChange(event, 'email')}
            placeholder="nombre@mail.com"
          />
          {errors.email && <p className="field__error">{errors.email}</p>}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="register-password">Contraseña</label>
          <input
            ref={passwordRef}
            className={`field__input ${errors.password ? 'field__input--error' : ''}`}
            type="password"
            id="register-password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => handleInputChange(event, 'password')}
          />
          {errors.password && <p className="field__error">{errors.password}</p>}
        </div>

        <Button type="submit" size="lg" disabled={isSending}>
          {isSending ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>

        <p className="register__switch">
          ¿Ya tenés cuenta? <Link to="/login" className="register__switch-link">Ingresá</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
