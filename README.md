# CineLab (React + Vite + TypeScript)

CineLab es una aplicación para buscar y explorar películas usando la API de TMDB.  
Esta versión está construida con React, Vite, TypeScript y Tailwind CSS v3 — ideal como proyecto para practicar frontend con consumo de APIs y buenas prácticas.

Estado
- Estado: en desarrollo
- Objetivo: proyecto para aprender React / hooks / testing y para tener un proyecto deployable en portfolio.

Stack principal
- React + Vite + TypeScript
- Tailwind CSS v3
- Axios (HTTP client)
- react-router-dom
- react-hook-form + Zod (formularios y validación)
- Vitest + Testing Library (tests)
- ESLint + Prettier (lint & format)
- Bun (gestor de paquetes / runtime) — comandos mostrados asumen Bun

Requisitos
- Bun instalado (recomendado) o Node.js + npm si lo prefieres
- Cuenta en The Movie Database (TMDB) para obtener VITE_TMDB_API_KEY

Instalación y setup (rápido)
```bash
# clonar (si aún no lo hiciste)
git clone git@github.com:TU_USUARIO/TU_REPO.git
cd TU_REPO

# instalar dependencias (con Bun)
bun install

# crear el .env local a partir del ejemplo
cp .env.example .env
# editar .env y poner tu VITE_TMDB_API_KEY

# correr en desarrollo
bun dev
# abrir http://localhost:5173
```

Scripts útiles (package.json)
- `bun dev` — arranca Vite en modo desarrollo  
- `bun build` — build de producción (Vite)  
- `bun preview` — preview del build  
- `bun test` ��� ejecutar tests con Vitest  
- `bun run lint` — ejecutar ESLint  
- `bun run lint:fix` — ESLint -> --fix  
- `bun run format` — aplicar Prettier

Variables de entorno (ejemplo)
- `.env.example` incluye:
```
VITE_TMDB_API_KEY=
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```
En tu código usa: `import.meta.env.VITE_TMDB_API_KEY`

Tailwind
- Tailwind v3 está configurado en este proyecto. El CSS base está en `src/index.css` con:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
- Si migras a Tailwind v4 en el futuro, hacelo en una branch separada.

Buenas prácticas del repo
- No subir claves: usa `.env` local + `.env.example` comiteado.
- Mantener `bun.lock` comiteado para reproducibilidad.
- Branch naming: `feature/<short-desc>`; commits con Conventional Commits.
- Añadir tests mínimos para la lógica no trivial.

Contribuir
1. Crea una branch: `git checkout -b feature/mi-cambio`
2. Hacé cambios, lintea y formatea: `bun run lint:fix && bun run format`
3. Commit claro: `git commit -m "feat(search): add useSearchMovies hook"`
4. Abrí un PR y describí los cambios.

Recursos
- Documentación Vite: https://vitejs.dev  
- Tailwind CSS: https://tailwindcss.com  
- TMDB API: https://developers.themoviedb.org

Licencia
Este repositorio usa la licencia MIT — ver archivo `LICENSE`.

Contacto
- Autor: ezefernandezyf