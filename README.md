# Panel de Rendimiento Académico — UNSA

Dashboard de rendimiento académico de pregrado (2019–2024) con acceso por rol.

## Cómo correrlo en VS Code

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` → redirige a `/login`.

## Cuentas de prueba (`src/lib/roles.ts`)

| Correo | Rol | Alcance |
|---|---|---|
| `admin.programadora@unsa.edu.pe` | ADMIN | Todo + carga de Excel |
| `vicerrector.academico@unsa.edu.pe` | VICERRECTOR | Todo (solo lectura) |
| `decano.biologicas@unsa.edu.pe` | DECANO | Facultad de Cs. Biológicas (todas sus escuelas) |
| `esiug@unsa.edu.pe` | DIRECTOR | Solo Ingeniería Pesquera |

El login es solo por correo (sin contraseña) — es una simulación para desarrollo.
Cuando se conecte el directorio institucional (SSO/LDAP/Google Workspace), el
formulario de `src/app/login/page.tsx` se reemplaza por ese flujo, y
`getUserByEmail` en `src/lib/roles.ts` se conecta a la fuente real de roles.

## Dar de alta una cuenta/rol nuevo

Editar `src/lib/roles.ts` y agregar una entrada a `USER_ACCOUNTS`. Los nombres de
`facultad`/`escuela` deben coincidir EXACTAMENTE con los que aparecen en
`public/data/initialData.json` (columnas `FACULTAD`/`ESCUELA` del Excel origen).

## Actualizar los datos (rol ADMIN)

En el dashboard, botón **"Subir Excel / Actualizar"**. El Excel debe tener las
columnas: `DOCENTE, FACULTAD, ESCUELA, PERIODO, ASIGNATURA, MATRICULADOS,
APROBADOS, DESAPROBADOS, RETIRADOS, NO_CULMINADOS, NOTA_PROMEDIO`.

En el tablero, `RETIRADOS` y `NO_CULMINADOS` se muestran por separado como
`Retiro` y `Abandono`, sin juntarlos bajo una sola etiqueta de “no culminación”.

La carga solo actualiza la sesión actual (no hay backend que escriba en disco).
Tras cargar, el modal ofrece **descargar el `initialData.json` actualizado** —
reemplaza el archivo en `public/data/` y vuelve a desplegar para publicarlo
para todos los roles. El siguiente paso natural es mover esto a un endpoint
real (API Route + base de datos, o Cloudflare D1/KV) para que la carga se
persista sola.

## Estructura

- `src/lib/roles.ts` — cuentas y roles
- `src/lib/session.ts` — sesión + alcance de datos por rol
- `src/lib/data-utils.ts` — cálculos (tasas, semáforo, agrupaciones)
- `src/lib/excelParser.ts` + `src/lib/recompute.ts` — ingestión de Excel
- `src/components/` — piezas del dashboard (KPIs, gráficos, tablas, tabs)
- `src/app/login`, `src/app/dashboard` — páginas

## Despliegue

El proyecto ya incluye `@opennextjs/cloudflare` y `wrangler` en devDependencies,
para desplegar en Cloudflare Pages/Workers cuando quieras.
