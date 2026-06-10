# SC Marketplace — Prototipo de navegación

Prototipo funcional de referencia para la plataforma Service Club Marketplace.
Cubre la estructura de navegación, roles y verticales completas.
**No es código de producción.** El objetivo es validar flujos, rutas y UI antes del desarrollo real.

---

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

La app arranca en `http://localhost:5173`.
La página de entrada es `/` (ProductSelector).

---

## Stack

- React 19 + Vite 8
- React Router DOM v7
- Lucide React (iconos)
- CSS custom properties — sin Tailwind, sin UI library
- Sin backend — todos los datos son estáticos en `src/data.js`
- Sin Redux ni Context API — estado local por página con `useState`

---

## Estructura de carpetas

```
src/
├── App.jsx                          # Router raíz. Define layouts DSPLayout y rutas globales.
├── main.jsx                         # Entry point de React.
├── index.css                        # Fuente de verdad del design system: tokens + clases base.
├── data.js                          # Datos mock centralizados: sessions, learners, invoices, paths.
│
├── assets/
│   ├── banner-sessions.svg          # Banner SVG para la sección Sessions (exportado de Figma).
│   ├── icon-sc.svg                  # Icono rayo SC — usado en todos los page headers.
│   └── logo-sc.svg                  # Logo horizontal SC — usado en sidebar y ProductSelector.
│
├── layouts/
│   └── AdminLayout.jsx              # Layout wrapper para rutas Ops SC (monta AdminSidebar).
│
├── components/                      # [Tech Lead — por asignar]
│   ├── AdminSidebar.jsx             # Sidebar de la vista Ops SC con nav y VerticalRoleSwitcher.
│   ├── Badge.jsx                    # Pill de estado reutilizable (published, paid, overdue...).
│   ├── Modal.jsx                    # Modal genérico con overlay, header, body y footer.
│   ├── PageHeader.jsx               # Banner de cabecera de página. 3 modos: img / inline SVG / default.
│   ├── RoleSwitcher.jsx             # DEPRECATED. Sustituido por VerticalRoleSwitcher.
│   ├── SessionTypeBadge.jsx         # Badge de tipo de sesión (Presencial / Virtual / Híbrido).
│   ├── Sidebar.jsx                  # Sidebar de la vista DSP con nav y VerticalRoleSwitcher.
│   └── VerticalRoleSwitcher.jsx     # Selector doble en el footer del sidebar: vertical activa + rol.
│
└── pages/
    │
    ├── shared/                      # [Tech Lead — por asignar]
    │   └── ProductSelector.jsx      # Página de entrada. Muestra las 3 verticales; Academy activa.
    │
    ├── academy/                     # [Tech Lead — por asignar]
    │   ├── dsp/                     # Vista DSP/Company de Academy
    │   │   ├── Dashboard.jsx        # Client Hub: stats, sesiones del día, facturas pendientes.
    │   │   ├── Sessions.jsx         # Lista de sesiones con tabs Today / Upcoming / Past.
    │   │   ├── SessionDetail.jsx    # Detalle de sesión: info, learners inscritos, botón enrol.
    │   │   └── Invoices.jsx         # Billing & Invoices del DSP.
    │   │
    │   ├── ops/                     # Vista Ops SC de Academy
    │   │   ├── AdminDashboard.jsx   # Overview admin: stats globales, acceso rápido, paths recientes.
    │   │   ├── AdminInvoices.jsx    # Facturas globales con filtros por empresa, estado y fecha.
    │   │   ├── EnrolLearners.jsx    # Wizard de 2 pasos para inscribir learners a una sesión.
    │   │   ├── LearnerDetail.jsx    # Perfil de learner: stats, historial de sesiones y paths.
    │   │   ├── Learners.jsx         # Lista de learners con búsqueda y filtros.
    │   │   ├── LearningPaths.jsx    # Lista de learning paths con estado y métricas.
    │   │   ├── NewPath.jsx          # Formulario de creación de nuevo learning path.
    │   │   ├── NewSubOrg.jsx        # Formulario de creación de nueva sub-organización.
    │   │   ├── PathComposer.jsx     # Editor de path: drag & drop entre actos y elementos, upload simulado.
    │   │   ├── PathDetail.jsx       # Detalle de path publicado: módulos, learners, progreso.
    │   │   ├── Reports.jsx          # Sección Reports — placeholder, pendiente de implementación.
    │   │   ├── TenantDetail.jsx     # Detalle de sub-org: stats, tabs Learners / Paths / Sessions / Invoices.
    │   │   └── Tenants.jsx          # Lista de tenants / sub-organizaciones.
    │   │
    │   └── user/                    # Learner + Trainer — pendiente de implementación
    │
    ├── jobs/                        # [Tech Lead — por asignar]
    │   ├── dsp/
    │   │   └── JobsDashboard.jsx    # Placeholder mínimo. Ver TODOs.
    │   ├── ops/                     # Pendiente de implementación
    │   └── user/                    # Driver — pendiente de implementación
    │
    └── perks/                       # [Tech Lead — por asignar]
        ├── dsp/
        │   └── PerksDashboard.jsx   # Placeholder mínimo. Ver TODOs.
        ├── ops/                     # Pendiente de implementación
        └── user/                    # Employee — pendiente de implementación
```

