import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '../../shared/button/Button'
import { errorToast } from '../../../shared/notifications'
import { getErrorMessage } from '../../../shared/api'
import { initialLoginData, initialLoginErrors } from './Login.data'
import { loginUser } from './Login.server'
import './Login.scss'

const Login = ({ onSignIn }) => {
  const [form, setForm] = useState(initialLoginData)
  const [errors, setErrors] = useState(initialLoginErrors)
  const [isSending, setIsSending] = useState(false)

  // Referencias a los inputs para poder hacerles foco cuando tienen error
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const navigate = useNavigate()

  const handleInputChange = (event, target) => {
    setForm((prevForm) => ({
      ...prevForm,
      [target]: event.target.value,
    }))

    setErrors((prevErrors) => ({
      ...prevErrors,
      [target]: false,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: true }))
      emailRef.current.focus()
      return
    }

    if (!form.password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: true }))
      passwordRef.current.focus()
      return
    }

    setIsSending(true)
    loginUser(form, {
      onSuccess: (data) => {
        onSignIn(data)
        navigate('/admin', { replace: true })
      },
      onError: (err) => {
        console.error('loginUser failed:', err)
        // El back responde 401 "Email o contraseña incorrectos"
        errorToast(getErrorMessage(err))
        setIsSending(false)
      },
    })
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={handleSubmit}>
        <header className="login__header">
          <p className="login__eyebrow">Acceso del personal</p>
          <h1 className="login__title">Ingresar</h1>
          <p className="login__subtitle">Usá tu email y contraseña de IAL Propiedades.</p>
        </header>

        <div className="field">
          <label className="field__label" htmlFor="email">Email</label>
          <input
            ref={emailRef}
            className={`field__input ${errors.email ? 'field__input--error' : ''}`}
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={(event) => handleInputChange(event, 'email')}
            placeholder="admin@inmo.com"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="password">Contraseña</label>
          <input
            ref={passwordRef}
            className={`field__input ${errors.password ? 'field__input--error' : ''}`}
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={(event) => handleInputChange(event, 'password')}
            placeholder="••••••••"
          />
        </div>

        {(errors.email || errors.password) && (
          <p className="login__hint">Tenés que completar los dos campos para ingresar.</p>
        )}

        <Button type="submit" size="lg" disabled={isSending}>
          {isSending ? 'Ingresando…' : 'Ingresar'}
        </Button>
      </form>
    </div>
  )
}

export default Login
