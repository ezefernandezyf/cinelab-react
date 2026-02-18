import React from 'react';
import useTheme from '../../hooks/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle(): React.JSX.Element {
  const { theme, toggle } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema"
      aria-pressed={isDark}
      title={`Tema: ${theme}`}
      className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
    >
      <span className="relative inline-block w-6 h-6">
        {/* Sun (visible en light) */}
        <SunIcon
          className={`absolute inset-0 w-6 h-6 transition-opacity duration-200 ${
            theme === 'light' ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden
        />

        {/* Moon (visible en dark) */}
        <MoonIcon
          className={`absolute inset-0 w-6 h-6 transition-opacity duration-200 ${
            theme === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden
        />

        {/* Fallback */}
        {theme === 'system' && (
          <SunIcon className="absolute inset-0 w-6 h-6 opacity-60" aria-hidden />
        )}
      </span>
    </button>
  );
}