---

## Mapa de rutas

| Ruta | Componente | Vertical | Rol | Estado |
|------|------------|----------|-----|--------|
| `/` | ProductSelector | Shared | — | Activo |
| `/academy` | Dashboard | Academy | DSP | Activo |
| `/academy/sessions` | Sessions | Academy | DSP | Activo |
| `/academy/sessions/:id` | SessionDetail | Academy | DSP | Activo |
| `/academy/learners` | Learners | Academy | DSP | Activo |
| `/academy/learners/:id` | LearnerDetail | Academy | DSP | Activo |
| `/academy/learners/enrol` | EnrolLearners | Academy | DSP | Activo |
| `/academy/invoices` | Invoices | Academy | DSP | Activo |
| `/academy/admin` | AdminDashboard | Academy | Ops SC | Activo |
| `/academy/admin/sessions` | Sessions | Academy | Ops SC | Activo |
| `/academy/admin/sessions/:id` | SessionDetail | Academy | Ops SC | Activo |
| `/academy/admin/tenants` | Tenants | Academy | Ops SC | Activo |
| `/academy/admin/tenants/new` | NewSubOrg | Academy | Ops SC | Activo |
| `/academy/admin/tenants/:id` | TenantDetail | Academy | Ops SC | Activo |
| `/academy/admin/invoices` | AdminInvoices | Academy | Ops SC | Activo |
| `/academy/admin/learners` | Learners | Academy | Ops SC | Activo |
| `/academy/admin/learners/:id` | LearnerDetail | Academy | Ops SC | Activo |
| `/academy/admin/learners/enrol` | EnrolLearners | Academy | Ops SC | Activo |
| `/academy/admin/paths` | LearningPaths | Academy | Ops SC | Activo |
| `/academy/admin/paths/new` | NewPath | Academy | Ops SC | Activo |
| `/academy/admin/paths/new/edit` | PathComposer | Academy | Ops SC | Activo |
| `/academy/admin/paths/:id` | PathDetail | Academy | Ops SC | Activo |
| `/academy/admin/paths/:id/edit` | PathComposer | Academy | Ops SC | Activo |
| `/academy/admin/reports` | Reports | Academy | Ops SC | Placeholder |
| `/jobs` | JobsDashboard | Jobs | DSP | Placeholder |
| `/jobs/admin` | — | Jobs | Ops SC | Pendiente |
| `/perks` | PerksDashboard | Perks | DSP | Placeholder |
| `/perks/admin` | — | Perks | Ops SC | Pendiente |
| — | — | Academy | Learner | Pendiente |
| — | — | Academy | Trainer | Pendiente |
| — | — | Jobs | Driver | Pendiente |
| — | — | Perks | Employee | Pendiente |

