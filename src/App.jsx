import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Layout from './components/layout/Layout'
import PropertyList from './components/propertyList/PropertyList'
import PropertyDetails from './components/propertyDetails/PropertyDetails'
import Login from './components/auth/login/Login'
import Protected from './components/auth/protected/Protected'
import Admin from './components/admin/Admin'
import PageNotFound from './components/pageNotFound/PageNotFound'
import './App.scss'

const App = () => {
  // Sesión: vive solo en memoria, si se recarga la página hay que volver a ingresar
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)

  // data = respuesta de POST /auth/login: { token, user }
  const handleSignIn = (data) => {
    setToken(data.token)
    setUser(data.user)
    setIsLoggedIn(true)
  }

  const handleSignOut = () => {
    setToken('')
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <BrowserRouter>
      <div className="app">
        <ToastContainer />
        <Routes>
          <Route element={<Layout isLoggedIn={isLoggedIn} user={user} onSignOut={handleSignOut} />}>
            <Route path="/" element={<Navigate to="/properties" replace />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/login" element={<Login onSignIn={handleSignIn} />} />

            <Route element={<Protected isSignedIn={isLoggedIn} />}>
              <Route path="/admin/*" element={<Admin token={token} user={user} />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
