import { IFilterState } from '@ansible/ansible-ui-framework';
import { AutomationDashboardDateRangeFilterPresets } from '../constants';

const DEFAULT_END_DATE = new Date(Date.now());
const DEFAULT_START_DATE = new Date(DEFAULT_END_DATE.getTime() - 7 * 24 * 60 * 60 * 1000);

/** Default filter state on dashboard load (Last 7 days preset + computed date range). */
export const AUTOMATION_DASHBOARD_DEFAULT_FILTERS: Record<string, string[]> = {
  period: [
    AutomationDashboardDateRangeFilterPresets.last_7_days,
    DEFAULT_START_DATE.toISOString().split('T')[0],
    DEFAULT_END_DATE.toISOString().split('T')[0],
  ],
};

function getActiveFilterState(filterState: IFilterState | undefined): Record<string, string[]> {
  if (!filterState) return {};
  return Object.fromEntries(
    Object.entries(filterState).filter(([, v]) => v && v.length > 0)
  );
}

function isLastSevenDaysOnlyPeriod(period: string[] | undefined): boolean {
  return (
    period?.length === 1 && period[0] === AutomationDashboardDateRangeFilterPresets.last_7_days
  );
}

/** True when filters are empty or still the default Last 7 days view (with or without date range). */
export function isDefaultAutomationDashboardFilterState(
  filterState: IFilterState | undefined
): boolean {
  const active = getActiveFilterState(filterState);
  if (Object.keys(active).length === 0) return true;

  if (Object.keys(active).length === 1 && isLastSevenDaysOnlyPeriod(active.period)) {
    return true;
  }

  return JSON.stringify(active) === JSON.stringify(AUTOMATION_DASHBOARD_DEFAULT_FILTERS);
}
