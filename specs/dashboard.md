# REGLA GENERAL
- Se debe hacer por paso, backend y luego frontend. Consultar al momento de terminar.



# REGLAS FRONTEND
## Tecnologías requeridas

- Frontend: React creado con Vite. Para los estilos utilizarás tawlindcss, crearás el front responsive (mobile first), React Router, Zustand (para el estado global), React Hook Form + Zod (para formularios), Vitest + Testing Library (test), ESLint + Prettier (validacion de codigo)

## Estructura (por feature)
```
src/
  app/                 Rutas, providers, layout
  features/<feature>/  components/ hooks/ api/ data/ types.ts
  shared/ui/           Componentes base (Button, Input, Card…)
  shared/components/   Componentes usados en todo el sitio (Header, Footer)
  shared/hooks/        Hooks reutilizables
  lib/                 Cliente HTTP, config, utilidades
```

## Componentes
- Un componente por archivo. Componentes pequeños, una responsabilidad.
- Si una parte evoluciona por separado, es su propio componente en una subcarpeta.
- Las variantes reutilizan un componente base; no duplicar estilos ni lógica.
- La lógica va en hooks; los componentes solo renderizan.
- Nada de `any` ni tipos implícitos en props o respuestas de la API.

## Formularios
- Validación con esquema, al salir del campo; mensajes específicos bajo cada campo.
- Al enviar con errores, foco en el primer campo inválido.
- Errores del servidor (422) se muestran en sus campos.
- Confirmaciones con sweetalert.

## Accesibilidad
- HTML semántico, labels visibles, `aria-*` donde corresponda.
- Todo usable con teclado y con foco visible.
- Contraste mínimo AA. Respetar `prefers-reduced-motion`.

## Tests
- Probar comportamiento visible, consultando por rol o texto, no por clases.
- Un test por criterio de aceptación; un archivo de test por feature salvo que crezca mucho.
- E2E solo para flujos críticos, en viewport móvil y escritorio.

## Requisitos funcionales

### Dashboard

Mostrá métricas derivadas de las solicitudes disponibles, de forma que permitan entender rápidamente el volumen y su distribución. Definí y documentá las métricas que consideres más útiles.

### Solicitudes

Implementá una vista `/requests` con:

- Un listado paginado de solicitudes.
- Filtros por estado del flujo, prioridad y categoría.
- Identificador, asunto, solicitante, categoría, prioridad, estado del flujo y fecha de creación para cada elemento.
- Estados de carga, error y lista vacía.
- Una forma de acceder al detalle de una solicitud.

Aplicá los filtros sobre el conjunto completo de solicitudes antes de paginar el resultado.

### Detalle de solicitud

El detalle debe permitir volver al listado y mostrar el solicitante, el identificador, asunto, categoría, prioridad, fecha de creación, estado del flujo y estado de resolución.


# REGLAS BACKEND
## Tecnologías requeridas

- Node.js LTS + TypeScript (strict), Express, Zod
- Swagger UI generado desde los esquemas
- Vitest + Supertest
- ESLint + Prettier

## Arquitectura hexagonal
```
src/
  domain/<modulo>/
    entities/          Entidades y value objects con reglas de negocio
    errors/            Errores de dominio
  application/<modulo>/
    use-cases/         Un archivo por caso de uso
    ports/             Interfaces que el caso de uso necesita (repositorios, servicios)
    dtos/
  infrastructure/
    http/              Rutas, controladores, middlewares, documentación
    persistence/       Implementaciones de los repositorios (adaptador de la BD)
    services/          Adaptadores externos (almacenamiento, email, pagos…)
  config/              Variables de entorno validadas al arrancar
  app                  Crea la app HTTP sin escuchar puerto (para tests)
  main                 Composición: crea adaptadores, inyecta dependencias y levanta el servidor
```


## Requisitos funcionales
- `getUser()`
- `getUserRestrictions(userId)`
- `getUserRequests(userId, limit, page)`
- `getCategory(categoryId)`
- `getWorkflow(workflowId)`
- `getResolution(resolutionId)`

Crea un endpoint por cada metodo en el backend siguiente las siguiente regla general:

## IMPORTANTE DATOS
Define los endpoints necesarios para el frontend y usa `Service` como fuente de datos. El diseño de las rutas, DTOs, validaciones y composición de respuestas queda a tu criterio.

## Servicio provisto

El archivo `Service.ts` y los datos dentro de `moks/` ya están implementados y son la fuente de datos de esta prueba. **No los modifiques, reemplaces ni recrees.** Tu backend debe consumir el servicio provisto y construir sobre él los endpoints que necesite el frontend.

Los siguientes métodos ya existen en `Service` y devuelven datos de forma asíncrona:

- `getUser()`
- `getUserRestrictions(userId)`
- `getUserRequests(userId, limit, page)`
- `getCategory(categoryId)`
- `getWorkflow(workflowId)`
- `getResolution(resolutionId)`

`getUserRequests` devuelve `{ total, offset, limit, data }`. Las páginas fuera de rango o parámetros de paginación inválidos devuelven un error con estado 400; los recursos inexistentes devuelven estado 404.


