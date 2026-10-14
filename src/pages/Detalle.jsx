import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Galeria from '../components/Galeria.jsx'
import Ficha from '../components/Ficha.jsx'
import Mapa from '../components/Mapa.jsx'
import Foto from '../components/Foto.jsx'
import Icono from '../components/Icono.jsx'
import { Cargando, ErrorCarga, PropiedadNoExiste } from '../components/EstadosCarga.jsx'
import { usePropiedad } from '../hooks/usePropiedad.js'
import { formatOperacion, formatPrecio } from '../utils/formato.js'
import './Detalle.css'

// true mientras el elemento se ve en pantalla (para el aside compacto).
function useVisible(ref, activo) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    if (!activo || !ref.current) return
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '-64px 0px 0px 0px' })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, activo])
  return visible
}

export default function Detalle() {
  const { id } = useParams()
  const location = useLocation()
  const desde = location.state?.desde ?? ''
  const urlListado = desde ? `/?${desde}` : '/'
  const { propiedad, estado, error, reintentar } = usePropiedad(id)
  const precioRef = useRef(null)
  const precioVisible = useVisible(precioRef, estado === 'listo')

  useEffect(() => {
    if (propiedad) document.title = `${propiedad.direccion} · IAL Propiedades`
    return () => { document.title = 'IAL Propiedades · Rosario' }
  }, [propiedad])

  if (estado === 'cargando') return <div className="contenedor"><Cargando texto="Cargando la propiedad…" /></div>
  if (estado === 'no-existe') return <div className="contenedor detalle"><PropiedadNoExiste /></div>
  if (estado === 'error') return <div className="contenedor"><ErrorCarga mensaje={error} onReintentar={reintentar} /></div>

  const { fotos, operacion, tipo, zona, precio, moneda, direccion, descripcion, latitud, longitud } = propiedad
  const precioTexto = formatPrecio(precio, moneda)
  const tieneMapa = latitud != null && longitud != null && latitud !== '' && longitud !== ''
  const urlConsulta = `/propiedades/${propiedad.id}/consulta`

  return (
    <div className="contenedor detalle">
      <Link to={urlListado} className="link-volver detalle-volver">
        <Icono nombre="flechaIzq" size={18} /> Volver al listado
      </Link>

      <Galeria
        fotos={fotos}
        alt={direccion}
        botonVolver={
          <Link to={urlListado} className="galeria-boton-volver" aria-label="Volver al listado">
            <Icono nombre="chevronIzq" size={24} />
          </Link>
        }
      />

      <div className="detalle-cuerpo">
        <div className="detalle-info">
          <div className="detalle-encabezado">
            <p className="detalle-etiquetas">
              <span className="badge">{formatOperacion(operacion)}</span>
              <span>{tipo?.descTipo} · {zona?.nombreZona}</span>
            </p>
            <h1 className="detalle-precio" ref={precioRef}>{precioTexto}</h1>
            <p className="detalle-direccion">
              <Icono nombre="pin" size={20} /> {direccion}, Rosario
            </p>
          </div>

          <Ficha propiedad={propiedad} />

          <section className="detalle-seccion">
            <h2>Descripción</h2>
            <p className="detalle-descripcion">{descripcion}</p>
          </section>

          {tieneMapa && (
            <section className="detalle-seccion">
              <h2>Ubicación</h2>
              <Mapa latitud={latitud} longitud={longitud} direccion={direccion} />
            </section>
          )}
        </div>

        <aside className="detalle-aside tarjeta">
          {precioVisible ? (
            <>
              <h2>Consultá por esta propiedad</h2>
              <p className="texto-secundario">Te respondemos en el día.</p>
              <Link to={urlConsulta} state={{ desde }} className="btn btn-primario btn-bloque">Consultar</Link>
            </>
          ) : (
            <>
              <div className="detalle-aside-mini">
                <div className="detalle-aside-foto">
                  <Foto foto={fotos[0]} alt="" placeholderTexto={null} iconoSize={24} />
                </div>
                <div>
                  <p className="detalle-aside-precio">{precioTexto}</p>
                  <p className="texto-secundario">{direccion}</p>
                </div>
              </div>
              <Link to={urlConsulta} state={{ desde }} className="btn btn-primario btn-bloque">Consultar</Link>
              <p className="texto-secundario detalle-aside-nota">Te respondemos en el día.</p>
            </>
          )}
        </aside>
      </div>

      {/* Celular: precio y Consultar siempre a mano */}
      <div className="detalle-barra">
        <p className="detalle-barra-precio">{precioTexto}</p>
        <Link to={urlConsulta} state={{ desde }} className="btn btn-primario">Consultar</Link>
      </div>
    </div>
  )
}
