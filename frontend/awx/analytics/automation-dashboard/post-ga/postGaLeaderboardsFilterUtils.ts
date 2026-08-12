import { AutomationDashboardDateRangeFilterPresets } from '../constants';

export const LEADERBOARD_PERIOD_PRESETS = {
  month: 'month',
  quarter: 'quarter',
  all: 'all',
} as const;

export type LeaderboardPeriodPreset =
  (typeof LEADERBOARD_PERIOD_PRESETS)[keyof typeof LEADERBOARD_PERIOD_PRESETS];

export function getLeaderboardPeriodScale(period: string[] | undefined): number {
  switch (period?.[0]) {
    case LEADERBOARD_PERIOD_PRESETS.quarter:
      return 2.8;
    case LEADERBOARD_PERIOD_PRESETS.all:
      return 4.5;
    case LEADERBOARD_PERIOD_PRESETS.month:
    default:
      return 1;
  }
}

/** Map leaderboards period preset to metrics-service DateRange filter for live API panels. */
export function mapLeaderboardPeriodToApiPeriod(period: string[] | undefined): string[] {
  switch (period?.[0]) {
    case LEADERBOARD_PERIOD_PRESETS.quarter:
      return [AutomationDashboardDateRangeFilterPresets.last_90_days];
    case LEADERBOARD_PERIOD_PRESETS.all:
      return [AutomationDashboardDateRangeFilterPresets.last_90_days];
    case LEADERBOARD_PERIOD_PRESETS.month:
    default:
      return [AutomationDashboardDateRangeFilterPresets.last_30_days];
  }
}
