/* eslint-disable i18next/no-literal-string */
import { describe, expect, test } from 'vitest';
import { AutomationDashboardDateRangeFilterPresets } from '../constants';
import {
  AUTOMATION_DASHBOARD_DEFAULT_FILTERS,
  isDefaultAutomationDashboardFilterState,
} from './defaultFilterState';

describe('isDefaultAutomationDashboardFilterState', () => {
  test('should return true when filter state is undefined', () => {
    expect(isDefaultAutomationDashboardFilterState(undefined)).toBe(true);
  });

  test('should return true when filter state is empty', () => {
    expect(isDefaultAutomationDashboardFilterState({})).toBe(true);
  });

  test('should return true for the full default filters on page load', () => {
    expect(isDefaultAutomationDashboardFilterState(AUTOMATION_DASHBOARD_DEFAULT_FILTERS)).toBe(true);
  });

  test('should return true for Last 7 days preset only (e.g. after clear filters)', () => {
    expect(
      isDefaultAutomationDashboardFilterState({
        period: [AutomationDashboardDateRangeFilterPresets.last_7_days],
      })
    ).toBe(true);
  });

  test('should return false when period differs from default', () => {
    expect(
      isDefaultAutomationDashboardFilterState({
        period: [AutomationDashboardDateRangeFilterPresets.last_30_days],
      })
    ).toBe(false);
  });
});
