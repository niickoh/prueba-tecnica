# API · Centro de Solicitudes Operativas

API de lectura en Node.js + TypeScript (strict) + Express 5 + Zod 4, con arquitectura hexagonal, construida sobre el `Service` provisto en la raíz del repo (`../Service.ts` y `../moks/`, **sin modificar**).

## Requisitos

- Node.js 22.12+ (probado con Node 24 LTS) y npm 10+.

## Uso

```bash
cd backend
npm install
cp .env.example .env      # opcional: todas las variables tienen valores por defecto
npm run dev               # http://localhost:3000 · Swagger UI en http://localhost:3000/docs
```

| Script                                                        | Qué hace                                    |
| ------------------------------------------------------------- | ------------------------------------------- |
| `npm run dev` / `npm start`                                   | Levanta la API con `tsx` (watch en `dev`)   |
| `npm run build` / `npm run start:dist`                        | Compila a `dist/` y ejecuta el JS compilado |
| `npm test`                                                    | Vitest + Supertest                          |
| `npm run typecheck` · `npm run lint` · `npm run format:check` | Calidad de código                           |

### Variables de entorno (validadas con Zod al arrancar)

| Variable       | Default                 | Descripción                                               |
| -------------- | ----------------------- | --------------------------------------------------------- |
| `PORT`         | `3000`                  | Puerto HTTP                                               |
| `CORS_ORIGIN`  | `http://localhost:5173` | Orígenes permitidos, separados por coma                   |
| `CACHE_TTL_MS` | `60000`                 | TTL de la caché de lecturas a `Service`. `0` la desactiva |

No hay secretos: `.env` está en `.gitignore` y solo se versiona `.env.example`.

## Endpoints

Todos bajo `/api`. Documentación interactiva en `/docs` y documento OpenAPI 3.1 en `/docs/openapi.json`.

| Método de `Service`                    | Endpoint                                                           |
| -------------------------------------- | ------------------------------------------------------------------ |
| `getUser()`                            | `GET /users/me`                                                    |
| `getUserRestrictions(userId)`          | `GET /users/{userId}/restrictions`                                 |
| `getUserRequests(userId, limit, page)` | `GET /users/{userId}/requests?page&limit&status&priority&category` |
| `getCategory(categoryId)`              | `GET /categories/{categoryId}`                                     |
| `getWorkflow(workflowId)`              | `GET /workflows/{workflowId}`                                      |
| `getResolution(resolutionId)`          | `GET /resolutions/{resolutionId}`                                  |

Endpoints de composición para el frontend:

| Endpoint                                      | Uso                                                                   |
| --------------------------------------------- | --------------------------------------------------------------------- |
| `GET /users/{userId}/requests/{requestId}`    | Detalle: solicitud + categoría + flujo + **resolución**               |
| `GET /users/{userId}/requests/metrics`        | Métricas del dashboard                                                |
| `GET /users/{userId}/requests/filter-options` | Valores para los filtros (estados, prioridades, categorías presentes) |

### Contrato del listado

```jsonc
// GET /api/users/1/requests?status=approved&limit=2
{
  "data": [
    {
      "id": 300198,
      "subject": "Alta de centro de costo",
      "priority": "high",
      "createdAt": "2022-07-20T08:10:27.000-03:00",
      "requester": { "id": 4008, "name": "Sam Rivera", "area": "Finanzas" },
      "category": { "id": "FINANCE", "description": "Administración financiera" },
      "workflow": { "id": 1000010198, "status": "approved" },
    },
  ],
  "pagination": { "page": 1, "limit": 2, "total": 5, "totalPages": 3 },
}
```

- `page` ≥ 1 (default 1), `limit` entre 1 y 100 (default 10).
- `status` ∈ `in_review | pending_information | approved | rejected`, `priority` ∈ `high | medium | low`, `category` = id de categoría.
- **Los filtros se aplican sobre el conjunto completo y después se pagina.**
- Un filtro sin coincidencias responde `200` con `data: []` en la página 1. Una página fuera de rango responde `400`, igual que `Service`.

### Errores

Formato único: `{ "error": { "code", "message", "details?" } }`.

| Estado | `code`                                     | Cuándo                                                                                 |
| ------ | ------------------------------------------ | -------------------------------------------------------------------------------------- |
| 400    | `VALIDATION_ERROR`                         | Path/query inválidos; `details` indica cada campo                                      |
| 400    | `INVALID_PAGINATION` · `PAGE_OUT_OF_RANGE` | Paginación inválida o fuera de rango                                                   |
| 404    | `NOT_FOUND` · `ROUTE_NOT_FOUND`            | Recurso o ruta inexistente                                                             |
| 502    | `UPSTREAM_SERVICE_ERROR`                   | `Service` falló o devolvió un formato inesperado (se registra en el log, no se expone) |
| 500    | `INTERNAL_ERROR`                           | Error no previsto                                                                      |

