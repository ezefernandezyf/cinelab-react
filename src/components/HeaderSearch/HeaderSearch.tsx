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
    'px-2',
    'py-2',
    'border',
    'rounded-md',
    'text-sm',
    inputFlexClasses,
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <form role="search" aria-label={ariaLabel} onSubmit={handleSubmit} className={className}>
      <label htmlFor={inputId ?? 'header-search-input'} className="sr-only">
        {ariaLabel}
      </label>
      <div className="flex items-center w-full">
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
        <button
          type="submit"
          aria-label="Buscar"
          className="ml-2 px-3 py-1 bg-sky-600 text-white rounded-md text-sm flex-shrink-0"
        >
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}