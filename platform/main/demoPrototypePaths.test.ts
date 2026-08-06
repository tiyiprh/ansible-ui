import { describe, expect, test } from 'vitest';
import {
  DEMO_AUTOMATION_DASHBOARD_PATH,
  LEGACY_AUTOMATION_DASHBOARD_PATH,
  demoDashboardUrl,
  isDemoLandingPath,
} from './demoPrototypePaths';

describe('demoPrototypePaths', () => {
  test('should expose stable demo and legacy path constants', () => {
    expect(DEMO_AUTOMATION_DASHBOARD_PATH).toBe('analytics/automation-dashboard/post-ga/dashboard');
    expect(LEGACY_AUTOMATION_DASHBOARD_PATH).toBe('automation-dashboard-b');
  });

  test('should build dashboard URL from base path', () => {
    expect(demoDashboardUrl('/')).toBe('/analytics/automation-dashboard/post-ga/dashboard');
    expect(demoDashboardUrl('/project/')).toBe('/project/analytics/automation-dashboard/post-ga/dashboard');
  });

  test('should treat root and legacy paths as demo landing paths', () => {
    expect(isDemoLandingPath('/', '/')).toBe(true);
    expect(isDemoLandingPath('/automation-dashboard-b', '/')).toBe(true);
    expect(isDemoLandingPath('/analytics/automation-dashboard/post-ga/dashboard', '/')).toBe(false);
    expect(isDemoLandingPath('/project/automation-dashboard-b', '/project/')).toBe(true);
  });
});