## Métricas del dashboard

Se calculan sobre **todas** las solicitudes del usuario (`domain/requests/entities/request-metrics.ts`):

| Métrica                                                  | Definición                                                         | Para qué sirve                                       |
| -------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------- |
| `total`                                                  | Cantidad de solicitudes                                            | Volumen                                              |
| `openWorkflows`                                          | Flujo `in_review` + `pending_information`                          | Trabajo sin decisión                                 |
| `pendingInformation`                                     | Flujo `pending_information`                                        | Bloqueadas: requieren que alguien aporte información |
| `highPriorityUnresolved`                                 | Prioridad `high` con resolución distinta de `resolved`/`cancelled` | Lo urgente que sigue abierto                         |
| `approvalRate`                                           | aprobadas / (aprobadas + rechazadas); `null` si no hay decisiones  | Calidad de las solicitudes que llegan                |
| `byWorkflowStatus` · `byResolutionStatus` · `byPriority` | Conteo por valor (todos los valores, incluso en 0)                 | Distribución                                         |
| `byCategory`                                             | Conteo por categoría, de mayor a menor                             | Dónde se concentra la demanda                        |
| `byMonth`                                                | Conteo por mes `YYYY-MM` de creación                               | Tendencia del volumen                                |

El mes se toma de la fecha **local** del solicitante (el offset de `created_at`), no de UTC, para que una solicitud del 30/06 23:30 −03:00 no caiga en julio.

## Arquitectura

```
src/
  domain/            Entidades, value objects (Pagination), reglas (métricas, filtros, estados abiertos) y errores
  application/       Casos de uso (uno por archivo), puertos (repositorios), DTOs y RequestComposer
  infrastructure/
    http/            Definición de rutas + esquemas Zod → router Express y OpenAPI; middleware de errores
    persistence/     Repositorios sobre Service: validan su respuesta con Zod y traducen 400/404
    services/        Cliente de Service y decorador con caché
  config/            Variables de entorno validadas
  composition.ts     Cableado de repositorios y casos de uso (lo usan main y los tests)
  app.ts             Crea la app sin escuchar puerto
  main.ts            Crea el Service real + caché, inyecta y levanta el servidor
```

### Decisiones

- **Un solo origen para validación y docs.** Cada ruta se declara con `defineRoute` (path, esquemas de params/query/respuesta y handler). De esa lista salen el router de Express y el OpenAPI, así que la documentación no puede desincronizarse. El tipo de retorno del handler se verifica en compilación contra el esquema de respuesta.
- **Leer todo para filtrar bien.** Los filtros se aplican al conjunto completo, así que el repositorio lee todas las solicitudes del usuario en lotes de 100: la primera página da el `total` y el resto se pide en paralelo.
- **Mínimas llamadas a `Service`** (cada una tarda 0,5–3 s):
  - `RequestComposer` deduplica ids y resuelve categorías, flujos y resoluciones en paralelo.
  - Prioridad y categoría se filtran con datos propios de la solicitud, antes de resolver referencias.
  - Sin filtro de estado, solo se resuelven los flujos de la página pedida.
  - Las resoluciones solo se piden para el detalle y las métricas.
- **Caché TTL en memoria** (`CachedOperationsService`): guarda promesas, de modo que llamadas concurrentes iguales (p. ej. dashboard y listado a la vez) comparten una sola petición; los errores no se cachean. La primera carga del listado tarda ~2,8 s y las siguientes, ~70 ms.
- **No confiar en la fuente.** Las respuestas de `Service` se validan con Zod en los adaptadores; si el formato es inesperado, la API responde `502` en vez de propagar datos corruptos.
- **Usuario sin solicitudes.** `Service` responde 400 en la página 1 cuando la lista está vacía; el adaptador lo traduce a una lista vacía.
- **TypeScript 6.0** y no 7: `typescript-eslint` todavía no soporta TS 7. `noUncheckedIndexedAccess` no se activa porque rompe el tipado de `moks/index.ts`, que no se puede modificar.

### Tests

- `test/domain`: paginación y cálculo de métricas.
- `test/application`: filtros antes de paginar, lotes de más de 100 y número de llamadas a `Service`.
- `test/infrastructure`: caché (deduplicación, TTL, errores no cacheados).
- `test/http`: todos los endpoints con Supertest y un doble de `Service` sin latencia que usa los datos de `moks/`.
- `test/integration`: prueba de humo contra el `Service` real.

### Próximas iteraciones

- Autenticación: hoy el `userId` viaja en la ruta y no se verifica contra el usuario autenticado.
- Límite de tamaño para la caché (LRU) e invalidación explícita.
- Logging estructurado (pino) con request id.
- Rate limiting.
