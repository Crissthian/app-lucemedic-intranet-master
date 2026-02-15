Diagnóstico inicial (con lista priorizada):

Identifica problemas típicos por esta stack: seguridad (JWT, Nodemailer, acceso a red), performance (moment, charts, DevExtreme), arquitectura (server/client boundaries), deuda técnica y DX.

Entrega una lista priorizada: P0 (crítico), P1, P2 con explicación breve y impacto.

Arquitectura recomendada (Next 16 / App Router):

Propón estructura de carpetas (ej: app/, features/, lib/, server/, components/, types/, styles/, docs/).

Define reglas claras de separación:

qué va en Server Components, qué en Client Components

dónde ubicar acceso a mssql, jwt, nodemailer, ftp/samba, winston

Incluye ejemplo de “límite” (boundary) para evitar que dependencias sensibles se filtren al bundle del cliente.

Buenas prácticas de código (con ejemplos concretos):

Redux Toolkit: store, slices, RTK Query (si aplica), selectors memoizados, normalización, patrones por feature.

Manejo de fechas: recomienda estrategia (y si conviene migrar gradualmente desde moment).

Charts (Recharts / Google Charts): lazy loading, memoization, evitar renders costosos.

DevExtreme: organización de componentes, wrappers, performance, virtual scrolling donde aplique.

Exportaciones (xlsx/html2canvas/file-saver): ejecución solo en cliente, control de memoria, UX (loading/cancel).

Logging con Winston: formato, niveles, correlation id, evitar logs de PII.

Seguridad (muy importante):

JWT: dónde firmar/verificar, expiración/refresh, almacenamiento seguro, rotación de secretos.

Emails con Nodemailer: plantillas seguras, rate limiting, evitar SSRF, manejo de errores.

Conexión MSSQL: pool, parámetros (evitar SQL injection), timeouts, reintentos, circuit breaker básico.

FTP/Samba: sanitización de rutas, manejo de credenciales, restricciones de acceso, auditoría.

Variables de entorno: checklist y ejemplo de validación tipada (sin exponer secretos al cliente).

Señala “red flags” concretas si detectas patrones peligrosos.

Performance & calidad:

División de bundles: dynamic imports, next/dynamic, evitar dependencias pesadas en cliente.

Caching: estrategia por fetch (si aplica), memoización, headers en API routes, edge vs node cuando corresponda.

Reglas para evitar “client explosion” (marcar solo lo mínimo con "use client").

Estandarización y documentación:

Genera un README.md pro (instalación, scripts, env vars, arquitectura, convenciones).

Genera CONTRIBUTING.md (branching, commits, PR checklist).

Genera docs/ARCHITECTURE.md (decisiones, diagramas en texto, boundaries).

Genera docs/SECURITY.md (amenazas y mitigaciones, manejo de secretos).

Opcional: guía docs/STYLEGUIDE.md (naming, estructura, patterns).
