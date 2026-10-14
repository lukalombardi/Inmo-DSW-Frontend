import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Listado from './pages/Listado.jsx'
import Detalle from './pages/Detalle.jsx'
import Consulta from './pages/Consulta.jsx'
import Login from './pages/Login.jsx'
import NoEncontrado from './pages/NoEncontrado.jsx'

// Al cambiar de pantalla, arriba de todo (los cambios de filtros no cuentan).
function ScrollArriba() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollArriba />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Listado />} />
          <Route path="propiedades/:id" element={<Detalle />} />
          <Route path="propiedades/:id/consulta" element={<Consulta />} />
          <Route path="*" element={<NoEncontrado />} />
        </Route>
        <Route path="ingresar" element={<Login />} />
      </Routes>
    </>
  )
}
