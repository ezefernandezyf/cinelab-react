import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  defaultValue?: string;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  inputId?: string;
  fullWidth?: boolean;
  inputClassName?: string;
};

export default function HeaderSearch({
  defaultValue = '',
  placeholder = 'Buscar películas...',
  ariaLabel = 'Buscar películas',
  className = '',
  inputId,
  fullWidth = false,
  inputClassName = '',
}: Props) {
  const [value, setValue] = useState<string>(defaultValue);
  const navigate = useNavigate();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    const encoded = encodeURIComponent(q);
    navigate(`/search?q=${encoded}`);
  };

  const inputFlexClasses = fullWidth ? 'flex-1 min-w-0' : 'w-auto';
  const computedInputClasses = [
    'pl-10 pr-3 py-2',
    'rounded-md',
    'text-sm',
    'outline-none',
    'shadow-sm',
    'border',
    'border-transparent',
    'focus:ring-2 focus:ring-indigo-400',
    'bg-[var(--surface)]',
    'text-[var(--text)]',
    'placeholder:text-[var(--muted)]',
    inputFlexClasses,
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <form
      role="search"
      aria-label={ariaLabel}
      onSubmit={handleSubmit}
      className={`flex items-center ${className}`}
    >
      <label htmlFor={inputId ?? 'header-search-input'} className="sr-only">
        {ariaLabel}
      </label>

      <div className={`relative ${fullWidth ? 'flex-1' : ''}`}>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5" aria-hidden />
        </span>

        <input
          id={inputId ?? 'header-search-input'}
          name="q"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={computedInputClasses}
          aria-label={ariaLabel}
        />
      </div>

      <button
        type="submit"
        aria-label="Buscar"
        className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm flex-shrink-0 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      >
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </form>
  );
}
