import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <header>
        <h1 className="text-3xl font-semibold mb-2">Acerca de CineLab</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          CineLab es un proyecto de portfolio para buscar y explorar películas usando la API de The
          Movie Database (TMDB). Está construido con React, Vite y Tailwind CSS, y muestra buenas
          prácticas en hooks, testing y accesibilidad.
        </p>
      </header>

      <section className="mt-8 space-y-4">
        <p>
          Funcionalidades destacadas: búsqueda con paginación y debounce, favoritos persistidos en
          localStorage, consumo centralizado de la API con interceptors, y tests con Vitest + React
          Testing Library.
        </p>

        <p>
          Este repositorio pretende ser una muestra técnica. Si querés ver el código, visita el
          <Link to="/" className="text-cinematic-action underline ml-1">
            {' '}
            repositorio en GitHub
          </Link>
          .
        </p>

        <h2 className="text-xl font-medium mt-6">Contacto</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Autor: Ezequiel Fernández —{' '}
          <a className="text-cinematic-action underline" href="mailto:ezefernandezyf@gmail.com">
            ezefernandezyf@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}
