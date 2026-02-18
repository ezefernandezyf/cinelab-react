import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'cinelab.theme';

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      return stored ?? 'system';
    } catch {
      return 'system';
    }
  });

  useEffect(() => {
    const root = typeof document !== 'undefined' ? document.documentElement : null;
    if (!root) return;

    const apply = (t: Theme) => {
      if (t === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else if (t === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else {
        // system: reflect current system theme
        const sys = getSystemTheme();
        if (sys === 'dark') {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.remove('dark');
          root.classList.remove('light');
        }
      }
    };

    apply(theme);

    // if theme === 'system' listen to changes
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') apply('system');
    };
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', handleChange);
    } else if (mq && mq.addListener) {
      mq.addListener(handleChange);
    }

    return () => {
      if (mq && mq.removeEventListener) {
        mq.removeEventListener('change', handleChange);
      } else if (mq && mq.removeListener) {
        mq.removeListener(handleChange);
      }
    };
  }, [theme]);

  const setTheme = (t: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // ignore write errors
    }
    setThemeState(t);
  };

  const toggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme, setTheme, toggle } as const;
}

export default useTheme;
