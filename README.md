# Intranet Lucemedic (Unificado)

Aplicacion unificada en Next.js 13 (App Router) que consolida:
- Frontend `app-lucemedic-intranet-master`
- API Auth `api-lucemedic-intranet-auth-master`
- API Portal `api-lucemedic-portal-master-main`

## Requisitos
- Node.js 18+
- npm

## Instalacion
```bash
npm install
```

## Variables de entorno
1. Copiar `.env.example` a `.env.local`.
2. Completar credenciales de BD, JWT, FTP, Samba y correo.
3. No definir `API_BASE_PATH` ni `API_PATH_LUCEMEDIC`: el frontend consume la API interna con rutas relativas `/api`.

## Desarrollo
```bash
npm run dev
```

## Build de produccion
```bash
npm run build
npm start
```

## Estructura relevante
- `app/`: paginas y route handlers de Next.js.
- `app/api/`: endpoints migrados desde Koa a handlers nativos.
- `src/server/`: logica de negocio, servicios, repositorios y utilidades server-only.

## Notas
- El frontend consume la API interna via rutas relativas `/api`.
- La conexion SQL en `src/server/shared/database.ts` usa singleton para evitar reconexiones durante HMR.
