# CineLab (React + Vite + TypeScript)

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![Tests](https://img.shields.io/badge/tests-passing-brightgreen) ![Coverage](https://img.shields.io/badge/coverage-85%25-yellow) ![License](https://img.shields.io/badge/license-MIT-blue)

CineLab es una aplicación para buscar y explorar películas usando la API de TMDB.  
Construida con React, Vite, TypeScript y Tailwind CSS — pensada como proyecto de portfolio para demostrar buenas prácticas en consumo de APIs, testing automatizado y hooks personalizados.

Demo

- Demo (producción): https://cinelab-movies.vercel.app/
- Código (GitHub): https://github.com/ezefernandezyf/cinelab-react

Estado

- Estado: listo para release / production-ready (pruebas, accesibilidad y CI configuradas).
- Objetivo: proyecto de portfolio para mostrar consumo de APIs, patrones de hooks, testing y despliegue.

Características principales

- Búsqueda con debounce y paginación.
- Consumo centralizado de la API TMDB (axios + interceptors).
- Favoritos con persistencia en localStorage y página dedicada.
- Hooks reutilizables: `useApi`, `useSearchMovies`, `useFavorites`, `useTheme`, etc.
- Tests unitarios e integración con Vitest + React Testing Library.
- Accesibilidad (a11y) y buenas prácticas según Lighthouse.
- Logger centralizado configurable (silenciado por defecto en producción).

Tecnologías

- React, Vite, TypeScript, Tailwind CSS
- Axios, react-router-dom, react-hook-form, zod
- Vitest + React Testing Library
- Runtime: Bun (se admiten npm/yarn)
- Deploy recomendado: Vercel

Screenshots / GIF

  ![Home Desktop](/src/assets/screenshots/home-desktop.png)  

  ![Search Desktop](/src/assets/screenshots/search-desktop.png)  

  ![Detail Desktop](/src/assets/screenshots/detail-desktop.png)  

  ![Home Mobile](/src/assets/screenshots/home-mobile.png)  

  ![Search Flow GIF](/src/assets/gifs/search-flow.gif)  


Instalación y desarrollo local
Recomendado: Bun (rápido), pero funciona con npm/yarn.

```bash
# clonar
git clone git@github.com:ezefernandezyf/cinelab-react.git
cd cinelab-react

# instalar dependencias (Bun)
bun install
# o con npm
# npm ci
```

Copiar variables de entorno

```bash
cp .env.example .env
# editar .env y añadir VITE_TMDB_API_KEY
```

Arrancar en desarrollo

```bash
# desarrollo
bun run dev
# o npm run dev
```

Build y preview

```bash
# build producción
bun run build
# preview del build
bun run preview
```

Scripts útiles (package.json)

- `dev` — arranca Vite en modo desarrollo
- `build` — build de producción
- `preview` — preview del build
- `test` — ejecutar tests con Vitest
- `test:coverage` — tests + coverage
- `lint` / `lint:fix` — ESLint
- `format` — Prettier

Variables de entorno

- Usa Vite env vars (prefijo VITE\_). No subas claves al repo (usa `.env` local y `.env.example` comiteado).
- Ejemplo en `.env.example` (ver archivo del repo):

```
VITE_TMDB_API_KEY=
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_APP_NAME=CineLab
# Optional: enable logs in production (use carefully)
VITE_ENABLE_LOGS=false
```

- En código acceder con:

```ts
const apiKey = import.meta.env.VITE_TMDB_API_KEY;
```

Testing

- Ejecutar tests:

```bash
bun run test
# o con npm: npm run test
```

- Ejecutar coverage:

```bash
bun run test:coverage
```

- Nota: los tests mockean las llamadas a la API para que sean deterministas en CI.

Estructura destacada

- `src/components` — componentes reutilizables (MovieCard, MovieList, Header, Footer, Modal, Toast)
- `src/hooks` — hooks personalizados (useApi, useSearchMovies, useFavorites, useTheme, useToast)
- `src/services` — cliente API (initAxios, apiGet) y servicios (movie.service.ts)
- `src/pages` — páginas (HomePage, SearchPage, MovieDetailPage, FavoritesPage)
- `src/utilities` — utilitarios (logger, loadAbort)

Accesibilidad y calidad

- Se realizaron auditorías Lighthouse (Accessibility >= 95).
- Controles accesibles: roles, aria-live en toasts, manejo de focus en modales y teclado (tab navigation) implementados.

Deploy (Vercel)

- Recomendado: Vercel. Añadí las variables en Settings > Environment Variables:
  - VITE_TMDB_API_KEY
  - VITE_TMDB_BASE_URL (opcional)
  - VITE_ENABLE_LOGS (si necesitas logs puntuales)
- `vercel.json` ya incluye rewrite para soporte SPA (client-side routing).

Contribuir

1. Crea branch: `git checkout -b feature/mi-cambio`
2. Formatea y lint: `bun run lint:fix && bun run format`
3. Commit claro: `git commit -m "feat(search): add useSearchMovies hook"` (Conventional Commits)
4. Abrí PR contra `main` y solicita review.

Checklist para PR (ejemplo)

- [ ] CI pasa (lint, tests, build)
- [ ] No hay claves en el repo (.env no comiteado)
- [ ] PR pequeño y testeable
- [ ] Update README si aplica (nuevas variables/env o features)

Licencia

- MIT — ver archivo `LICENSE`.

Contacto

- Autor: Ezequiel Fernández — https://github.com/ezefernandezyf
- Email: ezefernandezyf@gmail.com

Recursos

- Vite: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- TMDB API: https://developers.themoviedb.org
- Vitest: https://vitest.dev
