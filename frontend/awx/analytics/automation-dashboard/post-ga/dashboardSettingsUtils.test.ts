import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  clearGoals,
  DEMO_GOAL_TARGETS,
  getEffectiveGoalTargets,
  GOALS_STORAGE_KEY,
  hasConfiguredGoals,
  saveGoals,
  setGoalsPreviewMode,
  shouldShowEmptyGoalsCard,
} from './dashboardSettingsUtils';

describe('dashboardSettingsUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('should return zero targets when goals are not saved', () => {
    vi.stubEnv('VITE_DEMO_MODE', 'false');
    expect(getEffectiveGoalTargets()).toEqual({
      quarterlyRunTarget: 0,
      monthlySavingsTarget: 0,
    });
  });

  test('should return saved goals when configured', () => {
    saveGoals({ quarterlyRunTarget: 100, monthlySavingsTarget: 200 });
    expect(getEffectiveGoalTargets()).toEqual({
      quarterlyRunTarget: 100,
      monthlySavingsTarget: 200,
    });
    expect(hasConfiguredGoals()).toBe(true);
  });

  test('should use demo mock targets only in demo populated preview', () => {
    vi.stubEnv('VITE_DEMO_MODE', 'true');
    setGoalsPreviewMode('configured');
    expect(getEffectiveGoalTargets()).toEqual(DEMO_GOAL_TARGETS);
    expect(shouldShowEmptyGoalsCard()).toBe(false);
  });

  test('should show empty goals card by default in demo mode', () => {
    vi.stubEnv('VITE_DEMO_MODE', 'true');
    expect(shouldShowEmptyGoalsCard()).toBe(true);
  });

  test('should clear configured goals', () => {
    saveGoals({ quarterlyRunTarget: 100, monthlySavingsTarget: 200 });
    clearGoals();
    expect(localStorage.getItem(GOALS_STORAGE_KEY)).toBeNull();
    expect(hasConfiguredGoals()).toBe(false);
  });
});
