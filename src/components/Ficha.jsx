import Icono from './Icono.jsx'
import { formatMetros, siNo } from '../utils/formato.js'
import './Ficha.css'

// Escritorio: cuatro datos en fila. Celular: lista con el valor a la derecha.
export default function Ficha({ propiedad }) {
  const { cantHabitaciones, metrosCuadrados, cochera, aptoCredito } = propiedad
  const items = [
    { icono: 'cama', valor: cantHabitaciones, etiqueta: cantHabitaciones === 1 ? 'Habitación' : 'Habitaciones' },
    { icono: 'superficie', valor: formatMetros(metrosCuadrados), etiqueta: 'Superficie' },
    { icono: 'auto', valor: siNo(cochera), etiqueta: 'Cochera' },
    { icono: 'credito', valor: siNo(aptoCredito), etiqueta: 'Apto crédito' }
  ]

  return (
    <dl className="ficha tarjeta">
      {items.map((it) => (
        <div className="ficha-item" key={it.etiqueta}>
          <Icono nombre={it.icono} size={24} className="ficha-icono" />
          <dt>{it.etiqueta}</dt>
          <dd>{it.valor}</dd>
        </div>
      ))}
    </dl>
  )
}
