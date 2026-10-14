import Logo from './Logo.jsx'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor footer-interior">
        <div className="footer-marca">
          <Logo size={32} />
          <span>IAL Propiedades</span>
        </div>
        <p>Rosario, Argentina · © {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
