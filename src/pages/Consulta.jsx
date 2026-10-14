import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Campo from '../components/Campo.jsx'
import Foto from '../components/Foto.jsx'
import Icono from '../components/Icono.jsx'
import PropiedadCard from '../components/PropiedadCard.jsx'
import { Cargando, ErrorCarga, PropiedadNoExiste } from '../components/EstadosCarga.jsx'
import { usePropiedad } from '../hooks/usePropiedad.js'
import { crearConsulta } from '../api/consultas.js'
import { LIMITES_CONSULTA, erroresDelServidor, validarConsulta } from '../utils/validacion.js'
import { formatPrecio } from '../utils/formato.js'
import './Consulta.css'

const MENSAJES_SERVIDOR = {
  nombre: 'Revisá tu nombre (entre 2 y 100 caracteres)',
  email: 'Ingresá un email válido',
  mensaje: `Revisá el mensaje (hasta ${LIMITES_CONSULTA.mensajeMax} caracteres)`
}

function Exito({ propiedad, nombre, email, desde }) {
  const titulo = useRef(null)
  useEffect(() => { titulo.current?.focus() }, [])
  const primerNombre = nombre.trim().split(/\s+/)[0]

  return (
    <div className="consulta-exito tarjeta">
      <span className="consulta-exito-icono"><Icono nombre="check" size={36} strokeWidth={2.25} /></span>
      <h1 tabIndex={-1} ref={titulo}>¡Consulta enviada!</h1>
      <p className="texto-secundario">
        Gracias, {primerNombre}. Te vamos a responder a <strong className="consulta-email">{email.trim()}</strong> en las próximas horas.
      </p>
      <div className="consulta-exito-prop">
        <div className="consulta-exito-foto">
          <Foto foto={propiedad.fotos[0]} alt="" placeholderTexto={null} iconoSize={24} />
        </div>
        <div>
          <p className="consulta-exito-precio">{formatPrecio(propiedad.precio, propiedad.moneda)}</p>
          <p className="texto-secundario">{propiedad.tipo?.descTipo} · {propiedad.zona?.nombreZona}</p>
          <p className="texto-secundario">{propiedad.direccion}</p>
        </div>
      </div>
      <div className="consulta-exito-acciones">
        <Link to={desde ? `/?${desde}` : '/'} className="btn btn-primario">Volver al listado</Link>
        <Link to={`/propiedades/${propiedad.id}`} state={{ desde }} className="btn btn-secundario">Ver la propiedad</Link>
      </div>
    </div>
  )
}

