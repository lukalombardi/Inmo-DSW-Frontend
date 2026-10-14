import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import './Header.css'

export default function Header() {
  const { usuario, salir } = useAuth()

  return (
    <header className="header">
      <div className="contenedor header-interior">
        <Link to="/" className="header-marca">
          <Logo size={40} />
          <span>IAL Propiedades</span>
        </Link>
        {usuario ? (
          <div className="header-sesion">
            <span className="header-usuario">
              <span className="header-nombre">{usuario.nombre}</span>
              <span className="header-rol">{usuario.rol === 'ADMIN' ? 'Administrador' : 'Operador'}</span>
            </span>
            <button type="button" className="header-boton" onClick={salir}>Salir</button>
          </div>
        ) : (
          <Link to="/ingresar" className="header-boton">Ingresar</Link>
        )}
      </div>
    </header>
  )
}
