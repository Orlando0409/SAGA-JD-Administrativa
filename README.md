# SAGA-JD · Frontend Administrativo

Panel interno del **Sistema de Agua Potable de la ASADA de Juan Díaz** (SAGA-JD). Permite al personal de la ASADA gestionar afiliados, solicitudes, lecturas, facturación, inventario de medidores y materiales, calidad del agua, actas, proyectos, contenidos públicos y bitácora de auditoría.

Consume la API expuesta por `saga-jd-back-end` y recibe notificaciones en tiempo real mediante SSE.

---

## Stack principal

- **React 19** + **TypeScript** + **Vite** (HMR, build a `dist/`).
- **TanStack Router** con rutas file-based (`src/routes` → `routeTree.gen.ts`).
- **TanStack Query** para data fetching, caché e invalidación.
- **TanStack Table** para listados y tablas con filtros, ordenamiento y paginación.
- **TanStack Form** + **Zod** + **React Hook Form** para validación de formularios.
- **Radix UI** (Accordion, Dialog, AlertDialog, Tooltip, Slot) y **shadcn-like** components.
- **Tailwind CSS 4** con tema personalizado.
- **Framer Motion** para transiciones.
- **Axios** con interceptores: cookie-based auth, refresh automático del JWT, envío de zona horaria/locale.
- **EventSource** (SSE) para el buzón de notificaciones.
- **date-fns**, **libphonenumber-js**, **jwt-decode**, **lucide-react** / **react-icons**.

---

## Estructura (`src/Modules`)

| Módulo | Funcionalidad |
|---|---|
| `Auth` | Login, refresh, recuperación de contraseña, contexto de usuario, hook de permisos (`useUserPermissions`) y `ProtectedRoute` |
| `Global` | Layout principal (`HomeLayout`), Sidebar, Breadcrumbs, contexto de alertas, `DescargarPdfModal` reutilizable, dashboard inicial |
| `Usuarios` | CRUD de usuarios, asignación de roles |
| `Roles` | CRUD de roles, gestión visual de permisos por módulo |
| `Afiliados` | Listado físico/jurídico, detalle, subida de planos/escrituras, cambio de tipo a Asociado, descarga PDF individual y por lote |
| `Solicitudes` | Bandeja por tipo (Afiliación, Desconexión, Cambio de Medidor, Asociado, Agregar Medidor), edición, cambio de estado, badge en sidebar, **buzón de notificaciones** y stream SSE |
| `Inventario` | Materiales, categorías, unidades, movimientos (entradas/salidas), medidores y subida de archivos por medidor |
| `Lecturas` | Carga manual y por CSV, historial por medidor, descarga PDF |
| `Facturas` | Listado y detalle de facturas generadas |
| `Proveedores` | Físicos y jurídicos con descarga PDF |
| `Proyectos` | Gestión de proyectos visibles desde la informativa |
| `Calidad De Agua` | Publicación de reportes técnicos |
| `Actas` | Subida de actas oficiales con archivos |
| `Imagenes` | Galería pública |
| `Manuales` | Subida de manuales |
| `PreguntasFrecuentes` | CRUD de FAQ |
| `Auditoria` | Consulta y descarga de la bitácora (creación, actualización, eliminación por módulo) |
| `QuejasSugerenciasReportes` | Bandeja unificada del buzón público con respuesta, cambio de estado y archivado |

Hooks transversales:

- `Solicitudes/Hooks/HookSolicitudesStream.ts` — escucha SSE y dispara `invalidateQueries` para listas de solicitudes y de contacto.
- `QuejasSugerenciasReportes/hook/HookNotificacionesContacto.ts` — agrega quejas+sugerencias+reportes pendientes para el buzón.
- Hooks de queries con flag `enabled` para que no disparen requests cuando el usuario no tiene permiso de ver el módulo correspondiente.

---

## Notificaciones en tiempo real

- `HomeLayout` monta `useSolicitudesStream` cuando el usuario tiene al menos uno de los permisos `solicitudes` o `quejasugerenciasreportes`.
- La campana (`BuzonNotificaciones`) muestra **dos pestañas**: *Solicitudes* y *Contacto*, cada una con su contador y su lista. Diseño responsive (panel fijo en móvil, dropdown en desktop).
- Los eventos SSE invalidan las queries correspondientes (`['solicitudes-fisicas']`, `['solicitudes-juridicas']`, `['quejas']`, `['sugerencias']`, `['reportes']`) y la UI se refresca sin recargar.
- Si la conexión falla, el hook reintenta con backoff exponencial (2 s → 30 s) y refresca el token JWT antes de reconectar.

---

## Requisitos

- Node.js 20+
- pnpm 9+ o npm
- Backend (`saga-jd-back-end`) corriendo y accesible desde la URL configurada.

---

## Setup

```bash
pnpm install
```

`.env` (mínimo):

```
VITE_API_URL=http://localhost:3000/api
```

---

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo Vite |
| `pnpm build` | Type-check (`tsc -b`) + build producción a `dist/` |
| `pnpm preview` | Previsualiza el build de producción |
| `pnpm lint` | ESLint |

---

## Convenciones

- **Rutas**: file-based en `src/routes`. La generación se actualiza automáticamente al guardar (`routeTree.gen.ts`, no se edita manualmente).
- **Auth**: el JWT se guarda como cookie HTTP-only en el dominio del backend; el frontend envía `withCredentials: true` en todas las llamadas.
- **Permisos**: cada módulo expone una key (`solicitudes`, `afiliados`, `quejasugerenciasreportes`, etc.). Usar `canView(modulo)` antes de montar componentes pesados o disparar queries globales.
- **PDF**: las descargas se construyen en el backend; el frontend abre el modal `DescargarPdfModal` para filtros y columnas, o usa `DescargarRegistroPdfButton` para detalle individual.
- **Estilos**: utilidades Tailwind 4 + clases con prefijos responsive (`sm:`, `md:`, `lg:`); se evita CSS global.
- **Caché**: las queries usan `staleTime` de 3-10 minutos y `refetchOnWindowFocus: false`; la frescura proviene del SSE y de las mutaciones.

---

## Despliegue

`vite build` genera estáticos en `dist/`. Sirve detrás de cualquier CDN o servidor estático (Nginx, Vercel, Cloudflare Pages, etc.). Asegurar que la URL del backend sea servida con HTTPS y `SameSite=None; Secure` cuando esté en otro dominio para que las cookies viajen correctamente.
