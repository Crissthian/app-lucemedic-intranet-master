# App Lucemedic Intranet

Este proyecto es una aplicación de intranet para **Lucemedic**, desarrollada con **Next.js** y **TypeScript**. La aplicación está diseñada para la gestión médica y administrativa, incluyendo funcionalidades para citas, reportes epidemiológicos, seguimiento de pacientes, y un extenso módulo de estadísticas y gráficos médicos.

## Características Principales

*   **Gestión de Citas:** Módulo para la administración de citas médicas (`/appointments`).
*   **Reportes Epidemiológicos:** Generación y visualización de reportes (`/epidemiological-report`).
*   **Estadísticas:** Tableros completos con gráficos para diversas métricas médicas (IMC, Cardiología, Exámenes de Laboratorio, Audiometría, Espirometría, etc.).
*   **Seguimiento:** Herramientas para el seguimiento de procesos de atención (`/tracking`).
*   **Autenticación:** Sistema de inicio de sesión seguro (`/auth`).
*   **Gestión de Perfiles y Configuraciones:** (`/settings`).

## Tecnologías Utilizadas

El proyecto utiliza un stack moderno basado en React y Next.js:

*   **Framework:** [Next.js 13](https://nextjs.org/) (App Router)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Estado Global:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **UI & Estilos:**
    *   [Material UI (MUI)](https://mui.com/)
    *   [Bootstrap](https://getbootstrap.com/)
    *   [DevExtreme React](https://js.devexpress.com/)
    *   CSS Modules
*   **Gráficos y Visualización:**
    *   CanvasJS
    *   Recharts
    *   React Google Charts
    *   MUI X-Charts
*   **Utilidades:** Moment.js, XLSX (Excel), React Toastify.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

*   [Node.js](https://nodejs.org/) (Se recomienda la versión LTS, v18 o superior).
*   Un gestor de paquetes como `npm` o `yarn`.

## Instalación y Configuración

Sigue estos pasos para levantar el proyecto en tu entorno local:

1.  **Clonar el repositorio:**

    ```bash
    git clone <url-del-repositorio>
    cd app-lucemedic-intranet-master
    ```

2.  **Instalar dependencias:**

    Ejecuta el siguiente comando para instalar todas las librerías necesarias listadas en `package.json`:

    ```bash
    npm install
    # o si usas yarn
    yarn install
    ```

3.  **Configurar variables de entorno:**

    Si el proyecto requiere variables de entorno (por ejemplo, para conectar con una API backend), crea un archivo `.env.local` en la raíz del proyecto y define las variables necesarias.

4.  **Iniciar el servidor de desarrollo:**

    ```bash
    npm run dev
    # o
    yarn dev
    ```

    La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Scripts Disponibles

En el archivo `package.json` encontrarás los siguientes scripts:

*   `npm run dev`: Inicia el servidor de desarrollo en modo watch.
*   `npm run build`: Compila la aplicación para producción.
*   `npm start`: Inicia el servidor de producción (requiere haber ejecutado `build` previamente).
*   `npm run lint`: Ejecuta el linter para encontrar problemas en el código.

## Estructura del Proyecto

Un vistazo rápido a la estructura de carpetas principal:

*   `/app`: Contiene las rutas y páginas de la aplicación (Next.js App Router).
*   `/components`: Componentes reutilizables de UI (Botones, Gráficos, Tablas, Modales, etc.).
*   `/hooks`: Hooks personalizados de React (ej. `useAccessToken`, `useUserProfile`).
*   `/models`: Definiciones de tipos e interfaces TypeScript para los datos.
*   `/redux`: Configuración del store de Redux y slices.
*   `/shared`: Constantes y funciones de utilidad compartidas.
*   `/public`: Archivos estáticos públicos.

## Contribución

1.  Crea una rama para tu nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
2.  Realiza tus cambios y haz commit (`git commit -m 'Agrega nueva funcionalidad'`).
3.  Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
4.  Abre un Pull Request.
