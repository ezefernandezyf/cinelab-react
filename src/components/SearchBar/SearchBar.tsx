import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type Props = {
  defaultValue?: string;
  onSearch: (q: string) => void;
};

const SearchSchema = z.object({
  query: z.string().min(1, 'Escribe al menos un carácter'),
});

type SearchForm = z.infer<typeof SearchSchema>;

export const SearchBar = ({ defaultValue = '', onSearch }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchForm>({
    resolver: zodResolver(SearchSchema),
    defaultValues: { query: defaultValue },
  });

  const onSubmit = (data: SearchForm) => {
    onSearch(data.query.trim());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="Movie search form" className="w-full">
      <label htmlFor="search-query" className="sr-only">
        Buscar películas
      </label>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <MagnifyingGlassIcon className="w-5 h-5" aria-hidden />
          </span>

          <input
            id="search-query"
            {...register('query')}
            placeholder="Buscar películas..."
            aria-invalid={!!errors.query}
            aria-describedby={errors.query ? 'search-error' : undefined}
            className={`w-full sm:w-80 pl-10 pr-3 py-2 rounded-md bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--muted)] border border-transparent focus:outline-none focus:ring-2 focus:ring-cinematic-accent transition`}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        >
          Buscar
        </button>
      </div>

      {errors.query ? (
        <div id="search-error" role="alert" className="mt-2 text-xs text-red-400">
          {errors.query.message}
        </div>
      ) : null}
    </form>
  );
};
