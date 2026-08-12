import { describe, expect, test } from 'vitest';
import { createNavigateToRoutes } from './PageNavigationRoutesProvider';

describe('createNavigateToRoutes', () => {
  test('should register distinct paths for analytics dashboard tab and settings dashboard', () => {
    const routes = createNavigateToRoutes('', [
      {
        id: 'analytics',
        path: 'analytics',
        children: [
          {
            id: 'awx-automation-dashboard-post-ga',
            path: 'automation-dashboard/post-ga',
            children: [
              {
                id: 'awx-automation-dashboard-post-ga-dashboard',
                path: 'dashboard',
                children: [],
              },
              {
                id: 'awx-automation-dashboard-post-ga-gamification',
                path: 'gamification',
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 'awx-settings',
        path: 'settings',
        children: [
          {
            id: 'platform-automation-analytics-settings',
            path: 'automation-analytics',
            children: [
              {
                id: 'platform-automation-dashboard-settings',
                label: 'Dashboard',
                path: 'dashboard',
                children: [{ path: '', element: <></> }],
              },
            ],
          },
        ],
      },
    ]);

    expect(routes['awx-automation-dashboard-post-ga-dashboard']).toBe(
      '/analytics/automation-dashboard/post-ga/dashboard'
    );
    expect(routes['awx-automation-dashboard-post-ga-gamification']).toBe(
      '/analytics/automation-dashboard/post-ga/gamification'
    );
    expect(routes['platform-automation-dashboard-settings']).toBe(
      '/settings/automation-analytics/dashboard'
    );
  });
});
