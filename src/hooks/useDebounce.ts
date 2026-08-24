import { useCallback, useEffect, useRef } from "react";

// Renvoie une version debounce de `callback` : chaque appel repousse l'exécution
// de `delay` ms, seul le dernier appel dans la fenêtre est réellement exécuté.
// `callback` est lu via une ref pour toujours utiliser la dernière closure sans
// changer l'identité de la fonction debounce retournée (évite les re-render inutiles
// quand elle est passée en dépendance ou en prop).
export const useDebounce = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args: Args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
};

export default useDebounce;
