# Prueba técnica Full Stack en vivo

Esta prueba evalúa cómo resolvés un problema full stack de negocio en una sesión en vivo: desde la experiencia de usuario hasta la API y la composición de datos. Priorizamos una solución simple, correcta, mantenible y bien documentada.

## Entregable

Trabajá sobre este repositorio durante la sesión. Al finalizar, el código debe quedar disponible para revisión en el mismo entorno.

Incluí instrucciones claras para instalar, ejecutar y testear la solución, junto con los requisitos de entorno necesarios.

## Tecnologías requeridas

- Frontend: React creado con Vite.
- Backend: Node.js. Podés usar NestJS u otro framework de Node.js si justificás la elección en el README de tu entrega.

Podés elegir libremente librerías de UI, persistencia, estructura interna y contratos HTTP, siempre que documentes las decisiones relevantes.

## Modalidad de la prueba y uso de IA

Esta es una prueba técnica en vivo con una duración máxima de **1 hora**.

- Timebox: 60 minutos.
- No es necesario completar una solución productiva: priorizá los flujos, decisiones y casos que mejor demuestren tu criterio técnico dentro del tiempo disponible.
- Explicá brevemente las decisiones relevantes mientras trabajás y señalá los supuestos o funcionalidades que dejarías para una siguiente iteración.
- Podés usar asistentes de IA. Indicá qué usaste y para qué, y asegurate de poder explicar y defender cada decisión y fragmento de código generado o incorporado.

## Contexto

Vas a construir un **Centro de Solicitudes Operativas** para que un operador pueda consultar y dar seguimiento a solicitudes internas. Este repositorio incluye el servicio `Service` y datos mock asíncronos que deberás consumir desde tu backend. No modifiques los mocks ni `Service`: durante la revisión se usará una copia equivalente de estos archivos.

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

### Backend

Definí los endpoints necesarios para el frontend y usá `Service` como fuente de datos. El diseño de las rutas, DTOs, validaciones y composición de respuestas queda a tu criterio.

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

## Criterios de evaluación

- Correctitud funcional y composición de datos.
- Diseño de API, validación de entradas y manejo explícito de errores.
- Uso apropiado de estructuras de datos y paginación.
- Rendimiento proporcional al problema: uso eficiente del servicio provisto y prevención de llamadas redundantes.
- Mantenibilidad, legibilidad y escalabilidad proporcional al problema.
- Priorización y comunicación de decisiones dentro del tiempo disponible.
- Experiencia de usuario y accesibilidad básica: estados claros, navegación coherente y semántica mínima.
- Seguridad básica: no exponer secretos, credenciales ni claves de API en el código o la configuración versionada.
- Tests relevantes y documentación reproducible.

El diseño visual es libre. No se evalúa una solución única: nos interesa entender tus decisiones técnicas y cómo abordás los requerimientos.
