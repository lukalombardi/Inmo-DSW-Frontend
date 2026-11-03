# IAL Propiedades — Frontend

Frontend de la inmobiliaria para Desarrollo de Software. Consume la API de [Inmo-DSW-Backend](https://github.com/lukalombardi/Inmo-DSW-Backend).

Stack: React + Vite · React Router · React Toastify · SCSS (BEM).

## Cómo levantarlo

Requisito: Node.js 20.19 o superior.

1. Levantar el backend y crear el primer admin, como explica su README ("Cómo levantarlo" y "Primer uso").

2. En otra terminal, dentro de esta carpeta:

   ```bash
   npm install
   npm run dev
   ```

   Abrir `http://localhost:5173`. No hace falta `.env`: la URL del back está en `src/shared/api.js`.

## Primeros pasos

1. Ingresar con el admin.
2. En **Panel → Zonas** y **Panel → Tipos**, cargar al menos una zona y un tipo.
3. En **Panel → Nueva propiedad**, crear una propiedad. Al guardar se abre la edición, donde se le suben fotos (JPG, PNG o WEBP de hasta 5 MB).
4. Salir y ver la propiedad en el listado público, entrar al detalle y enviar una consulta.

## Pantallas

| Ruta | Qué muestra | Acceso |
|---|---|---|
| `/properties` | Listado con filtros por operación y zona | Público |
| `/properties/:id` | Detalle con galería, mapa y formulario de consulta | Público |
| `/login` | Ingreso del personal | Público |
| `/admin` | Tabla de propiedades (crear, editar, eliminar) | Logueado |
| `/admin/edit/:id` | Edición de la propiedad y sus fotos | Logueado |
| `/admin/inquiries` | Consultas recibidas | Logueado |
| `/admin/zones`, `/admin/property-types` | ABM de zonas y tipos | Solo ADMIN |

La sesión se guarda solo en memoria: al recargar la página hay que volver a ingresar.
