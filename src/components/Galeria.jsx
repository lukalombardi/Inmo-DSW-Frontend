import { useRef, useState } from 'react'
import Foto from './Foto.jsx'
import FotoPlaceholder from './FotoPlaceholder.jsx'
import Icono from './Icono.jsx'
import './Galeria.css'

const MINIATURAS = 3

// Escritorio: foto grande + miniaturas al costado. Celular: carrusel con swipe.
// 0 fotos → placeholder · 1 foto → sin miniaturas ni contador.
export default function Galeria({ fotos = [], alt, botonVolver }) {
  const [activa, setActiva] = useState(0)
  const pistaRef = useRef(null)
  const total = fotos.length

  if (total === 0) {
    return (
      <div className="galeria galeria-vacia">
        <div className="galeria-principal">
          <FotoPlaceholder iconoSize={64} />
          {botonVolver}
        </div>
      </div>
    )
  }

  const ir = (indice) => setActiva((indice + total) % total)

  // Celular: el índice sale de cuánto se desplazó la pista.
  const alDeslizar = () => {
    const pista = pistaRef.current
    if (!pista) return
    const ancho = pista.firstElementChild?.offsetWidth || pista.clientWidth
    setActiva(Math.min(total - 1, Math.round(pista.scrollLeft / ancho)))
  }

  const alTeclear = (e) => {
    if (e.key === 'ArrowRight') ir(activa + 1)
    if (e.key === 'ArrowLeft') ir(activa - 1)
  }

  const miniaturas = fotos.slice(1, 1 + MINIATURAS)
  // Fotos que quedan "detrás" de la última miniatura (incluida ella): 8 fotos → "+5 fotos"
  const restantes = total - MINIATURAS

  return (
    <div className={`galeria${total > 1 ? ' con-miniaturas' : ''}`}>
      {/* ---------- Escritorio ---------- */}
      <div className="galeria-escritorio">
        <div
          className="galeria-principal"
          tabIndex={total > 1 ? 0 : undefined}
          onKeyDown={total > 1 ? alTeclear : undefined}
          aria-label={total > 1 ? 'Galería de fotos: usá las flechas para navegar' : undefined}
        >
          <Foto key={fotos[activa].id} foto={fotos[activa]} alt={`${alt} — foto ${activa + 1}`} />
          {total > 1 && (
            <>
              <button type="button" className="galeria-flecha izq" onClick={() => ir(activa - 1)} aria-label="Foto anterior">
                <Icono nombre="chevronIzq" size={24} />
              </button>
              <button type="button" className="galeria-flecha der" onClick={() => ir(activa + 1)} aria-label="Foto siguiente">
                <Icono nombre="chevronDer" size={24} />
              </button>
              <span className="galeria-contador">{activa + 1} / {total}</span>
            </>
          )}
        </div>

        {total > 1 && (
          <ul className="galeria-miniaturas">
            {miniaturas.map((foto, i) => {
              const indice = i + 1
              const esUltima = i === MINIATURAS - 1 && restantes > 1
              return (
                <li key={foto.id}>
                  <button
                    type="button"
                    className="galeria-miniatura"
                    aria-current={activa === indice}
                    onClick={() => ir(indice)}
                    aria-label={esUltima ? `Ver más fotos (${restantes} más)` : `Ver foto ${indice + 1}`}
                  >
                    <Foto foto={foto} alt="" loading="lazy" placeholderTexto={null} iconoSize={24} />
                    {esUltima && <span className="galeria-mas">+{restantes} fotos</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* ---------- Celular ---------- */}
      <div className="galeria-cel">
        <div className="galeria-pista" ref={pistaRef} onScroll={alDeslizar}>
          {fotos.map((foto, i) => (
            <div className="galeria-slide" key={foto.id}>
              <Foto foto={foto} alt={`${alt} — foto ${i + 1}`} loading={i === 0 ? undefined : 'lazy'} />
            </div>
          ))}
        </div>
        {botonVolver}
        {total > 1 && (
          <>
            <span className="galeria-contador arriba">{activa + 1} / {total}</span>
            <div className="galeria-puntos" aria-hidden="true">
              {fotos.slice(0, 8).map((f, i) => (
                <span key={f.id} className={i === Math.min(activa, 7) ? 'activo' : ''} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
