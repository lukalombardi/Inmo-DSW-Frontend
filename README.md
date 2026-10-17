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

## Árbol de carpetas

```
Inmo-DSW-Frontend/
├── index.html               # importa las fuentes de Google (Fraunces y DM Sans)
├── vite.config.js
├── public/
│   ├── logo.svg
│   └── placeholder.svg      # imagen para propiedades sin fotos
├── sample-photos/           # fotos de ejemplo para subir desde el panel
├── _old-design/             # frontend anterior, solo como referencia visual
└── src/
    ├── main.jsx
    ├── App.jsx              # rutas + ToastContainer + estado de la sesión
    ├── App.scss
    ├── index.css            # variables de la paleta y estilos generales
    ├── shared/
    │   ├── api.js           # BASE_URL, headers, manejo de errores del back
    │   ├── format.js        # precio, m², Sí/No, Venta/Alquiler
    │   └── notifications.js # successToast / errorToast
    └── components/
        ├── shared/button/        Button.jsx
        ├── layout/               Layout.jsx (header + Outlet + footer)
        ├── propertyList/         PropertyList.jsx (+ .server.js)
        ├── propertyItem/         PropertyItem.jsx
        ├── propertyDetails/      PropertyDetails.jsx (+ .server.js)
        ├── inquiryForm/          InquiryForm.jsx (+ .server, .data, .const)
        ├── auth/login/           Login.jsx (+ .server, .data)
        ├── auth/protected/       Protected.jsx
        ├── admin/                Admin.jsx (+ .server.js)
        ├── propertyForm/         PropertyForm.jsx (+ .server, .data, .const, .helpers)
        ├── photoManager/         PhotoManager.jsx (+ .server.js)
        ├── catalogManager/       CatalogManager.jsx (+ .server.js) → zonas y tipos
        ├── inquiryList/          InquiryList.jsx (+ .server.js)
        ├── confirmModal/         ConfirmModal.jsx
        └── pageNotFound/         PageNotFound.jsx
```

Cada componente tiene su `.scss` al lado.

## Concepto del apunte → archivo donde se usa

| Concepto | Dónde |
|---|---|
| Componentes y props | `propertyItem/PropertyItem.jsx` (recibe `property`) |
| Un componente por archivo, cada uno en su carpeta | todo `src/components/` |
| `.server.js` con callbacks `{ onSuccess, onError }` | todos los `*.server.js` |
| `.data.js` (estado inicial del form) y `.const.js` (constantes) | `login/Login.data.js`, `inquiryForm/`, `propertyForm/` |
| `.helpers.js` (funciones JS sin React) | `propertyForm/PropertyForm.helpers.js` |
| Props con valores por defecto y `...rest` | `shared/button/Button.jsx` |
| SCSS + BEM (`block__element--modifier`) | todos los `.scss` (ej. `.property-card__price`) |
| Variables CSS en `:root` | `src/index.css` |
| `useState` | `propertyList/PropertyList.jsx` (filtros), todos los formularios |
| `map` con `key` | `PropertyList.jsx`, `Admin.jsx` (filas de la tabla) |
| `filter` | `PropertyList.jsx` (filtros), `Admin.jsx` (sacar la propiedad borrada) |
| `find` | `inquiryList/InquiryList.jsx` (dirección de la propiedad consultada) |
| Renderizado condicional | `PropertyList.jsx` (cargando / error / vacío), `Login.jsx` (texto de ayuda) |
| `useEffect` + `fetch` con `.then/.catch` | `PropertyList.jsx` + `PropertyList.server.js` |
| CORS (resuelto con `cors()` en el back) | comentario en `shared/api.js` |
| POST / PATCH / DELETE con `headers` y `body` | `PropertyForm.server.js`, `Admin.server.js` |
| Token en los headers | `shared/api.js` → `authHeaders(token)` |
| Formularios controlados (`value` + `onChange`) | `InquiryForm.jsx`, `PropertyForm.jsx` |
| Checkbox controlado (`checked`) | `PropertyForm.jsx` (`garage`, `creditEligible`) |
| `useRef` + `focus()` en el campo con error | `auth/login/Login.jsx` |
| Estado de errores y texto de ayuda condicional | `Login.jsx` |
| Levantar el estado (lifting state up) | `App.jsx` (`isLoggedIn`, `onSignIn`, `onSignOut`) |
| Toasts con react-toastify | `shared/notifications.js`, `<ToastContainer />` en `App.jsx` |
| `BrowserRouter`, `Routes`, `Route` | `App.jsx` |
| `<Navigate replace />` | `App.jsx` (`/` → `/properties`), `Protected.jsx` |
| Ruta protegida con `<Outlet />` | `auth/protected/Protected.jsx` |
| Layout con `<Outlet />` y `NavLink` (`isActive`) | `layout/Layout.jsx` |
| Rutas anidadas y relativas (`/admin/*`) | `admin/Admin.jsx` (como el Dashboard del profe) |
| `useParams` | `PropertyDetails.jsx`, `PropertyForm.jsx` |
| `useNavigate` con `state` | `Admin.jsx` → `handleEditProperty` |
| `useLocation` con fallback a fetch | `PropertyDetails.jsx`, `PropertyForm.jsx` |
| `<Link to state>` | `PropertyItem.jsx` |
| Modal de confirmación | `confirmModal/ConfirmModal.jsx` (lo usan Admin, fotos, zonas y consultas) |
| Ruta `*` → PageNotFound | `App.jsx` |

