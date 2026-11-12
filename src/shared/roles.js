// Roles que manda el back en user.role
export const ROLES = {
  ADMIN: 'ADMIN',
  OPERATOR: 'OPERATOR',
  VISITOR: 'VISITOR',
}

// Personal de la inmobiliaria: los que pueden entrar al panel (requireStaff en el back)
export const STAFF_ROLES = [ROLES.ADMIN, ROLES.OPERATOR]

export const isStaff = (user) => STAFF_ROLES.includes(user?.role)
