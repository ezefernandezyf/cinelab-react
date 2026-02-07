# CineLab (React + Vite + TypeScript)

CineLab es una aplicación para buscar y explorar películas usando la API de TMDB.  
Construida con React, Vite, TypeScript y Tailwind CSS — pensada como proyecto de portfolio para demostrar buenas prácticas en consumo de APIs, testing y hooks personalizados.

Live demo
[- Demo (producción) ](https://cinelab-movies.vercel.app/)

[- Código (GitHub) https://github.com/ezefernandezyf/cinelab-react](https://github.com/ezefernandezyf/cinelab-react)

Estado
- Estado: en desarrollo
- Objetivo: proyecto para aprender React/hooks/testing y tener una app deployable para portfolio.
- Nota: la funcionalidad de "Favoritos" está implementada (persistencia y página /favorites). UX adicional (toasts/animaciones/ajustes de diseño) se completará en próximos sprints.

Características principales
- Búsqueda de películas con debounce y paginación.
- Consumo centralizado de la API de TMDB (axios + interceptors).
- Favoritos con persistencia en localStorage y página dedicada.
- Componentes reutilizables y testeables (MovieCard, MovieList).
- Tests unitarios e integración con Vitest + React Testing Library.
- Buenas prácticas: Prettier, ESLint, Conventional Commits.

Stack tecnológico
- Frontend: React, Vite, TypeScript, Tailwind CSS
- HTTP: axios (initAxios + apiGet)
- Routing: react-router-dom
- Forms & validation: react-hook-form + Zod (cuando aplica)
- Testing: Vitest + React Testing Library
- Runtime / package manager: Bun (se puede usar npm/yarn en Vercel)
- Deploy: Vercel (recomendado)

Demo / Deploy
- Deploy recomendado: Vercel (protegé tu API key en Settings > Environment Variables).
- Añadí en Vercel las variables:
  - VITE_TMDB_API_KEY
  - VITE_TMDB_BASE_URL (opcional, por defecto https://api.themoviedb.org/3)
- Archivo para SPA routing: `vercel.json` (ya incluido) hace rewrite a index.html para rutas del cliente.

Instalación y desarrollo local
Recomendado: Bun (pero funciona con npm también).

```bash
# clonar
git clone git@github.com:ezefernandezyf/cinelab-react.git
cd cinelab-react

# instalar dependencias (Bun)
bun install
# o con npm
# npm ci

# copiar variables de entorno
cp .env.example .env
# editar .env y poner VITE_TMDB_API_KEY

# desarrollo
bun dev
# o
# npm run dev

# build de producción
bun build
# preview del build
bun preview
```

Scripts (package.json)
- `dev` — arranca Vite en modo desarrollo  
- `build` — build de producción (Vite)  
- `preview` — preview del build  
- `test` — ejecutar tests con Vitest  
- `lint` / `lint:fix` — ESLint  
- `format` — Prettier

Variables de entorno
- `.env.example` incluye:
```
VITE_TMDB_API_KEY=
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_APP_NAME=CineLab
```
En código acceder con `import.meta.env.VITE_TMDB_API_KEY`.

Testing
- Ejecutá la suite de tests:
  - `bun test` o `npm run test`
- Tests están aislados y mockean llamadas externas (evitan usar la API real en CI).

Buenas prácticas del repo
- No subir claves: usar `.env` local + `.env.example` comiteado.
- Mantener `bun.lock`/`package-lock.json` comiteado.
- Branch naming: `feature/<short-desc>`; commits con Conventional Commits.
- Añadir tests para lógica no trivial y mantener PRs pequeños.

Estructura destacada
- `src/components` — componentes reutilizables (MovieCard, MovieList, etc.)
- `src/hooks` — hooks personalizados (useSearchMovies, useFavorites, useApi)
- `src/services` — cliente API (initAxios, apiGet) y `movie.service.ts`
- `src/pages` — páginas (SearchPage, FavoritesPage, HomePage)

Contribuir
1. Crear branch: `git checkout -b feature/mi-cambio`
2. Formatear y lint: `bun run lint:fix && bun run format`
3. Commit claro: `git commit -m "feat(search): add useSearchMovies hook"`
4. Abrir PR contra `main` y solicitar review.

Recursos
- Vite: https://vitejs.dev  
- Tailwind CSS: https://tailwindcss.com  
- TMDB API: https://developers.themoviedb.org  
- Vitest: https://vitest.dev

Licencia
Este repositorio usa la licencia MIT — ver archivo `LICENSE`.

Contacto
- Autor: Ezequiel Fernández — https://github.com/ezefernandezyf  
- Email: ezefernandezyf@gmail.com
