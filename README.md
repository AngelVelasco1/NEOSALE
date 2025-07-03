# 🛠️ NEOSALE – Setup y Desarrollo

Este documento te guía paso a paso para levantar y trabajar con el proyecto **NEOSALE**, que utiliza **Next.js (frontend)**, **Express (backend)**, **Prisma ORM** y **PostgreSQL**, entre otros.

---

## 📦 Requisitos previos

* Node.js >= 18
* PostgreSQL (local o remoto)
* Git

---

## 📁 Estructura del proyecto

```
NEOCOMMERCE/
├── backend/             # Servidor Express + Prisma
├── frontend/            # Aplicación Next.js + Auth.js
├── package.json         # Scripts globales

```

---

## 🚀 1. Clonar el repositorio y preparar entorno

```bash
git clone <repo-url>
cd NEOCOMMERCE
```

Instala las dependencias raíz:

```bash
npm install
```

---

## 📦 2. Instalar dependencias en cada subproyecto

### Backend:

```bash
cd backend
npm install
```

### Frontend:

```bash
cd ../frontend
npm install
```

---

## 🔐 3. Variables de entorno

### Backend `.env` (ubicado en `/backend/.env`)
```
DATABASE_URL=postgresql://usuario:password@localhost:5432/neocommerce
JWT_SECRET=alguna_clave_segura
```
### Frontend `.env.local` (ubicado en `/frontend/.env.local`)
```
NEXT_PUBLIC_HOST="localhost"
NEXT_PUBLIC_PORT=8000
NEXT_PUBLIC_FRONT_PORT=3000
NEXT_PUBLIC_JWT_SECRET="angelvlk"
AUTH_SECRET=""
```
## 🔧 4. Comandos Prisma (ejecutar desde `/backend`)

### Inicializar cliente:

```bash
npm run prisma:generate
```

### Ejecutar migraciones:

```bash
npm run prisma:migrate
```

### Ver base de datos (modo visual):

```bash
npm run prisma:studio
```

Estos scripts ya están definidos en `backend/package.json`:

```json
"scripts": {
  "prisma:generate": "prisma generate --schema=../prisma/schema.prisma --env-file=./.env",
  "prisma:migrate": "prisma migrate dev --schema=../prisma/schema.prisma --env-file=./.env",
  "prisma:studio": "prisma studio --schema=../prisma/schema.prisma --env-file=./.env"
}
```

---

## 🧪 5. Levantar el proyecto en desarrollo

Desde la **raíz del proyecto**:

```bash
npm run dev
```

Esto lanza simultáneamente:

* Frontend (Next.js) en `http://localhost:3000`
* Backend (Express) en `http://localhost:4000` (o el puerto que configures)


## 🔄 Otros comandos

### Compilar proyecto (solo frontend):

```bash
npm run build --prefix frontend
```

### Iniciar en modo producción (solo frontend):

```bash
npm run start --prefix frontend
```

## ✅ Checklist al iniciar el proyecto

* [ ] Ejecutaste `npm install` en `raíz`, `frontend` y `backend`
* [ ] Añadir `.env` en `/backend`
* [ ] Añadir `.env.local` en `/frontend`
* [ ] Ejecutaste `npm run prisma:generate`
* [ ] Ejecutaste `npm run prisma:migrate`
* [ ] Ejecutaste `npm run dev` en raíz

