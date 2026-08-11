/** Basename shared by BrowserRouter and PageApp — must stay in sync. */
export function getRouterBasename(): string {
  const base = (import.meta.env.BASE_URL as string) ?? '/';
  return base.replace(/\/$/, '') || '/';
}
