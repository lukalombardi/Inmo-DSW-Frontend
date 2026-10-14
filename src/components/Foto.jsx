import { useState } from 'react'
import FotoPlaceholder from './FotoPlaceholder.jsx'
import { urlFoto } from '../utils/formato.js'

// <img> que cae al placeholder si no hay foto o si falla la carga.
export default function Foto({ foto, alt = '', placeholderTexto, iconoSize, ...props }) {
  const [fallo, setFallo] = useState(false)
  const src = urlFoto(foto?.url)

  if (!src || fallo) {
    return <FotoPlaceholder texto={placeholderTexto} iconoSize={iconoSize} />
  }
  return <img src={src} alt={alt} onError={() => setFallo(true)} {...props} />
}
