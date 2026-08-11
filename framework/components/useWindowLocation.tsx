import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMounted } from './useIsMounted';

export function useWindowLocation() {
  const isMounted = useIsMounted();
  const routerLocation = useLocation();
  const [location, setLocation] = useState<Location | void>(
    isMounted ? window.location : undefined
  );

  const setWindowLocation = useCallback(() => {
    setLocation(window.location);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    setWindowLocation();
    window.addEventListener('popstate', setWindowLocation);
    return () => {
      window.removeEventListener('popstate', setWindowLocation);
    };
  }, [isMounted, routerLocation.pathname, routerLocation.search, routerLocation.hash, setWindowLocation]);

  const push = useCallback(
    (url?: string | URL | null) => {
      window.history.pushState(null, '', url);
      setWindowLocation();
    },
    [setWindowLocation]
  );

  const update = useCallback(
    (url?: string | URL | null) => {
      window.history.replaceState(null, '', url);
      setWindowLocation();
    },
    [setWindowLocation]
  );

  return { location, push, update };
}
