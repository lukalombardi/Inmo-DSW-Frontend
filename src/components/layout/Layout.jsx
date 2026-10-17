import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import Button from '../shared/button/Button'
import './Layout.scss'

// Header y footer comunes. <Outlet /> muestra la pantalla de la ruta hija.
const Layout = ({ isLoggedIn, user, onSignOut }) => {
  const navigate = useNavigate()

  const handleSignOut = () => {
    onSignOut()
    navigate('/login', { replace: true })
  }

  const getLinkClass = ({ isActive }) =>
    isActive ? 'layout__link layout__link--active' : 'layout__link'

  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__header-inner">
          <Link to="/properties" className="layout__brand">
            <img src="/logo.svg" alt="" width="36" height="36" />
            IAL Propiedades
          </Link>

          <nav className="layout__nav">
            <NavLink to="/properties" end className={getLinkClass}>Propiedades</NavLink>
            {isLoggedIn ? (
              <>
                <NavLink to="/admin" className={getLinkClass}>Panel</NavLink>
                <span className="layout__user">{user?.name}</span>
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  Salir
                </Button>
              </>
            ) : (
              <NavLink to="/login" className={getLinkClass}>Ingresar</NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="layout__main">
        <Outlet />
      </main>

      <footer className="layout__footer">
        <p>IAL Propiedades · Rosario</p>
      </footer>
    </div>
  )
}

export default Layout
