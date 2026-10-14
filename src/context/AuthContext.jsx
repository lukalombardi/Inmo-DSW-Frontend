import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { login as loginApi } from '../api/auth.js'

const CLAVE = 'ial-sesion'
const AuthContext = createContext(null)

// Lee el vencimiento (exp) del JWT sin verificarlo: solo para no mostrar
// una sesión que el backend ya va a rechazar (el token dura 8 h).
function tokenVencido(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(base64))
    return typeof exp === 'number' && exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

function leerSesion() {
  try {
    const sesion = JSON.parse(localStorage.getItem(CLAVE))
    if (sesion?.token && sesion?.usuario && !tokenVencido(sesion.token)) return sesion
  } catch {
    // localStorage bloqueado o con basura: arrancamos sin sesión
  }
  return null
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion)

  const ingresar = useCallback(async (email, password) => {
    const datos = await loginApi(email, password)
    const nueva = { token: datos.token, usuario: datos.usuario }
    try { localStorage.setItem(CLAVE, JSON.stringify(nueva)) } catch { /* sin persistencia */ }
    setSesion(nueva)
    return nueva
  }, [])

  const salir = useCallback(() => {
    try { localStorage.removeItem(CLAVE) } catch { /* nada que borrar */ }
    setSesion(null)
  }, [])

  const valor = useMemo(
    () => ({ usuario: sesion?.usuario ?? null, token: sesion?.token ?? null, ingresar, salir }),
    [sesion, ingresar, salir]
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
