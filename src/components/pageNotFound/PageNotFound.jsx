import { useNavigate } from 'react-router'
import Button from '../shared/button/Button'
import './PageNotFound.scss'

const PageNotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="page-not-found">
      <h2 className="page-not-found__title">¡Uy! No encontramos la página que buscás</h2>
      <p className="page-not-found__text">Puede que el link esté mal o que la página ya no exista.</p>
      <Button onClick={() => navigate('/properties')}>Volver a las propiedades</Button>
    </div>
  )
}

export default PageNotFound
