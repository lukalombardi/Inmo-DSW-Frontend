import { useEffect, useRef, useState } from 'react'
import Icono from './Icono.jsx'
import { getPropiedades } from '../api/propiedades.js'
import { FILTROS_VACIOS } from '../hooks/useFiltros.js'
import './Filtros.css'

const OPCIONES_OPERACION = [
  { valor: '', texto: 'Todas' },
  { valor: 'VENTA', texto: 'Venta' },
  { valor: 'ALQUILER', texto: 'Alquiler' }
]

function Segmentado({ valor, onChange, className = '' }) {
  return (
    <div className={`segmentado ${className}`} role="group" aria-label="Operación">
      {OPCIONES_OPERACION.map((op) => (
        <button
          key={op.valor || 'todas'}
          type="button"
          aria-pressed={valor === op.valor}
          onClick={() => onChange(op.valor)}
        >
          {op.texto}
        </button>
      ))}
    </div>
  )
}

function SelectFiltro({ etiqueta, valor, opciones, textoTodos, onChange, disabled }) {
  const activo = Boolean(valor)
  return (
    <div className={`select-filtro${activo ? ' activo' : ''}`}>
      <label>
        <span className="select-filtro-etiqueta">{etiqueta}</span>
        <select value={valor} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
          <option value="">{textoTodos}</option>
          {opciones.map((o) => (
            <option key={o.id} value={String(o.id)}>{o.texto}</option>
          ))}
        </select>
      </label>
      {activo ? (
        <button type="button" className="select-filtro-quitar" onClick={() => onChange('')} aria-label={`Quitar filtro de ${etiqueta.toLowerCase()}`}>
          <Icono nombre="cerrar" size={18} />
        </button>
      ) : (
        <Icono nombre="chevronAbajo" size={18} className="select-filtro-chevron" />
      )}
    </div>
  )
}

// Barra horizontal (≥ 640 px).
export function FiltrosBarra({ filtros, setFiltros, zonas, tipos, catalogosOk }) {
  return (
    <div className="filtros-barra tarjeta">
      <SelectFiltro
        etiqueta="Zona"
        valor={filtros.zonaId}
        textoTodos="Todas las zonas"
        opciones={zonas.map((z) => ({ id: z.id, texto: z.nombreZona }))}
        onChange={(zonaId) => setFiltros({ zonaId })}
        disabled={!catalogosOk}
      />
      <SelectFiltro
        etiqueta="Tipo"
        valor={filtros.tipoId}
        textoTodos="Todos los tipos"
        opciones={tipos.map((t) => ({ id: t.id, texto: t.descTipo }))}
        onChange={(tipoId) => setFiltros({ tipoId })}
        disabled={!catalogosOk}
      />
      <Segmentado valor={filtros.operacion} onChange={(operacion) => setFiltros({ operacion })} />
    </div>
  )
}

function GrupoChips({ titulo, opciones, valor, onChange }) {
  return (
    <fieldset className="panel-grupo">
      <legend>{titulo}</legend>
      <div className="panel-chips">
        {opciones.map((o) => (
          <button
            key={o.id || 'todas'}
            type="button"
            className="chip"
            aria-pressed={valor === o.id}
            onClick={() => onChange(o.id)}
          >
            {o.texto}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

// Panel que sube desde abajo (< 640 px). Trabaja sobre un borrador y
// solo aplica los filtros al tocar "Ver N propiedades".
export function FiltrosPanel({ abierto, onCerrar, filtros, setFiltros, zonas, tipos }) {
  const [borrador, setBorrador] = useState(filtros)
  const [cantidad, setCantidad] = useState(null)
  const panelRef = useRef(null)

  // Al abrir, el borrador arranca con los filtros aplicados (solo depende de abrir/cerrar).
  useEffect(() => {
    if (abierto) setBorrador(filtros)
  }, [abierto])

  // Cuántas propiedades coinciden con el borrador (para el botón final).
  useEffect(() => {
    if (!abierto) return
    const control = new AbortController()
    setCantidad(null)
    getPropiedades(borrador, { signal: control.signal })
      .then((lista) => setCantidad(lista.length))
      .catch(() => {})
    return () => control.abort()
  }, [abierto, borrador.zonaId, borrador.tipoId, borrador.operacion])

  // Escape cierra, el fondo no scrollea y el foco entra al panel.
  useEffect(() => {
    if (!abierto) return
    const alTeclear = (e) => e.key === 'Escape' && onCerrar()
    document.addEventListener('keydown', alTeclear)
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.body.style.overflow = overflowPrevio
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  const cambiar = (nuevos) => setBorrador((b) => ({ ...b, ...nuevos }))
  const aplicar = () => {
    setFiltros(borrador)
    onCerrar()
  }

  let textoBoton = 'Ver propiedades'
  if (cantidad === 1) textoBoton = 'Ver 1 propiedad'
  else if (cantidad !== null) textoBoton = `Ver ${cantidad} propiedades`

  return (
    <div className="panel-fondo" onClick={onCerrar}>
      <div
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-titulo"
        tabIndex={-1}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-manija" aria-hidden="true" />
        <div className="panel-cabecera">
          <h2 id="panel-titulo">Filtros</h2>
          <button type="button" className="panel-cerrar" onClick={onCerrar} aria-label="Cerrar filtros">
            <Icono nombre="cerrar" size={24} />
          </button>
        </div>

        <div className="panel-cuerpo">
          <GrupoChips
            titulo="Zona"
            valor={borrador.zonaId}
            opciones={[{ id: '', texto: 'Todas' }, ...zonas.map((z) => ({ id: String(z.id), texto: z.nombreZona }))]}
            onChange={(zonaId) => cambiar({ zonaId })}
          />
          <GrupoChips
            titulo="Tipo"
            valor={borrador.tipoId}
            opciones={[{ id: '', texto: 'Todos' }, ...tipos.map((t) => ({ id: String(t.id), texto: t.descTipo }))]}
            onChange={(tipoId) => cambiar({ tipoId })}
          />
          <fieldset className="panel-grupo">
            <legend>Operación</legend>
            <Segmentado valor={borrador.operacion} onChange={(operacion) => cambiar({ operacion })} className="segmentado-ancho" />
          </fieldset>
        </div>

        <div className="panel-pie">
          <button type="button" className="btn btn-secundario" onClick={() => setBorrador(FILTROS_VACIOS)}>
            Limpiar
          </button>
          <button type="button" className="btn btn-primario" onClick={aplicar} disabled={cantidad === 0}>
            {textoBoton}
          </button>
        </div>
      </div>
    </div>
  )
}
