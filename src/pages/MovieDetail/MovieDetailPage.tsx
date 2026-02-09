import { Link, useParams } from 'react-router-dom';
import useMovieDetail from '../../hooks/useMovieDetail';
import { useFavoritesContext } from '../../hooks/useFavoritesContext';
import { useState, useRef } from 'react';
import Modal from '../../components/Modal/Modal';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function MovieDetailPage(): React.JSX.Element {
  const { id } = useParams();
  const movieId = id ? Number(id) : undefined;
  const { details, credits, similar, loading, error, refetch } = useMovieDetail(movieId);
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const [openTrailer, setOpenTrailer] = useState(false);

  const trailerBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const trailerKey = undefined;

  if (loading) {
    return (
      <main className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <p className="text-red-600">Error cargando la película.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
        >
          Reintentar
        </button>
      </main>
    );
  }

  if (!details) {
    return <main className="p-6">Película no encontrada.</main>;
  }

  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : undefined;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">{details.title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {details.release_date ? details.release_date.slice(0, 4) : ''}
            {details.runtime ? ` • ${details.runtime} min` : ''}
            {details.genres?.length ? ` • ${details.genres.map((g) => g.name).join(', ')}` : ''}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            aria-pressed={isFavorite(details.id)}
            onClick={() => toggleFavorite(details.id)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {isFavorite(details.id) ? '★' : '☆'}
            <span className="text-sm">
              {isFavorite(details.id) ? 'Favorito' : 'Agregar a favoritos'}
            </span>
          </button>

          <button
            ref={trailerBtnRef}
            onClick={() => setOpenTrailer(true)}
            className="px-3 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            Ver trailer
          </button>

          <Link to="/" className="text-sm text-slate-600 dark:text-slate-300 hover:text-sky-600">
            Volver
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${details.title} poster`}
              className="w-full rounded-md shadow-sm"
            />
          ) : (
            <div className="w-full h-72 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center">
              <span className="text-slate-500">No image</span>
            </div>
          )}
        </div>

        <div>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Sinopsis</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {details.overview}
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-medium mb-3">Reparto</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {credits?.cast?.slice(0, 6).map((actor) => (
                <li key={actor.cast_id} className="flex items-center gap-3">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w92${actor.profile_path}`
                        : '/placeholder.png'
                    }
                    alt={actor.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="text-sm">
                    <div className="font-medium">{actor.name}</div>
                    <div className="text-xs text-slate-500">{actor.character}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-3">Similares</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {similar?.results?.slice(0, 8).map((m) => (
                <article key={m.id} className="space-y-2">
                  <Link to={`/movie/${m.id}`} className="block">
                    <img
                      src={
                        m.poster_path
                          ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                          : '/placeholder.png'
                      }
                      alt={m.title}
                      className="w-full h-40 object-cover rounded"
                    />
                    <h4 className="text-sm mt-1">{m.title}</h4>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <Modal
        open={openTrailer}
        onClose={() => setOpenTrailer(false)}
        title={`Trailer de ${details.title}`}
        initialFocusRef={closeBtnRef}
      >
        <div className="relative">
          <button
            ref={closeBtnRef}
            aria-label="Cerrar trailer"
            onClick={() => setOpenTrailer(false)}
            className="absolute right-3 top-3 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow hover:bg-white dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 z-20"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="pt-[56.25%] relative">
            {trailerKey ? (
              <iframe
                className="absolute inset-0 w-full h-full border-0"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                title={`Trailer de ${details.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  No hay trailer disponible
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </main>
  );
}
