# Resumen de Migracion a Next.js 16

Fecha: 2026-02-15

## Estado

- Migracion tecnica completada a `next@16.1.6`.
- Runtime alineado a `Node 24.x`.
- ESLint removido intencionalmente (se agregara mas adelante).
- Build de produccion y typecheck en verde.

## Cambios aplicados

1. Upgrade de framework/runtime
- `next` -> `16.1.6`
- `react` / `react-dom` -> `19.2.4`
- `@next/third-parties` -> `16.1.6`

2. Eliminacion de ESLint
- Eliminado script `lint`.
- Eliminados `eslint` y `eslint-config-next`.
- Eliminado archivo `.eslintrc.json`.

3. Limpieza conservadora de dependencias
- Removidas dependencias sin uso directo en codigo:
  - `@canvasjs/charts`
  - `@canvasjs/react-charts`
  - `@emotion/react`
  - `@emotion/styled`
  - `@mui/material`
  - `@mui/x-charts`
  - `bootstrap`
  - `react-table`
  - `reflect-metadata`
  - `xlsx`
  - `xlsx-style`
  - `@types/react-table`
  - `@types/xlsx`

4. Ajustes de compatibilidad Next 16
- Rutas dinamicas App Router ajustadas a `params: Promise<...>` y `await params`.
- `themeColor` movido a `viewport` en `app/layout.tsx`.
- Script de Hotjar migrado a `next/script` con `strategy="afterInteractive"`.
- `tsconfig.json` actualizado por Next 16 (`jsx: react-jsx`, includes de `.next/dev/types`).

5. Estabilizacion React 19
- `@reduxjs/toolkit` -> `2.11.2`
- `react-redux` -> `9.2.0`
- `react-datepicker` -> `9.1.0` (usa tipos propios)
- `react-toastify` -> `11.0.5`
- `react-google-charts` -> `5.2.1`
- `recharts` -> `3.7.0` (se agrego `react-is` como dependencia explicita)
- `nodemailer` -> `8.0.1`
- `devextreme` -> `25.2.4`
- `devextreme-react` -> `25.2.4`
- `@fortawesome/fontawesome-svg-core` -> `7.2.0`
- `@fortawesome/free-solid-svg-icons` -> `7.2.0`
- `@fortawesome/react-fontawesome` -> `3.2.0`
- `moment-timezone` -> `0.6.0`

## Verificaciones ejecutadas

- `npm run typecheck` -> OK
- `npm run build` -> OK
- `GET /api/health` en server de produccion -> `200 OK`
- `npm outdated` -> sin pendientes

## Pendientes deliberadamente no aplicados (por riesgo funcional)

- Ninguno a nivel de upgrades mayores detectados por `npm outdated`.

## Nota operativa

- Se omitio validacion funcional manual (smoke) por instruccion del usuario.