Cualquier ruta no definida redirige a `/`.

---

## Roles por vertical

```
Academy → DSP/Company | Ops SC | Learner | Trainer
Jobs    → DSP/Company | Ops SC | Driver
Perks   → DSP/Company | Ops SC | Employee
```

### Lógica de acceso

- **Ops SC** — acceso restringido a cuentas `@serviceclub.com`. Es el rol de operaciones internas de Service Club.
- **DSP/Company** — admin del cliente (empresa contratante). Gestiona su propia sub-organización, learners y facturación.
- **End User** (Learner, Trainer, Driver, Employee) — usuario final de cada vertical. Accede solo a su contenido asignado.

El switch de vertical y rol está implementado en `VerticalRoleSwitcher.jsx` y vive en el footer de ambos sidebars. La lógica de acceso real (autenticación, guards) es responsabilidad del backend y está fuera del alcance de este prototipo.

---

## Design system

Los tokens del design system están definidos en `src/index.css` como CSS custom properties bajo `:root`.
Este archivo es la fuente de verdad del prototipo.

> **Nota para el equipo:**
> El design system está en evolución activa. Antes de trabajar en cualquier componente visual,
> revisar que `src/index.css` esté actualizado con la última versión del archivo
> `SC_DesignSystem_VX.md` del proyecto.
> No hardcodear colores, tamaños ni tipografías — usar siempre los tokens definidos en `:root`.

### Tokens principales

```css
--color-primary:   #ff4b4b   /* Rojo SC */
--color-secondary: #032f4f   /* Azul marino SC */
--color-accent:    #4f46e5   /* Indigo */
--color-bg:        #f4f4f5
--color-card:      #ffffff
--color-border:    #e5e7eb
--color-text:      #09090b
--color-muted:     #71717a
--color-success:   #16a34a
--color-warning:   #d97706
```

### Tipografía

- **Poppins** — UI principal: sidebar, botones, headers, labels
- **Space Mono** — uso tipográfico específico (pendiente de asignar en el design system)
- **Inter** — cuerpo de texto y contenido de tabla

---

## Decisiones de arquitectura

Decisiones que los tech leads deben conocer antes de modificar el código:

1. **Cuenta única DSP con product selector.**
   El usuario DSP entra por `/` y elige su vertical (Academy, Jobs, Perks). Si solo tiene acceso a una, se puede hacer redirect automático. El ProductSelector es el punto de entrada universal.

2. **Switch de dos dimensiones en el sidebar.**
   El footer del sidebar tiene dos selectores independientes: vertical activa y rol dentro de esa vertical. El componente `VerticalRoleSwitcher.jsx` detecta ambos valores desde `location.pathname` y navega en consecuencia.

3. **Estructura de carpetas por vertical.**
   `src/pages/` está dividido en `academy/`, `jobs/` y `perks/`, cada uno con `dsp/`, `ops/` y `user/`. El objetivo es que cada equipo de vertical trabaje en su carpeta sin interferir con las demás.

4. **Sin Redux ni Context API.**
   Estado local por página con `useState`. Para el prototipo es suficiente. Si se necesita estado compartido en producción, se deberá añadir una capa de gestión de estado explícita.

5. **Datos mock centralizados en `src/data.js`.**
   Todas las páginas consumen el mismo archivo de datos. Para añadir o modificar datos del prototipo, editar solo este archivo.

6. **Contexto dual DSP / Ops SC en componentes compartidos.**
   Las páginas `Sessions.jsx`, `SessionDetail.jsx`, `Learners.jsx`, `LearnerDetail.jsx` y `EnrolLearners.jsx` sirven a los dos roles desde el mismo componente. Detectan su contexto con `location.pathname.startsWith('/academy/admin')` para derivar rutas base.

