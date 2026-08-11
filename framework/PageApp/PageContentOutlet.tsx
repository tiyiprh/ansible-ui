import { Outlet, useLocation } from 'react-router-dom';

/**
 * Main page content outlet. Keys the Outlet by pathname so React remounts
 * the matched child tree when the route changes (e.g. analytics → settings).
 */
export function PageContentOutlet() {
  const location = useLocation();
  return <Outlet key={location.pathname} />;
}

/** Pass-through layout route so nested child pages render in an <Outlet />. */
export function NestedRouteOutlet() {
  return <Outlet />;
}
