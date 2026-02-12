import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useBack(fallback = '/') {
  const navigate = useNavigate();

  const goBack = useCallback(
    (from?: string) => {
      try {
        if (from) {
          navigate(from);
          return;
        }
        if (window.history.length > 2) {
          navigate(-1);
        } else {
          navigate(fallback);
        }
      } catch {
        navigate(fallback);
      }
    },
    [navigate, fallback]
  );

  return goBack;
}
