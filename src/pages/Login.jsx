import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Campo from '../components/Campo.jsx'
import Icono from '../components/Icono.jsx'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { validarLogin } from '../utils/validacion.js'
import './Login.css'

const ERROR_CREDENCIALES = 'Email o contraseña incorrectos'

export default function Login() {
  const { usuario, ingresar } = useAuth()
  const navigate = useNavigate()
  const [valores, setValores] = useState({ email: '', password: '' })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [mostrar, setMostrar] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const alertaRef = useRef(null)

  useEffect(() => {
    document.title = 'Ingresar · IAL Propiedades'
    return () => { document.title = 'IAL Propiedades · Rosario' }
  }, [])

  useEffect(() => {
    if (errorGeneral) alertaRef.current?.focus()
  }, [errorGeneral])

  const cambiar = (campo) => (e) => {
    setValores((v) => ({ ...v, [campo]: e.target.value }))
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }))
  }

  const enviar = async (e) => {
    e.preventDefault()
    setErrorGeneral('')
    const errs = validarLogin(valores)
    setErrores(errs)
    if (Object.keys(errs).length) return

    setEnviando(true)
    try {
      await ingresar(valores.email.trim(), valores.password)
      navigate('/', { replace: true })
    } catch (err) {
      // 401 (credenciales) y 400 (Zod) se muestran igual, para no dar pistas.
      if (err.status === 401 || err.status === 400) {
        setErrorGeneral(ERROR_CREDENCIALES)
        setValores((v) => ({ ...v, password: '' }))
      } else {
        setErrorGeneral(err.status === 0 ? err.message : 'No pudimos iniciar sesión. Probá de nuevo en un rato.')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login">
      <section className="login-marca">
        <Link to="/" className="login-logo">
          <Logo size={48} />
          <span>IAL Propiedades</span>
        </Link>
        <div className="login-marca-texto">
          <p className="login-titulo-marca">Panel del personal</p>
          <p>Acceso para administradores y operadores de la inmobiliaria.</p>
        </div>
        <p className="login-lugar">Rosario, Argentina</p>
        <span className="login-circulo" aria-hidden="true" />
      </section>

      <section className="login-lado">
        <Link to="/" className="link-volver login-volver">
          <Icono nombre="flechaIzq" size={18} /> Volver al sitio
        </Link>

        {usuario ? (
          <div className="login-card tarjeta">
            <h1>Ya ingresaste</h1>
            <p className="texto-secundario">
              Estás conectado como <strong>{usuario.nombre}</strong> ({usuario.rol === 'ADMIN' ? 'administrador' : 'operador'}).
            </p>
            <Link to="/" className="btn btn-primario btn-bloque">Ir al sitio</Link>
          </div>
        ) : (
          <form className="login-card tarjeta" onSubmit={enviar} noValidate>
            <h1>Ingresar</h1>
            <p className="texto-secundario login-sub">Usá tu email y contraseña de la inmobiliaria.</p>

            {errorGeneral && (
              <p className="alerta-error" role="alert" tabIndex={-1} ref={alertaRef}>
                <Icono nombre="alerta" size={20} /> {errorGeneral}
              </p>
            )}

            <Campo etiqueta="Email" error={errores.email}>
              <input
                className="input"
                type="email"
                name="email"
                autoComplete="username"
                inputMode="email"
                placeholder="nombre@ialpropiedades.com.ar"
                value={valores.email}
                onChange={cambiar('email')}
              />
            </Campo>

            <Campo
              etiqueta="Contraseña"
              error={errores.password}
              accion={
                <button
                  type="button"
                  className="input-accion"
                  onClick={() => setMostrar((m) => !m)}
                  aria-pressed={mostrar}
                >
                  {mostrar ? 'Ocultar' : 'Mostrar'}
                </button>
              }
            >
              <input
                className="input"
                type={mostrar ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={valores.password}
                onChange={cambiar('password')}
              />
            </Campo>

            <button type="submit" className="btn btn-primario btn-bloque" disabled={enviando}>
              {enviando ? 'Ingresando…' : 'Ingresar'}
            </button>
            <p className="texto-secundario login-ayuda">¿Problemas para entrar? Hablá con un administrador.</p>
          </form>
        )}
      </section>
    </div>
  )
}
