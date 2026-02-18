import { Link } from 'react-router-dom';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <section className="max-w-3xl mx-auto py-16 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-700 dark:text-slate-200">
        Página no encontrada
      </h2>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        La ruta que buscas no existe o fue movida. Prueba buscar otra película o vuelve al inicio.
      </p>

      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 rounded-md bg-cinematic-action text-white hover:bg-cinematic-action-600 focus:outline-none focus:ring-2 focus:ring-cinematic-action-600 transition"
        >
          Volver a inicio
        </Link>

        <Link
          to="/search"
          className="inline-flex items-center px-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cinematic-action transition"
        >
          Buscar películas
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