7. **`RoleSwitcher.jsx` deprecated.**
   El componente original `RoleSwitcher.jsx` ha sido sustituido por `VerticalRoleSwitcher.jsx`. No está siendo importado por ningún componente activo. Se puede eliminar una vez confirmado que no hay dependencias externas.

---

## TODOs por vertical

### Academy

```
// TODO: [Tech Lead — por asignar]
// Vertical: Academy | Rol: Ops SC
// Componente: Reports (src/pages/academy/ops/Reports.jsx)
// Estado: Placeholder
// Descripción: Sección de reportes y analítica global de Academy.
//   Incluir: completion rates por tenant, actividad de learners,
//   exportación de datos, filtros por fecha y sub-org.
```

```
// TODO: [Tech Lead — por asignar]
// Vertical: Academy | Rol: Learner
// Ruta sugerida: /academy/learner o /academy/me
// Estado: Pendiente — carpeta src/pages/academy/user/ vacía
// Descripción: Vista del learner individual.
//   Incluir: mis sesiones asignadas, mi progreso en paths,
//   certificados obtenidos, próximas sesiones.
```

```
// TODO: [Tech Lead — por asignar]
// Vertical: Academy | Rol: Trainer
// Ruta sugerida: /academy/trainer
// Estado: Pendiente — carpeta src/pages/academy/user/ vacía
// Descripción: Vista del formador.
//   Incluir: sesiones asignadas como trainer, gestión de asistencia,
//   subida de materiales, resultados de sesiones impartidas.
```

### Jobs

```
// TODO: [Tech Lead — por asignar]
// Vertical: Jobs | Rol: DSP
// Ruta: /jobs (src/pages/jobs/dsp/JobsDashboard.jsx)
// Estado: Placeholder mínimo
// Descripción: Dashboard principal del DSP de Jobs.
//   Incluir: pipeline de candidatos activos, ofertas publicadas,
//   estado de procesos de selección, acceso a invoices de Jobs.
```

```
// TODO: [Tech Lead — por asignar]
// Vertical: Jobs | Rol: Ops SC
// Ruta: /jobs/admin
// Estado: Pendiente — carpeta src/pages/jobs/ops/ vacía
// Descripción: Vista de operaciones de Jobs para el equipo SC.
//   Incluir: gestión de ofertas globales, revisión de candidatos,
//   configuración de procesos, analítica de colocación.
```

```
// TODO: [Tech Lead — por asignar]
// Vertical: Jobs | Rol: Driver
// Ruta sugerida: /jobs/driver o /jobs/me
// Estado: Pendiente — carpeta src/pages/jobs/user/ vacía
// Descripción: Vista del conductor candidato.
//   Incluir: ofertas disponibles, estado de mi candidatura,
//   documentación requerida, historial de procesos.
```

### Perks

```
// TODO: [Tech Lead — por asignar]
// Vertical: Perks | Rol: DSP
// Ruta: /perks (src/pages/perks/dsp/PerksDashboard.jsx)
// Estado: Placeholder mínimo
// Descripción: Dashboard principal del DSP de Perks.
//   Incluir: beneficios activos para su empresa, uso por empleado,
//   gestión de accesos, facturación de Perks.
```

```
// TODO: [Tech Lead — por asignar]
// Vertical: Perks | Rol: Ops SC
// Ruta: /perks/admin
// Estado: Pendiente — carpeta src/pages/perks/ops/ vacía
// Descripción: Vista de operaciones de Perks para el equipo SC.
//   Incluir: catálogo de beneficios global, asignación a empresas,
//   proveedores, analítica de uso y facturación.
```

```
// TODO: [Tech Lead — por asignar]
// Vertical: Perks | Rol: Employee
// Ruta sugerida: /perks/employee o /perks/me
// Estado: Pendiente — carpeta src/pages/perks/user/ vacía
// Descripción: Vista del empleado usuario de Perks.
//   Incluir: mis beneficios disponibles, historial de uso,
//   descuentos activos, canje de beneficios.
```
