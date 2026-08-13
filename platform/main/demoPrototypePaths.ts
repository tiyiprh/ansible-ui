/** Post-GA automation dashboard — Highlights tab (ANSTRAT-1976). */
export const DEMO_AUTOMATION_DASHBOARD_PATH = 'analytics/automation-dashboard/post-ga/highlights';

/** Standalone prototype bookmark path (legacy GitLab Pages URL). */
export const LEGACY_AUTOMATION_DASHBOARD_PATH = 'automation-dashboard-b';

export function demoDashboardUrl(basePath = '/'): string {
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  return `${normalizedBase}${DEMO_AUTOMATION_DASHBOARD_PATH}`;
}

/** Paths that should redirect to the Post-GA dashboard in demo mode. */
export function isDemoLandingPath(pathname: string, basePath = '/'): boolean {
  const stripTrailingSlash = (path: string) => path.replace(/\/$/, '') || '/';
  const normalizedPath = stripTrailingSlash(pathname);
  const normalizedBase = stripTrailingSlash(basePath);

  const rootPath = normalizedBase === '/' ? '/' : normalizedBase;
  const legacyPath =
    normalizedBase === '/'
      ? `/${LEGACY_AUTOMATION_DASHBOARD_PATH}`
      : `${normalizedBase}/${LEGACY_AUTOMATION_DASHBOARD_PATH}`;

  return normalizedPath === rootPath || normalizedPath === legacyPath;
}
