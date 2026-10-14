import Icono from './Icono.jsx'
import './Mapa.css'

const DELTA = 0.006 // ~600 m alrededor del punto

// Mapa embebido de OpenStreetMap (sin librerías). Solo se usa si hay latitud y longitud.
export default function Mapa({ latitud, longitud, direccion }) {
  const lat = Number(latitud)
  const lng = Number(longitud)
  const bbox = [lng - DELTA, lat - DELTA, lng + DELTA, lat + DELTA].join(',')
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
  const enlace = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`

  return (
    <figure className="mapa">
      <div className="mapa-marco">
        <iframe title={`Mapa de ${direccion}`} src={src} loading="lazy" />
      </div>
      <figcaption>
        <span>
          <Icono nombre="pin" size={18} /> {direccion}
        </span>
        <a href={enlace} target="_blank" rel="noreferrer">Ver mapa más grande</a>
      </figcaption>
    </figure>
  )
}
