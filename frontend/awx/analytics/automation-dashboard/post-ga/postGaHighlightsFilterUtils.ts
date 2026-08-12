import { AutomationDashboardDateRangeFilterPresets } from '../constants';
import {
  FILTER_ORGANIZATIONS,
  HIGHLIGHTS,
  ORGANIZATIONS_TOTAL,
  STREAK_HEAT_STRIP_DAYS,
  TEMPLATES_TOTAL,
  topOrganizations,
} from './postGaMockData';

export function getPeriodScale(period: string[] | undefined): number {
  const preset = period?.[0];
  switch (preset) {
    case AutomationDashboardDateRangeFilterPresets.last_14_days:
      return 1.15;
    case AutomationDashboardDateRangeFilterPresets.last_30_days:
      return 1.3;
    case AutomationDashboardDateRangeFilterPresets.last_60_days:
      return 1.8;
    case AutomationDashboardDateRangeFilterPresets.last_90_days:
      return 2.5;
    case AutomationDashboardDateRangeFilterPresets.custom:
      return 1.2;
    case AutomationDashboardDateRangeFilterPresets.last_7_days:
    default:
      return 1;
  }
}

/** Approximate mock scope when GA organization filter (by ID) is active. */
export function getOrgFilterScale(organizationFilterIds: readonly string[]): number {
  if (organizationFilterIds.length === 0) return 1;
  return Math.min(1, organizationFilterIds.length / FILTER_ORGANIZATIONS.length);
}

/** @deprecated Mock org-name filter only — use getOrgFilterScale with API org IDs. */
export function getOrgJobRunShare(orgFilters: readonly string[]): number {
  if (orgFilters.length === 0) return 1;
  const total = topOrganizations.reduce((sum, org) => sum + org.execution_count, 0);
  if (total === 0) return 1;
  const filtered = topOrganizations
    .filter((org) => orgFilters.includes(org.orgName))
    .reduce((sum, org) => sum + org.execution_count, 0);
  return filtered / total;
}

export function scaleByHighlightsFilters(
  value: number,
  periodScale: number,
  orgShare: number
): number {
  return Math.round(value * periodScale * orgShare);
}

export function getScaledHighlights(
  organizationFilterIds: readonly string[],
  periodScale: number
) {
  const orgShare = getOrgFilterScale(organizationFilterIds);
  const scopedOrgCount =
    organizationFilterIds.length > 0 ? organizationFilterIds.length : ORGANIZATIONS_TOTAL;
  const activeOrgs =
    organizationFilterIds.length > 0
      ? Math.min(
          organizationFilterIds.length,
          Math.max(1, Math.round(HIGHLIGHTS.organizationsActive * orgShare))
        )
      : HIGHLIGHTS.organizationsActive;

  return {
    organizationsActive: activeOrgs,
    organizationsTotal: scopedOrgCount,
    templatesInUse: scaleByHighlightsFilters(HIGHLIGHTS.templatesInUse, periodScale, orgShare),
    templatesTotal: TEMPLATES_TOTAL,
    runsInPeriod: scaleByHighlightsFilters(HIGHLIGHTS.runsThisMonth, periodScale, orgShare),
  };
}

/** Per-org streak variant when org filter is applied (Q9 — streak scoped to selection). */
export function getStreakDaysForFilter(organizationFilterIds: readonly string[]) {
  if (organizationFilterIds.length === 0) return STREAK_HEAT_STRIP_DAYS;

  const seed = organizationFilterIds
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => !Number.isNaN(id))
    .reduce((sum, id) => sum + id, 0);
  const orgShare = getOrgFilterScale(organizationFilterIds);

  return STREAK_HEAT_STRIP_DAYS.map((day, index) => {
    const suppressSuccess = (index + seed) % 9 === 0;
    const success = day.success && !suppressSuccess;
    return {
      ...day,
      success,
      runs: success ? Math.max(1, Math.round(day.runs * orgShare)) : 0,
    };
  });
}

export function computeStreakLength(days: readonly { success: boolean }[]): number {
  let count = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (!days[i].success) break;
    count++;
  }
  return count;
}
