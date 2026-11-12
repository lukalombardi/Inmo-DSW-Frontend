import { Navigate, Outlet } from 'react-router'

// allowedRoles es opcional: si no viene, alcanza con estar logueado (cualquier rol).
// Si viene y el rol del usuario no está en la lista, lo mandamos al listado.
const Protected = ({ isSignedIn, user, allowedRoles }) => {
  if (!isSignedIn)
    return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user?.role))
    return <Navigate to="/properties" replace />

  return <Outlet />
}

export default Protected