### Cosas que no están en el apunte, y por qué

- **`handleResponse` en `shared/api.js`.** `fetch` no tira error con un 400 o un 401. Revisamos `res.ok` y, si falló, mandamos el cuerpo al `.catch`. Así podemos mostrar los mensajes de validación del back.
- **`FormData` en `PhotoManager.server.js`.** Un archivo no se puede mandar como JSON. Es la forma estándar de subirlo.
- **`key` distinta en algunas rutas de Admin** (`new` / `edit`, `zones` / `types`). Son el mismo componente con otros datos, y la key hace que React lo arme de cero.
- **Mapa en el detalle.** Es un `<iframe>` de HTML común con el mapa de OpenStreetMap: no usa librerías ni API key. Solo aparece si la propiedad tiene latitud y longitud.
- **La sesión vive en memoria** (`useState` en App), como en el ejemplo del profe. Si se recarga la página, hay que volver a ingresar.

## Cambios sugeridos al backend

No están aplicados. El front funciona con el back tal como está y estas son mejoras para evaluar.

| # | Qué cambiaría | Por qué | Qué mejora en el front |
|---|---|---|---|
| 1 | `POST /users`: aceptar también `verifyToken + requireAdmin`, además de la API key | Hoy, después del primer admin, solo se pueden crear usuarios con la API key, y esa clave no puede estar en el navegador | Se podría sumar una pantalla "Usuarios" al panel |
| 2 | Mensajes en español en todos los campos de los schemas de zod (`inquiry.schema.js`, `propertyTypeId`, `zoneId`, `userId`, `operation`, `currency`, `latitude`/`longitude`) | Algunos errores llegan con el mensaje por defecto de zod en inglés ("Too small: expected string…") | El front podría mostrar directo `issue.message` en lugar de tener su propia lista (`*.data.js` → `...FieldMessages`) |
| 3 | `z.coerce.number()` convierte `''` en `0` | Un campo vacío pasa como 0: por ejemplo `rooms: ''` se guarda como 0 habitaciones, y en el PATCH `latitude: ''` pisaría la coordenada con 0 | Hoy el front valida y no manda los vacíos. Con `z.number()` o un `preprocess` que pase `''` a `undefined`, el back se protege solo |
| 4 | Poder borrar las coordenadas con PATCH (`latitude: null`) | Hoy, si una propiedad tiene coordenadas, desde el front no se le pueden sacar | Vaciar los campos de latitud y longitud las borraría |
| 5 | `GET /inquiries`: `include: { property: { select: { id: true, address: true } } }` | La consulta solo trae `propertyId` | El front no necesitaría la lista de propiedades para mostrar la dirección |
| 6 | `POST` y `PATCH /properties`: devolver con `include: { propertyType, zone, photos }` | Hoy la respuesta no trae zona, tipo ni fotos | El panel no tendría que volver a pedir toda la lista después de guardar |
| 7 | Al borrar una propiedad, borrar también sus archivos de `uploads/` | El `onDelete: Cascade` borra las filas de `photos`, pero los archivos quedan en el disco (o en el volumen de Railway) | Nada visible, pero no se llena el volumen con fotos huérfanas |
| 8 | `UPLOAD_DIR` configurable por variable de entorno (`shared/upload.js`) | Hoy la ruta está fija en el código | Facilita montar el volumen de Railway en otra ruta |
| 9 | `userId` de la propiedad: si no viene, tomar el del token (`req.user.id`) | Un OPERATOR no puede listar usuarios (`GET /users` es solo ADMIN) | Para un operador, el front hoy muestra solo su propio usuario en el select. Con este cambio, ese campo se podría sacar |
| 10 | `cors({ origin: process.env.FRONT_URL })` en producción | El apunte 2.2 advierte que `cors()` sin configuración es riesgoso en producción | Nada para el front: es seguridad del deploy |
