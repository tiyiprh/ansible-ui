import { useCallback, useMemo } from 'react';
import { useSearchParams as useRouterSearchParams } from 'react-router-dom';

function stripSpecPath(search: string): string {
  /** Cypress component tests add a specPath param that must be ignored */
  if (search.includes('?specPath=')) {
    return search.substring(0, search.indexOf('?specPath='));
  }
  if (search.includes('&specPath=')) {
    return search.substring(0, search.indexOf('&specPath='));
  }
  return search;
}

// This hook is used to get and set URLSearchParams in the URL.
// It does not create a new navigation in navigation history when updating the URLSearchParams.
export function useURLSearchParams(): [
  URLSearchParams,
  (setSearchParams: URLSearchParams) => void,
] {
  const [routerSearchParams, setRouterSearchParams] = useRouterSearchParams();

  const searchParams = useMemo<URLSearchParams>(() => {
    const search = stripSpecPath(routerSearchParams.toString() ? `?${routerSearchParams.toString()}` : '');
    return new URLSearchParams(search || '');
  }, [routerSearchParams]);

  const setSearchParams = useCallback(
    (nextSearchParams: URLSearchParams) => {
      const newSearch = nextSearchParams.toString();
      const currentSearch = routerSearchParams.toString();
      if (newSearch === currentSearch) return;
      setRouterSearchParams(nextSearchParams, { replace: true });
    },
    [routerSearchParams, setRouterSearchParams]
  );

  return [searchParams, setSearchParams];
}
