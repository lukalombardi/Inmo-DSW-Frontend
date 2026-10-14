import { Link } from 'react-router-dom'

export default function NoEncontrado() {
  return (
    <section className="contenedor" style={{ paddingTop: 'var(--esp-8)', textAlign: 'center' }}>
      <h1 style={{ fontSize: 'var(--fs-hero)' }}>No encontramos esta página</h1>
      <p className="texto-secundario" style={{ margin: 'var(--esp-2) 0 var(--esp-4)' }}>
        Puede que el enlace esté mal escrito o que la página ya no exista.
      </p>
      <Link to="/" className="btn btn-primario">Volver al listado</Link>
    </section>
  )
}
