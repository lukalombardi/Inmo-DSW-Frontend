# IAL Propiedades — Frontend

React + Vite + React Router, CSS plano con variables. Consume la API de `Inmo-DSW-Backend`.

## Cómo correrlo

1. Levantar el backend (desde `Inmo-DSW-Backend`): `docker compose up` (API en http://localhost:3000).
2. En esta carpeta, crear `.env` a partir de `.env.example`:
   - `VITE_API_URL`: URL del backend.
   - `VITE_API_KEY`: la misma `API_KEY` del `.env` del backend (la pide `POST /consultas`).
3. `npm install`
4. `npm run dev` → http://localhost:5173

Para producción: `npm run build` (sale en `dist/`). Si cambiás el `.env`, hay que volver a compilar.

## Pantallas

| Ruta | Pantalla | API |
|---|---|---|
| `/` | Listado con filtros (`?zonaId=&tipoId=&operacion=`) | `GET /propiedades`, `/zonas`, `/tipos` |
| `/propiedades/:id` | Detalle | `GET /propiedades/:id` |
| `/propiedades/:id/consulta` | Formulario de consulta | `POST /consultas` |
| `/ingresar` | Login del personal | `POST /auth/login` |

## Estructura

```
src/
  api/          llamadas a la API (client.js maneja errores y la URL base)
  components/   piezas reutilizables (tarjeta, filtros, galería, ficha, mapa…)
  context/      sesión del personal (token en localStorage)
  hooks/        useFiltros (filtros en la URL), usePropiedad
  pages/        una por pantalla, cada una con su CSS
  styles/       tokens.css (sistema visual), base.css, layout.css
  utils/        formato de precios y validaciones
```

## A tener en cuenta

- La `VITE_API_KEY` queda dentro del JavaScript que descarga el navegador: cualquiera puede verla.
- El mapa es un iframe de OpenStreetMap y solo aparece si la propiedad tiene latitud y longitud.
