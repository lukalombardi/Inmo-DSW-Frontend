export const initialRegisterData = {
  name: '',
  email: '',
  password: '',
}

// Mismos límites que valida el back en auth.schema.js (registerSchema)
export const MIN_NAME_LENGTH = 2
export const MAX_NAME_LENGTH = 100

// Mensajes en español para cada campo (los usamos al validar acá y si el back responde 400)
export const registerFieldMessages = {
  name: `Ingresá tu nombre (entre ${MIN_NAME_LENGTH} y ${MAX_NAME_LENGTH} letras).`,
  email: 'Ingresá un email válido, por ejemplo nombre@mail.com.',
  password: 'Elegí una contraseña.',
}
