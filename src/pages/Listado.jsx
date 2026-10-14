import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PropiedadCard from '../components/PropiedadCard.jsx'
import EstadoVacio from '../components/EstadoVacio.jsx'
import Icono from '../components/Icono.jsx'
import { FiltrosBarra, FiltrosPanel } from '../components/Filtros.jsx'
import { getPropiedades } from '../api/propiedades.js'
import { getZonas, getTipos } from '../api/catalogos.js'
import { useFiltros } from '../hooks/useFiltros.js'
import './Listado.css'

// "Departamento" → "Departamentos", "Local" → "Locales", "PH" → "PH"
function plural(palabra) {
  if (palabra === palabra.toUpperCase()) return palabra
  if (/[aeiouáéó]$/i.test(palabra)) return `${palabra}s`
  if (/ón$/.test(palabra)) return `${palabra.slice(0, -2)}ones`
  return `${palabra}es`
}

function resumenFiltros(filtros, zona, tipo) {
  // "Departamentos en venta en Centro" · sin tipo: "En todas las zonas"
  const operacion = { VENTA: 'en venta', ALQUILER: 'en alquiler' }[filtros.operacion]
  const donde = zona ? `en ${zona.nombreZona}` : 'en todas las zonas'
  const texto = [tipo && plural(tipo.descTipo), operacion, donde].filter(Boolean).join(' ')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function Esqueleto() {
  return (
    <div className="prop-card tarjeta prop-card-esqueleto" aria-hidden="true">
      <div className="prop-card-foto" />
      <div className="prop-card-cuerpo">
        <div className="linea" style={{ width: '55%', height: 24 }} />
        <div className="linea" style={{ width: '70%', marginTop: 8 }} />
        <div className="linea" style={{ width: '40%', marginTop: 8 }} />
      </div>
    </div>
  )
}

export default function Listado() {
  const { filtros, setFiltros, limpiar, cantidadActivos, search } = useFiltros()
  const [zonas, setZonas] = useState([])
  const [tipos, setTipos] = useState([])
  const [catalogosOk, setCatalogosOk] = useState(false)
  const [propiedades, setPropiedades] = useState([])
  const [estado, setEstado] = useState('cargando') // cargando | listo | error
  const [error, setError] = useState('')
  const [reintento, setReintento] = useState(0)
  const [panelAbierto, setPanelAbierto] = useState(false)

  useEffect(() => {
    const control = new AbortController()
    Promise.all([getZonas({ signal: control.signal }), getTipos({ signal: control.signal })])
      .then(([z, t]) => {
        setZonas(z)
        setTipos(t)
        setCatalogosOk(true)
      })
      .catch(() => {})
    return () => control.abort()
  }, [reintento])

  useEffect(() => {
    const control = new AbortController()
    setEstado('cargando')
    getPropiedades(
      { zonaId: filtros.zonaId, tipoId: filtros.tipoId, operacion: filtros.operacion },
      { signal: control.signal }
    )
      .then((lista) => {
        setPropiedades(lista)
        setEstado('listo')
      })
      .catch((e) => {
        if (e.name === 'AbortError') return
        setError(e.message)
        setEstado('error')
      })
    return () => control.abort()
  }, [filtros.zonaId, filtros.tipoId, filtros.operacion, reintento])

  const cerrarPanel = useCallback(() => setPanelAbierto(false), [])

  const zona = zonas.find((z) => String(z.id) === filtros.zonaId)
  const tipo = tipos.find((t) => String(t.id) === filtros.tipoId)
  const hayFiltros = cantidadActivos > 0
  const cantidad = propiedades.length

  const chipsActivos = [
    zona && { clave: 'zonaId', texto: zona.nombreZona },
    tipo && { clave: 'tipoId', texto: tipo.descTipo },
    filtros.operacion && { clave: 'operacion', texto: filtros.operacion === 'VENTA' ? 'Venta' : 'Alquiler' }
  ].filter(Boolean)

  return (
    <div className="listado contenedor">
      <header className="listado-hero">
        <h1>Buscá tu próximo hogar</h1>
        <p className="texto-secundario">
          Casas, departamentos y más en Rosario<span className="solo-escritorio"> y alrededores</span>.
        </p>
      </header>

      <div className="solo-barra">
        <FiltrosBarra filtros={filtros} setFiltros={setFiltros} zonas={zonas} tipos={tipos} catalogosOk={catalogosOk} />
      </div>

      <div className="listado-filtros-cel solo-celular">
        <button type="button" className="btn btn-primario btn-filtros" onClick={() => setPanelAbierto(true)} disabled={!catalogosOk}>
          <Icono nombre="filtros" size={18} />
          Filtros{hayFiltros ? ` · ${cantidadActivos}` : ''}
        </button>
        {chipsActivos.map((c) => (
          <button
            key={c.clave}
            type="button"
            className="chip chip-quitar"
            onClick={() => setFiltros({ [c.clave]: '' })}
            aria-label={`Quitar filtro ${c.texto}`}
          >
            {c.texto} <Icono nombre="cerrar" size={14} strokeWidth={2.25} />
          </button>
        ))}
      </div>

      <div className="listado-resumen" aria-live="polite">
        {estado === 'listo' && (
          <>
            <p>
              <strong>{cantidad === 1 ? '1 propiedad' : `${cantidad} propiedades`}</strong>
              <span className="texto-secundario solo-barra-inline"> · {resumenFiltros(filtros, zona, tipo)}</span>
            </p>
            {hayFiltros && cantidad > 0 && (
              <button type="button" className="link-limpiar solo-barra-inline" onClick={limpiar}>
                Limpiar filtros
              </button>
            )}
          </>
        )}
        {estado === 'cargando' && <p className="texto-secundario">Buscando propiedades…</p>}
      </div>

      {estado === 'error' && (
        <div className="listado-error">
          <p className="alerta-error">
            <Icono nombre="alerta" size={20} /> {error}
          </p>
          <button type="button" className="btn btn-secundario" onClick={() => setReintento((n) => n + 1)}>
            Reintentar
          </button>
        </div>
      )}

      {estado === 'cargando' && (
        <div className="grilla">
          {[0, 1, 2].map((i) => <Esqueleto key={i} />)}
        </div>
      )}

      {estado === 'listo' && cantidad > 0 && (
        <div className="grilla">
          {propiedades.map((p) => (
            <PropiedadCard key={p.id} propiedad={p} desde={search} />
          ))}
        </div>
      )}

      {estado === 'listo' && cantidad === 0 && hayFiltros && (
        <EstadoVacio
          titulo="No encontramos propiedades con esos filtros"
          texto="Probá con otra zona o tipo de propiedad, o quitá algún filtro."
        >
          <button type="button" className="btn btn-primario" onClick={limpiar}>Limpiar filtros</button>
          <Link to="/" className="btn btn-secundario">Ver todas</Link>
        </EstadoVacio>
      )}

      {estado === 'listo' && cantidad === 0 && !hayFiltros && (
        <EstadoVacio
          icono="casa"
          titulo="Todavía no hay propiedades publicadas"
          texto="Volvé a visitarnos en unos días: estamos sumando nuevas propiedades."
        />
      )}

      <FiltrosPanel
        abierto={panelAbierto}
        onCerrar={cerrarPanel}
        filtros={filtros}
        setFiltros={setFiltros}
        zonas={zonas}
        tipos={tipos}
      />
    </div>
  )
}
