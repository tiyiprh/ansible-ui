import { COST_SAVINGS_AT_GLANCE, QUARTERLY_GOAL } from './postGaMockData';

export const GOALS_STORAGE_KEY = 'automation-dashboard-goals';
export const GOALS_PREVIEW_STORAGE_KEY = 'automation-dashboard-goals-preview';

export type DashboardGoals = {
  quarterlyRunTarget: number;
  monthlySavingsTarget: number;
};

export type GoalsPreviewMode = 'empty' | 'configured';

export const DEFAULT_GOALS: DashboardGoals = {
  quarterlyRunTarget: QUARTERLY_GOAL.target,
  monthlySavingsTarget: COST_SAVINGS_AT_GLANCE.goal,
};

const SETTINGS_CHANGED_EVENT = 'automation-dashboard-settings-changed';

export function notifyDashboardSettingsChanged(): void {
  window.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT));
}

export function subscribeDashboardSettings(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(SETTINGS_CHANGED_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(SETTINGS_CHANGED_EVENT, handler);
  };
}

export function isDemoMode(): boolean {
  return import.meta.env.VITE_DEMO_MODE === 'true';
}

export function getGoalsPreviewMode(): GoalsPreviewMode {
  try {
    const stored = sessionStorage.getItem(GOALS_PREVIEW_STORAGE_KEY);
    if (stored === 'empty' || stored === 'configured') return stored;
  } catch {
    // ignore
  }
  return 'empty';
}

export function setGoalsPreviewMode(mode: GoalsPreviewMode): void {
  sessionStorage.setItem(GOALS_PREVIEW_STORAGE_KEY, mode);
  notifyDashboardSettingsChanged();
}

export function loadGoals(): DashboardGoals | null {
  try {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as DashboardGoals).quarterlyRunTarget === 'number' &&
      typeof (parsed as DashboardGoals).monthlySavingsTarget === 'number'
    ) {
      return parsed as DashboardGoals;
    }
  } catch {
    // fall through
  }
  return null;
}

export function saveGoals(goals: DashboardGoals): void {
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  notifyDashboardSettingsChanged();
}

export function hasConfiguredGoals(): boolean {
  const goals = loadGoals();
  return (
    goals !== null &&
    goals.quarterlyRunTarget > 0 &&
    goals.monthlySavingsTarget > 0
  );
}

export function getEffectiveGoalTargets(): DashboardGoals {
  const saved = loadGoals();
  if (saved && saved.quarterlyRunTarget > 0 && saved.monthlySavingsTarget > 0) {
    return saved;
  }
  return DEFAULT_GOALS;
}

export function shouldShowEmptyGoalsCard(): boolean {
  if (isDemoMode()) {
    if (getGoalsPreviewMode() === 'empty') return true;
    if (getGoalsPreviewMode() === 'configured') return false;
  }
  return !hasConfiguredGoals();
}

/** When false, leaderboards and similar UI should not compute % against goal targets. */
export function shouldUseGoalTargetsForDisplay(): boolean {
  return !shouldShowEmptyGoalsCard();
}

export type GoalsCardSnapshot = {
  showEmpty: boolean;
  targets: DashboardGoals;
};

let goalsCardSnapshotCache: GoalsCardSnapshot = {
  showEmpty: false,
  targets: DEFAULT_GOALS,
};
let goalsCardSnapshotKey = '';

/** Stable snapshot for useSyncExternalStore — must not return a new object reference each call. */
export function getGoalsCardSnapshot(): GoalsCardSnapshot {
  const showEmpty = shouldShowEmptyGoalsCard();
  const targets = getEffectiveGoalTargets();
  const key = `${showEmpty}:${targets.quarterlyRunTarget}:${targets.monthlySavingsTarget}`;
  if (key !== goalsCardSnapshotKey) {
    goalsCardSnapshotKey = key;
    goalsCardSnapshotCache = {
      showEmpty,
      targets: {
        quarterlyRunTarget: targets.quarterlyRunTarget,
        monthlySavingsTarget: targets.monthlySavingsTarget,
      },
    };
  }
  return goalsCardSnapshotCache;
}

export function daysRemainingInQuarter(): number {
  const now = new Date();
  const quarterEndMonth = Math.floor(now.getMonth() / 3) * 3 + 2;
  const quarterEnd = new Date(now.getFullYear(), quarterEndMonth + 1, 0);
  quarterEnd.setHours(23, 59, 59, 999);
  const diffMs = quarterEnd.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}
