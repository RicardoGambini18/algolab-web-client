# Algolab - Web Client

Algolab Web Client es una interfaz de usuario moderna y reutilizable construida con Next.js que permite interactuar con backends que implementen la API de evaluación de algoritmos basada en The Movies Dataset (TMDB). El frontend utiliza **Static Site Generation (SSG)** para generar archivos estáticos que pueden ser servidos desde cualquier servidor web estático.

## 🎯 Características

- **Interfaz moderna y responsiva** construida con React y Tailwind CSS
- **Generación de sitios estáticos (SSG)** para fácil despliegue
- **Reutilizable** con cualquier backend que implemente los endpoints requeridos
- **Autenticación JWT** integrada
- **Visualización de métricas** de algoritmos (tiempo, memoria, operaciones e iteraciones)
- **Soporte para algoritmos de búsqueda y ordenamiento**
- **Tema claro/oscuro** configurable

## 📋 Requerimientos del Sistema

- **Node.js**: 18.0 o superior
- **pnpm**: 8.0 o superior

## 🚀 Instalación y Configuración

### 1. Navegar al Proyecto
Clonar el repositorio o descargarlo y luego ingresar a la carpeta:
```bash
cd algolab-web-client
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# URL del backend API (REQUERIDA)
NEXT_PUBLIC_API_URL=http://localhost:8080

# Configuración opcional
NEXT_PUBLIC_COURSE=Algoritmos y Estructuras de Datos
NEXT_PUBLIC_PASSWORD_HINT=Ingresa el código del curso
```

**Variables de entorno:**

- `NEXT_PUBLIC_API_URL` (requerida): URL base del backend API
- `NEXT_PUBLIC_COURSE` (opcional): Nombre del curso que se mostrará como sugerencia en la interfaz
- `NEXT_PUBLIC_PASSWORD_HINT` (opcional): Texto de ayuda para la contraseña en el formulario de login

## 🏃‍♂️ Desarrollo Local

Para ejecutar el proyecto en modo desarrollo:

```bash
pnpm dev
```

La aplicación estará disponible en http://localhost:3000

**Nota:** Asegúrate de que el backend esté corriendo y accesible en la URL configurada en `NEXT_PUBLIC_API_URL` antes de usar la aplicación.

## 🏗️ Generación de Archivos Estáticos (SSG)

Este proyecto utiliza **Static Site Generation (SSG)** para generar archivos estáticos que pueden ser servidos desde cualquier servidor web estático. Los archivos generados pueden ser utilizados tanto para:

- **Uso local**: Integración con backends de Algolab que sirven el frontend estático
- **Despliegue en producción**: Servir desde servidores web estáticos (Nginx, Apache, Vercel, Netlify, etc.)

### Generar Archivos Estáticos

```bash
pnpm build
```

El proceso de compilación generará una carpeta `out/` con todos los archivos estáticos listos para ser servidos. Esta carpeta puede ser copiada a la carpeta `frontend/` de un backend de Algolab o desplegada directamente en un servidor web estático.

## 📡 Endpoints de API Requeridos

Para que este frontend funcione correctamente, el backend debe implementar los siguientes endpoints:

### Autenticación

- `GET /api/users` - Obtener todos los usuarios disponibles
- `POST /api/users/login` - Iniciar sesión y obtener token JWT
  - Body: `{ "user_id": number, "password": string }`
  - Response: `{ "token": string }`

### Películas

- `GET /api/movies` - Obtener todas las películas disponibles
  - Requiere autenticación (Bearer token)

### Algoritmos de Ordenamiento

- `GET /api/movies/sort/data-structures` - Obtener algoritmos de ordenamiento disponibles
  - Requiere autenticación
  - Response: Array de `DataStructure` con algoritmos disponibles

- `GET /api/movies/sort` - Ejecutar algoritmo de ordenamiento
  - Requiere autenticación
  - Query params:
    - `algorithm_key`: string (ej: `"bubble_sort"`)
    - `data_structure_key`: string (ej: `"vector"`)
    - `include_result`: boolean (opcional, por defecto `false`)
  - Response: `AlgorithmResult<Movie>`

### Algoritmos de Búsqueda

- `GET /api/movies/search/data-structures` - Obtener algoritmos de búsqueda disponibles
  - Requiere autenticación
  - Response: Array de `DataStructure` con algoritmos disponibles

- `GET /api/movies/search` - Ejecutar algoritmo de búsqueda
  - Requiere autenticación
  - Query params:
    - `movie_id`: number (ID de la película a buscar)
    - `algorithm_key`: string (ej: `"linear_search"`)
    - `data_structure_key`: string (ej: `"vector"`)
    - `include_result`: boolean (opcional, por defecto `false`)
  - Response: `AlgorithmResult<Movie>`

## 🔧 Scripts Disponibles

- `pnpm dev` - Ejecutar servidor de desarrollo
- `pnpm build` - Compilar para producción (genera carpeta `out/`)
- `pnpm start` - Ejecutar servidor de producción (requiere build previo)
- `pnpm lint` - Ejecutar linter y corregir errores automáticamente
- `pnpm format` - Formatear código con Prettier
- `pnpm typecheck` - Verificar tipos de TypeScript sin compilar

## 🎨 Tecnologías Utilizadas

- **Next.js 16** - Framework React con SSG
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Radix UI** - Componentes accesibles
- **TanStack Query** - Manejo de estado del servidor
- **Zustand** - Manejo de estado global
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

## 📁 Estructura del Proyecto

```
algolab-web-client/
├── src/
│   ├── api/              # Clientes de API
│   ├── app/              # Páginas y layouts (App Router)
│   ├── components/       # Componentes reutilizables
│   ├── lib/              # Utilidades y configuraciones
│   ├── types/            # Definiciones de TypeScript
│   └── validations/      # Esquemas de validación
├── public/               # Archivos estáticos
├── out/                  # Build de producción (generado)
├── next.config.ts        # Configuración de Next.js
├── tsconfig.json         # Configuración de TypeScript
└── package.json          # Dependencias y scripts
```

## 🔐 Autenticación

El frontend utiliza autenticación basada en JWT. El flujo es el siguiente:

1. El usuario selecciona un usuario de la lista disponible
2. Ingresa la contraseña (generalmente el código del curso)
3. Se envía una petición `POST /api/users/login` con `user_id` y `password`
4. El backend responde con un token JWT
5. El token se almacena y se incluye automáticamente en todas las peticiones subsiguientes mediante el header `Authorization: Bearer <token>`
6. Si el token expira o es inválido (401), el usuario es deslogueado automáticamente
