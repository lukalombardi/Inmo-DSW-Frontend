import { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '../shared/button/Button'
import { errorToast, infoToast } from '../../shared/notifications'
import { getErrorMessage } from '../../shared/api'
import { addLike, removeLike } from './LikeButton.server'
import './LikeButton.scss'

// Con un id fijo, si tocan varios corazones seguidos no se apilan los carteles
const SIGN_UP_TOAST_ID = 'like-sign-up'

// Contenido del toast cuando no hay sesión. react-toastify le pasa closeToast.
const SignUpPrompt = ({ closeToast, onGoToRegister }) => (
  <div className="like-button__prompt">
    <p>Para guardar propiedades, creá una cuenta.</p>
    <Button
      size="sm"
      onClick={() => {
        closeToast()
        onGoToRegister()
      }}
    >
      Crear cuenta
    </Button>
  </div>
)

// isLiked viene de App (el Set de likes). Al clickear avisamos con onLikedChange
// antes de que conteste el back (actualización optimista) y lo revertimos si falla.
const LikeButton = ({ property, isLiked, token, onLikedChange, className = '' }) => {
  const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate()

  const handleClick = (event) => {
    // El botón está arriba de la tarjeta, que es un link: que no navegue al detalle
    event.preventDefault()
    event.stopPropagation()

    if (!token) {
      infoToast(
        ({ closeToast }) => (
          <SignUpPrompt closeToast={closeToast} onGoToRegister={() => navigate('/register')} />
        ),
        { toastId: SIGN_UP_TOAST_ID },
      )
      return
    }

    // Esperamos a que termine el pedido anterior antes de mandar otro
    if (isPending) return

    const nextLiked = !isLiked
    onLikedChange(property.id, nextLiked)
    setIsPending(true)

    const request = nextLiked ? addLike : removeLike
    request(property.id, token, {
      onSuccess: () => setIsPending(false),
      onError: (err) => {
        console.error(`${nextLiked ? 'addLike' : 'removeLike'} failed:`, err)
        onLikedChange(property.id, !nextLiked)
        errorToast(getErrorMessage(err))
        setIsPending(false)
      },
    })
  }

  const label = isLiked
    ? `Quitar ${property.address} de favoritos`
    : `Guardar ${property.address} en favoritos`

  return (
    <button
      type="button"
      className={`like-button ${isLiked ? 'like-button--active' : ''} ${className}`}
      aria-pressed={isLiked}
      aria-label={label}
      title={isLiked ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      onClick={handleClick}
    >
      <svg className="like-button__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-9.3-9.4C1.5 7.8 3.6 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.5 3.3 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z" />
      </svg>
    </button>
  )
}

export default LikeButton
