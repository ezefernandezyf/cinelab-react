import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
    <form onSubmit={handleSubmit(onSubmit)} aria-label="Movie search form">
      <label htmlFor="search-query" style={{ display: 'none' }}>
        Buscar películas
      </label>
      <input
        id="search-query"
        {...register('query')}
        placeholder="Buscar películas..."
        aria-invalid={!!errors.query}
        aria-describedby={errors.query ? 'search-error' : undefined}
        style={{ padding: 8, width: 320 }}
      />
      {errors.query ? (
        <div id="search-error" role="alert" style={{ color: 'red', fontSize: 12 }}>
          {errors.query.message}
        </div>
      ) : null}
      <button type="submit" disabled={isSubmitting} style={{ marginLeft: 8, padding: 8 }}>
        Buscar
      </button>
    </form>
  );
};
