# IAL Propiedades — Frontend

Frontend de la inmobiliaria para la materia Desarrollo de Software (UTN).
React + Vite (JavaScript), React Router y React Toastify. Estilos en SCSS con BEM.
Consume la API de `Inmo-DSW-Backend` **sin modificarla**.

## Cómo levantarlo

### 1. Backend (`Inmo-DSW-Backend`)

```bash
cd Inmo-DSW-Backend
docker compose up --build
```

La API queda en http://localhost:3000.

**Primer admin (una sola vez):** el único endpoint que usa la API key es `POST /users`, y sirve para crear el primer administrador. Después todo funciona con el token del login.

```http
POST http://localhost:3000/users
x-api-key: <API_KEY del .env del back>
Content-Type: application/json

{ "name": "Admin IAL", "email": "admin@inmo.com", "password": "admin123", "role": "ADMIN" }
```

> En la base de desarrollo ya existe ese admin (`admin@inmo.com` / `admin123`), con 5 zonas, 3 tipos y 7 propiedades con fotos de ejemplo.

### 2. Frontend (esta carpeta)

```bash
cd Inmo-DSW-Frontend
npm install
npm run dev
```

Abrir http://localhost:5173.

- No hace falta ningún `.env`: la URL del back está en `src/shared/api.js`.
- No hace falta proxy: el back ya tiene `app.use(cors())`, que es la solución que muestra el apunte 2.2.

### Fotos de ejemplo

En `sample-photos/` hay 12 fotos libres de [Unsplash](https://unsplash.com/license) para la demo.
Se suben desde **Panel → Editar propiedad → Fotos**. El front las manda a `POST /photos` y el back las guarda en su carpeta `uploads/`, que más adelante va a ser el volumen de Railway.

## Pantallas

| Ruta | Qué muestra | Acceso |
|---|---|---|
| `/` | Redirige a `/properties` | Público |
| `/properties` | Listado con filtros por operación y zona | Público |
| `/properties/:id` | Detalle con fotos y formulario de consulta | Público |
| `/login` | Ingreso del personal | Público |
| `/admin` | Tabla de propiedades (editar / eliminar) | Logueado |
| `/admin/new` | Crear propiedad | Logueado |
| `/admin/edit/:id` | Editar propiedad y sus fotos | Logueado |
| `/admin/zones` | ABM de zonas | Solo ADMIN |
| `/admin/property-types` | ABM de tipos de propiedad | Solo ADMIN |
| `/admin/inquiries` | Consultas recibidas | Logueado |
| `*` | Página no encontrada | Público |
