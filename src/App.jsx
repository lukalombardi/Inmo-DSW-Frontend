import { useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Layout from './components/layout/Layout'
import PropertyList from './components/propertyList/PropertyList'
import PropertyDetails from './components/propertyDetails/PropertyDetails'
import Login from './components/auth/login/Login'
import Register from './components/auth/register/Register'
import Protected from './components/auth/protected/Protected'
import Admin from './components/admin/Admin'
import Favorites from './components/favorites/Favorites'
import PageNotFound from './components/pageNotFound/PageNotFound'
import { getMyLikes } from './components/favorites/Favorites.server'
import { STAFF_ROLES } from './shared/roles'
import './App.scss'

const App = () => {
  // Sesión: vive solo en memoria, si se recarga la página hay que volver a ingresar
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)

  // Ids de las propiedades que marcó el usuario. Sin sesión queda vacío.
  const [likedIds, setLikedIds] = useState(() => new Set())

  // Token de la sesión actual, para descartar la respuesta de /likes/mine
  // si el usuario salió (o entró con otra cuenta) antes de que llegara
  const currentTokenRef = useRef('')

  // data = respuesta de POST /auth/login o /auth/register: { token, user }
  const handleSignIn = (data) => {
    setToken(data.token)
    setUser(data.user)
    setIsLoggedIn(true)
    setLikedIds(new Set())
    currentTokenRef.current = data.token

    // Pedimos una sola vez qué propiedades marcó (el back devuelve las propiedades)
    getMyLikes(data.token, {
      onSuccess: (properties) => {
        if (currentTokenRef.current !== data.token) return
        setLikedIds(new Set(properties.map((property) => property.id)))
      },
      onError: (err) => console.error('getMyLikes failed:', err),
    })
  }

  const handleSignOut = () => {
    setToken('')
    setUser(null)
    setIsLoggedIn(false)
    setLikedIds(new Set())
    currentTokenRef.current = ''
  }

  // Lo llama el LikeButton: antes de que conteste el back y otra vez si hay que revertir
  const handleLikedChange = (propertyId, isLiked) => {
    setLikedIds((prevIds) => {
      const nextIds = new Set(prevIds)
      if (isLiked) nextIds.add(propertyId)
      else nextIds.delete(propertyId)
      return nextIds
    })
  }

  const likeProps = { likedIds, token, onLikedChange: handleLikedChange }

  return (
    <BrowserRouter>
      <div className="app">
        <ToastContainer />
        <Routes>
          <Route element={<Layout isLoggedIn={isLoggedIn} user={user} onSignOut={handleSignOut} />}>
            <Route path="/" element={<Navigate to="/properties" replace />} />
            <Route path="/properties" element={<PropertyList {...likeProps} />} />
            <Route path="/properties/:id" element={<PropertyDetails {...likeProps} />} />
            <Route path="/login" element={<Login onSignIn={handleSignIn} />} />
            <Route path="/register" element={<Register onSignIn={handleSignIn} />} />

            {/* Panel: solo personal (ADMIN u OPERATOR). Un VISITOR vuelve al listado. */}
            <Route element={<Protected isSignedIn={isLoggedIn} user={user} allowedRoles={STAFF_ROLES} />}>
              <Route path="/admin/*" element={<Admin token={token} user={user} />} />
            </Route>

            {/* Favoritos: cualquier usuario logueado */}
            <Route element={<Protected isSignedIn={isLoggedIn} user={user} />}>
              <Route path="/favorites" element={<Favorites {...likeProps} />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
