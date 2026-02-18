import { Link, useLocation, useParams } from 'react-router-dom';
import { useFavoritesContext } from '../../hooks/useFavoritesContext';
import { useState, useRef } from 'react';
import TrailerModal from '../../components/Modal/TrailerModal';
import useMovieDetail from '../../hooks/useMovieDetail';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import useBack from '../../hooks/useBack';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid, PlayIcon } from '@heroicons/react/24/solid';

export default function MovieDetailPage(): React.JSX.Element {
  const { id } = useParams();
  const movieId = id ? Number(id) : undefined;
  const { details, credits, similar, loading, trailerKey, error, refetch } =
    useMovieDetail(movieId);
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const [openTrailer, setOpenTrailer] = useState(false);

  const trailerBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const location = useLocation();
  type LocState = { from?: string; fromLabel?: string };
  const from = (location.state as LocState | null)?.from;
  const fromLabelState = (location.state as LocState | null)?.fromLabel;

  function mapPathToLabel(path?: string) {
    if (!path || path === '/') return 'Inicio';
    if (path.startsWith('/favorites')) return 'Favoritos';
    if (path.startsWith('/search')) return 'Buscar';
    return 'Resultados';
  }

  const title = details?.title ?? 'Cargando…';
  const inferredLabel = mapPathToLabel(from);
  const secondLabel = fromLabelState ?? inferredLabel;
  const crumbs = [
    { to: '/', label: 'Inicio' },
    ...(from ? [{ to: from, label: secondLabel }] : []),
    { label: title },
  ];

  const goBack = useBack('/');

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
            <div className="w-full h-72 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="space-y-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <p className="text-red-600">Error cargando la película.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-cinematic-action text-white rounded hover:bg-cinematic-action-600 focus:outline-none focus:ring-2 focus:ring-cinematic-action-600 transition"
        >
          Reintentar
        </button>
      </main>
    );
  }

  if (!details) {
    return <main className="max-w-6xl mx-auto p-6">Película no encontrada.</main>;
  }

  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : undefined;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <Breadcrumbs items={crumbs} onBack={() => goBack(from)} />

      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {details.title}
          </h1>
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
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border transition-transform transform motion-safe:duration-200 ${
              isFavorite(details.id)
                ? 'bg-amber-300 text-slate-900 border-amber-300 shadow-md scale-105'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow'
            } focus:outline-none focus:ring-2 focus:ring-cinematic-action`}
            aria-label={isFavorite(details.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <span
              className={`transition-colors duration-200 ${
                isFavorite(details.id) ? 'text-amber-600' : 'text-slate-500 dark:text-slate-200'
              }`}
            >
              {isFavorite(details.id) ? (
                <StarSolid className="w-5 h-5" aria-hidden />
              ) : (
                <StarOutline className="w-5 h-5" aria-hidden />
              )}
            </span>
            <span className="text-sm">{isFavorite(details.id) ? 'Favorito' : 'Favoritos'}</span>
          </button>

          <button
            ref={trailerBtnRef}
            onClick={() => {
              if (trailerKey) setOpenTrailer(true);
            }}
            disabled={!trailerKey}
            title={!trailerKey ? 'Trailer no disponible' : undefined}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cinematic-action transition transform motion-safe:duration-200 ${
              trailerKey
                ? 'bg-cinematic-action text-white hover:bg-cinematic-action-600 hover:scale-105'
                : 'bg-slate-300 text-slate-600 cursor-not-allowed'
            }`}
            aria-label="Ver trailer"
          >
            <PlayIcon className="w-4 h-4" aria-hidden />
            <span>Ver trailer</span>
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 items-start">
        <div>
          <div className="w-full overflow-hidden rounded-md bg-black group">
            {posterUrl ? (
              <div className="aspect-[2/3] overflow-hidden rounded-md">
                <img
                  src={posterUrl}
                  alt={`${details.title} poster`}
                  className="w-full h-full object-cover rounded-md shadow-sm transition-transform duration-500 group-hover:scale-105"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            ) : (
              <div className="w-full h-72 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center">
                <span className="text-slate-500">No image</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Sinopsis</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {details.overview || 'No hay sinopsis disponible.'}
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-medium mb-3">Reparto</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {credits?.cast?.slice(0, 6).map((actor) => (
                <li
                  key={actor.cast_id}
                  className="flex items-center gap-3 rounded-md p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus-within:ring-2 focus-within:ring-cinematic-action"
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w92${actor.profile_path}`
                        : '/placeholder.png'
                    }
                    alt={actor.name}
                    className="w-12 h-12 rounded object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="text-sm">
                    <div className="font-medium text-slate-800 dark:text-slate-100">
                      {actor.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {actor.character}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-3">Similares</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {similar?.results?.slice(0, 8).map((m) => (
                <article
                  key={m.id}
                  className="space-y-2 rounded-md overflow-hidden group bg-transparent hover:shadow-lg transition-shadow motion-safe:duration-200"
                >
                  <Link
                    to={`/movie/${m.id}`}
                    className="block focus:outline-none focus:ring-2 focus:ring-cinematic-action rounded"
                  >
                    <div className="w-full h-40 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                      <img
                        src={
                          m.poster_path
                            ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                            : '/placeholder.png'
                        }
                        alt={m.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <h4 className="text-sm mt-1 text-slate-800 dark:text-slate-100 truncate">
                      {m.title}
                    </h4>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <TrailerModal
        trailerKey={trailerKey}
        open={openTrailer}
        onClose={() => setOpenTrailer(false)}
        title={details.title}
        initialFocusRef={closeBtnRef}
      />
    </main>
  );
}