export default function Consulta() {
  const { id } = useParams()
  const desde = useLocation().state?.desde ?? ''
  const { propiedad, estado, error, reintentar } = usePropiedad(id)

  const [valores, setValores] = useState({ nombre: '', email: '', mensaje: '' })
  const [errores, setErrores] = useState({})
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviada, setEnviada] = useState(false)
  const formRef = useRef(null)

  if (estado === 'cargando') return <div className="contenedor"><Cargando /></div>
  if (estado === 'no-existe') return <div className="contenedor consulta"><PropiedadNoExiste /></div>
  if (estado === 'error') return <div className="contenedor"><ErrorCarga mensaje={error} onReintentar={reintentar} /></div>

  if (enviada) {
    return (
      <div className="contenedor consulta">
        <Exito propiedad={propiedad} nombre={valores.nombre} email={valores.email} desde={desde} />
      </div>
    )
  }

  // Después del primer intento, los errores se actualizan mientras escribís.
  const cambiar = (campo) => (e) => {
    const nuevos = { ...valores, [campo]: e.target.value }
    setValores(nuevos)
    if (intentoEnviar) setErrores(validarConsulta(nuevos))
  }

  const alSalir = (campo) => () => {
    if (!valores[campo]) return
    const err = validarConsulta(valores)[campo]
    setErrores((prev) => ({ ...prev, [campo]: err }))
  }

  const enviar = async (e) => {
    e.preventDefault()
    setIntentoEnviar(true)
    setErrorGeneral('')
    const errs = validarConsulta(valores)
    setErrores(errs)
    const primero = ['nombre', 'email', 'mensaje'].find((campo) => errs[campo])
    if (primero) {
      formRef.current?.elements[primero]?.focus()
      return
    }

    setEnviando(true)
    try {
      await crearConsulta({
        nombre: valores.nombre.trim(),
        email: valores.email.trim(),
        mensaje: valores.mensaje.trim(),
        propiedadId: propiedad.id
      })
      setEnviada(true)
      window.scrollTo(0, 0)
    } catch (err) {
      if (err.status === 400 && err.issues.length) {
        setErrores(erroresDelServidor(err.issues, MENSAJES_SERVIDOR))
      } else if (err.status === 404) {
        setErrorGeneral('Esta propiedad ya no está publicada, así que no podemos enviar la consulta.')
      } else if (err.status === 401 || err.status === 403 || err.status === 503) {
        setErrorGeneral('No pudimos enviar tu consulta en este momento. Probá de nuevo más tarde.')
      } else {
        setErrorGeneral(err.message)
      }
    } finally {
      setEnviando(false)
    }
  }

  const largoMensaje = valores.mensaje.trim().length

  return (
    <div className="contenedor consulta">
      <Link to={`/propiedades/${propiedad.id}`} state={{ desde }} className="link-volver">
        <Icono nombre="flechaIzq" size={18} /> Volver a la propiedad
      </Link>

      <div className="consulta-grilla">
        <aside className="consulta-aside">
          <p className="consulta-eyebrow">Estás consultando por</p>
          <PropiedadCard propiedad={propiedad} desde={desde} />
          <ul className="consulta-beneficios tarjeta">
            <li><Icono nombre="reloj" size={20} /> Respondemos en el día</li>
            <li><Icono nombre="enviar" size={20} /> La respuesta llega a tu email</li>
          </ul>
        </aside>

        <form className="consulta-form tarjeta" onSubmit={enviar} noValidate ref={formRef}>
          <h1>Consultá por esta propiedad</h1>
          <p className="texto-secundario consulta-sub">Dejanos tus datos y te respondemos a la brevedad.</p>

          {errorGeneral && (
            <p className="alerta-error" role="alert">
              <Icono nombre="alerta" size={20} /> {errorGeneral}
            </p>
          )}

          <div className="consulta-fila">
            <Campo etiqueta="Nombre" error={errores.nombre}>
              <input
                className="input"
                type="text"
                name="nombre"
                autoComplete="name"
                placeholder="Tu nombre y apellido"
                maxLength={LIMITES_CONSULTA.nombreMax}
                value={valores.nombre}
                onChange={cambiar('nombre')}
                onBlur={alSalir('nombre')}
              />
            </Campo>
            <Campo etiqueta="Email" error={errores.email}>
              <input
                className="input"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="tu@email.com"
                value={valores.email}
                onChange={cambiar('email')}
                onBlur={alSalir('email')}
              />
            </Campo>
          </div>

          <Campo
            etiqueta="Mensaje"
            error={errores.mensaje}
            ayuda={`${largoMensaje} / ${LIMITES_CONSULTA.mensajeMax}`}
          >
            <textarea
              className="input"
              name="mensaje"
              rows={4}
              placeholder={`Hola, me interesa la propiedad de ${propiedad.direccion}…`}
              maxLength={LIMITES_CONSULTA.mensajeMax}
              value={valores.mensaje}
              onChange={cambiar('mensaje')}
              onBlur={alSalir('mensaje')}
            />
          </Campo>

          <div className="consulta-enviar">
            <button type="submit" className="btn btn-primario" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar consulta'}
            </button>
            <p className="texto-secundario">Usamos tus datos solo para responderte.</p>
          </div>
        </form>
      </div>
    </div>
  )
}
