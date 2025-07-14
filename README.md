# 🛠️ NEOSALE – Setup y Desarrollo

Este documento te guía paso a paso para levantar y trabajar con el proyecto **NEOSALE**, una solución completa de ecommerce construida con:

- **Next.js (frontend)**
- **Express.js (backend)**
- **Prisma ORM**
- **PostgreSQL**
- **Arquitectura MVC Extendida por Servicios**



## 📦 Requisitos previos

Antes de comenzar, asegúrate de tener instalados:

- ✅ Node.js `>= 18`
- ✅ PostgreSQL instalado y corriendo (local o remoto)
- ✅ Git



## 📁 Estructura del proyecto

```

NEOCOMMERCE/
├── backend/             # Servidor Express con Prisma y lógica de negocio
├── frontend/            # Aplicación Next.js + Tailwind + Auth.js
├── prisma/              # Archivo schema.prisma centralizado
├── .env                 # Variables backend (producción o desarrollo)
├── package.json         # Scripts globales

````



## 🚀 1. Clonar el repositorio

```bash
git clone <REPO-URL>
cd NEOCOMMERCE
````



## 📥 2. Instalar dependencias

Desde la raíz:

```bash
npm install
```

Luego:

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```



## 🔐 3. Configuración de variables de entorno

### 📄 `/backend/.env` (para **desarrollo local**)

```env
DATABASE_URL="postgresql://postgres:PgSena2024@localhost:5432/neosale?schema=public"
JWT_SECRET="clave_segura_local"
HOST="localhost"
PORT=8000
FRONT_PORT=3000
PRISMA_QUERY_ENGINE_BINARY=./node_modules/.prisma/client/query_engine-windows.dll.node
```

### 📄 `/frontend/.env.local`

```env
NEXT_PUBLIC_HOST="localhost"
NEXT_PUBLIC_PORT=8000
NEXT_PUBLIC_FRONT_PORT=3000
NEXT_PUBLIC_JWT_SECRET="clave_segura_local"
AUTH_SECRET="clave_segura_local"
```



### 📄 Variables de entorno para **producción**

#### Backend `/backend/.env`

```env
DATABASE_URL="postgresql://gr_neosale:neo_sale@127.11.2.127:5432/db_neosale?schema=public"
JWT_SECRET="clave_segura_produccion"
HOST="127.11.2.127"
PORT=8000
FRONT_PORT=3000
```

#### Frontend `/frontend/.env.local`

```env
NEXT_PUBLIC_HOST="127.11.2.127"
NEXT_PUBLIC_PORT=8000
NEXT_PUBLIC_FRONT_PORT=3000
NEXT_PUBLIC_JWT_SECRET="clave_segura_produccion"
AUTH_SECRET="clave_segura_produccion"
```


## 🔧 4. Configurar Prisma

Desde la raíz:

### Generar cliente Prisma

```bash
npx prisma generate
```

### Ejecutar migraciones (solo si hiciste cambios en schema.prisma)

```bash
npx prisma migrate
```




## 🧪 5. Ejecutar el proyecto en desarrollo

Desde la raíz del proyecto:

```bash
npm run dev
```

Esto lanzará:

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:8000`



## 📦 6. Compilar para producción

### Frontend

```bash
npm run build --prefix frontend
npm run start --prefix frontend
```

### Backend

```bash
cd backend
npm run build      # Compila TypeScript a JavaScript
npm run start      # Inicia app Express (usa dist/app.js)
```



## ✅ Checklist para iniciar correctamente

✔ `npm install` en raíz, frontend y backend
✔ Archivos `.env` y `.env.local` creados y configurados
✔ Prisma generado con `npm run prisma:generate`
✔ Migraciones aplicadas con `npm run prisma:migrate`
✔ Proyecto levantado con `npm run dev`



