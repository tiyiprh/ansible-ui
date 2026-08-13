export const HIGHLIGHTS = { organizationsActive: 12, templatesInUse: 10, runsThisMonth: 7200 };
export const ORGANIZATIONS_TOTAL = 15;
export const TEMPLATES_TOTAL = 15;
export const QUARTERLY_GOAL = { target: 15000, current: 7500 };
export const COST_SAVINGS_AT_GLANCE = { thisMonth: 3200, goal: 5000, lastMonth: 2000 };
export const MATURITY_LEVEL = 3;
/** @deprecated Use MATURITY_LEVEL — GA UI shows integer level only, not a decimal score */
export const MATURITY_SCORE = 3.2;
export const STREAK_PERIOD_DAYS = 30;

export const AUTOMATION_MATURITY_LEVELS = [
  'Ad hoc',
  'Repeatable',
  'Defined',
  'Managed',
  'Optimizing',
] as const;

export const AUTOMATION_MATURITY_DESCRIPTIONS: Record<string, string> = {
  'Ad hoc': 'Automation is informal and inconsistent across the organization.',
  Repeatable: 'Some processes are repeated with basic consistency.',
  Defined: 'Processes are documented, standardized, and consistently applied across teams.',
  Managed: 'Automation is measured, monitored, and improved with clear ownership.',
  Optimizing: 'Continuous improvement is embedded; automation is strategic and scalable.',
};

export const FILTER_ORGANIZATIONS = [
  'Platform Engineering',
  'Security Operations',
  'Cloud Infrastructure',
  'Application Development',
  'Data Analytics',
];

export const STREAK_HEAT_STRIP_DAYS = (() => {
  const days: { dateStr: string; success: boolean; runs: number }[] = [];
  const now = new Date();
  // Last 14 days success for Daily Streak silver tier demo; day before streak breaks.
  const successByIndex = [
    true,
    false,
    true,
    true,
    false,
    true,
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  const runsByIndex = [
    125, 0, 98, 210, 0, 45, 0, 88, 156, 203, 189, 244, 167, 221, 198, 0, 134, 212, 155, 178, 142,
    165, 199, 88, 112, 201, 167, 190, 205, 188,
  ];
  for (let i = STREAK_PERIOD_DAYS - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayIndex = STREAK_PERIOD_DAYS - 1 - i;
    days.push({
      dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      success: successByIndex[dayIndex],
      runs: successByIndex[dayIndex] ? runsByIndex[dayIndex] : 0,
    });
  }
  return days;
})();

export const WEEK_COMPARISON = {
  runs: { current: 1840, previous: 1520 },
  savings: { current: 780, previous: 620 },
  hosts: { current: 1247, previous: 1190 },
};

export const SPARKLINE_DATA = {
  orgActivity: [58, 60, 62, 59, 64, 65, 67],
  templateUtil: [60, 62, 58, 63, 65, 64, 67],
  runs: [980, 1020, 1100, 1050, 1150, 1180, 1200],
};

export const topOrganizations = [
  { orgName: 'Platform Engineering', execution_count: 2840, trend: 'up' as const },
  { orgName: 'Security Operations', execution_count: 1923, trend: 'up' as const },
  { orgName: 'Cloud Infrastructure', execution_count: 1654, trend: 'down' as const },
  { orgName: 'Application Development', execution_count: 1201, trend: 'steady' as const },
  { orgName: 'Data Analytics', execution_count: 987, trend: 'down' as const },
  { orgName: 'Network Services', execution_count: 756, trend: 'down' as const },
  { orgName: 'DevOps Enablement', execution_count: 534, trend: 'steady' as const },
  { orgName: 'Quality Assurance', execution_count: 412, trend: 'steady' as const },
  { orgName: 'Release Management', execution_count: 298, trend: 'down' as const },
  { orgName: 'IT Operations', execution_count: 187, trend: 'steady' as const },
];

export const topTemplates = [
  {
    templateName: 'Infrastructure provisioning',
    execution_count: 1247,
    org: 'Platform Engineering',
    trend: 'up' as const,
  },
  {
    templateName: 'Security compliance scan',
    execution_count: 892,
    org: 'Security Operations',
    trend: 'steady' as const,
  },
  {
    templateName: 'Application deployment',
    execution_count: 756,
    org: 'Platform Engineering',
    trend: 'up' as const,
  },
  {
    templateName: 'Backup and restore',
    execution_count: 534,
    org: 'Cloud Infrastructure',
    trend: 'down' as const,
  },
  {
    templateName: 'Patch management',
    execution_count: 412,
    org: 'Security Operations',
    trend: 'up' as const,
  },
];

export const topProjects = [
  {
    projectName: 'Main project',
    execution_count: 2840,
    org: 'Platform Engineering',
    trend: 'up' as const,
  },
  {
    projectName: 'CI/CD pipeline',
    execution_count: 1923,
    org: 'Security Operations',
    trend: 'up' as const,
  },
  {
    projectName: 'POC - Automation',
    execution_count: 1654,
    org: 'Cloud Infrastructure',
    trend: 'down' as const,
  },
  {
    projectName: 'Legacy migration',
    execution_count: 1201,
    org: 'Application Development',
    trend: 'steady' as const,
  },
  {
    projectName: 'Security audit',
    execution_count: 987,
    org: 'Data Analytics',
    trend: 'up' as const,
  },
];

export const topUsers = [
  {
    userName: 'jsmith',
    displayName: 'John Smith',
    execution_count: 487,
    org: 'Platform Engineering',
    trend: 'up' as const,
  },
  {
    userName: 'agarcia',
    displayName: 'Ana Garcia',
    execution_count: 342,
    org: 'Security Operations',
    trend: 'steady' as const,
  },
  {
    userName: 'mchen',
    displayName: 'Michael Chen',
    execution_count: 278,
    org: 'Cloud Infrastructure',
    trend: 'up' as const,
  },
  {
    userName: 'kwilson',
    displayName: 'Karen Wilson',
    execution_count: 195,
    org: 'Platform Engineering',
    trend: 'down' as const,
  },
  {
    userName: 'rpatel',
    displayName: 'Raj Patel',
    execution_count: 163,
    org: 'Data Analytics',
    trend: 'up' as const,
  },
];

export const JOB_SUCCESS_BREAKDOWN = {
  successful: 7840,
  failed: 1120,
  error: 480,
  canceled: 400,
};

export const AUTOMATION_VELOCITY = {
  dailyRuns: [142, 156, 138, 168, 172, 155, 189, 195, 201, 178, 210, 224, 198, 215],
  avgRunsPerDay: 189,
  previousAvg: 156,
};

export const TEMPLATE_REUSE = {
  usedOnce: 3,
  usedMultiple: 12,
  total: 15,
  reusePct: 80,
};

/** Mock inputs for achievement badges — replace with metrics service rollups in product. */
export const ACHIEVEMENT_METRICS = {
  /** Consecutive calendar days with zero failed or errored jobs platform-wide. */
  cleanWeekConsecutiveDays: 5,
  /** Platform job success rate (%) for the current and previous 7-day windows. */
  recoverySuccessRateCurrent: 99,
  recoverySuccessRatePrevious: 87,
  /** Largest org share of total job runs in the selected period. */
  largestOrgSharePct: 32,
  largestOrgName: 'Platform Engineering',
  /** Highest single-instance share of total job runs in the selected period. */
  maxInstanceSharePct: 68,
  busiestInstanceName: 'controller-01',
};

export type ManageViewPanel = {
  id: string;
  label: string;
  visible: boolean;
};

export const INITIAL_MANAGE_VIEW_PANELS: ManageViewPanel[] = [
  { id: 'orgs', label: 'Top 5 organizations', visible: true },
  { id: 'templates', label: 'Top 5 templates', visible: true },
  { id: 'projects', label: 'Top 5 projects', visible: true },
  { id: 'users', label: 'Top 5 users', visible: true },
];

export const LEADERBOARD_PANEL_IDS = ['orgs', 'templates', 'projects', 'users'] as const;

export function formatLastSynced(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin === 1) return '1 minute ago';
  if (diffMin < 60) return `${diffMin} minutes ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr === 1) return '1 hour ago';
  return `${diffHr} hours ago`;
}

// --- ANSTRAT-1976 Highlights (30-day window, mock shapes for metrics service handoff) ---

export const HIGHLIGHTS_LAST_SYNC = '2026-08-13T14:00:00.000Z';

export type HighlightsStreakDayState = 'none' | 'enterpriseOnly' | 'enterpriseAndOrg';

export type HighlightsStreakDay = {
  dateStr: string;
  state: HighlightsStreakDayState;
  enterpriseRuns: number;
  orgRuns: number;
};

function computeEnterpriseStreak(days: readonly { state: HighlightsStreakDayState }[]): number {
  let count = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].state === 'none') break;
    count++;
  }
  return count;
}

function computeOrgStreak(days: readonly { state: HighlightsStreakDayState }[]): number {
  let count = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].state !== 'enterpriseAndOrg') break;
    count++;
  }
  return count;
}

export const HIGHLIGHTS_STREAK = (() => {
  const states: HighlightsStreakDayState[] = [
    'enterpriseAndOrg',
    'enterpriseOnly',
    'enterpriseAndOrg',
    'enterpriseAndOrg',
    'none',
    'enterpriseAndOrg',
    'none',
    'enterpriseOnly',
    'enterpriseAndOrg',
    'enterpriseOnly',
    'enterpriseAndOrg',
    'enterpriseOnly',
    'enterpriseAndOrg',
    'none',
    'enterpriseOnly',
    'enterpriseOnly',
    'enterpriseAndOrg',
    'enterpriseOnly',
    'enterpriseAndOrg',
    'enterpriseOnly',
    'enterpriseOnly',
    'enterpriseOnly',
    'enterpriseAndOrg',
    'enterpriseAndOrg',
    'enterpriseAndOrg',
    'enterpriseAndOrg',
    'enterpriseAndOrg',
    'enterpriseAndOrg',
    'enterpriseAndOrg',
    'enterpriseAndOrg',
  ];

  const days: HighlightsStreakDay[] = [];
  const now = new Date();
  for (let i = STREAK_PERIOD_DAYS - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const dayIndex = STREAK_PERIOD_DAYS - 1 - i;
    const state = states[dayIndex] ?? 'none';
    days.push({
      dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      state,
      enterpriseRuns: state === 'none' ? 0 : 80 + dayIndex * 3,
      orgRuns: state === 'enterpriseAndOrg' ? 40 + dayIndex * 2 : 0,
    });
  }

  return {
    enterpriseStreakDays: computeEnterpriseStreak(days),
    orgStreakDays: computeOrgStreak(days),
    calendarDays: days,
  };
})();

export type HighlightsDimensionScore = {
  score: number;
  rank: number;
  totalRanked: number;
};

export const HIGHLIGHTS_DIMENSIONS = {
  volume: { score: 487, rank: 3, totalRanked: 84 },
  breadth: { score: 12, rank: 1, totalRanked: 84 },
  // Below the dimension's top 10 (14th of 84) — demonstrates the case where the logged-in
  // user doesn't appear in their own dimension leaderboard, unlike Volume/Breadth above.
  consistency: { score: 9, rank: 14, totalRanked: 84 },
};

export type HighlightsDimensionLeaderboardRow = {
  id: string;
  name: string;
  value: number;
  isCurrentUser?: boolean;
};

/**
 * Per-dimension top-10 leaderboards (ANSTRAT-1976: "each dimension has its own ranked
 * leaderboard, top 10, same medal rules as the main leaderboard"). Volume and Breadth place
 * "You" at the rank/score already declared in HIGHLIGHTS_DIMENSIONS above, so the tile and
 * the list always agree. Consistency intentionally omits "You" — the user's rank (14) falls
 * outside the top 10 for that dimension, so no "You" row/label appears in that list.
 */
export const HIGHLIGHTS_DIMENSION_LEADERBOARDS: Record<
  keyof typeof HIGHLIGHTS_DIMENSIONS,
  HighlightsDimensionLeaderboardRow[]
> = {
  volume: [
    { id: 'u-6', name: 'Sam Lee', value: 612 },
    { id: 'u-2', name: 'Ana Garcia', value: 540 },
    { id: 'current-user', name: 'Jamie Ortiz', value: 487, isCurrentUser: true },
    { id: 'u-3', name: 'Michael Chen', value: 430 },
    { id: 'u-7', name: 'Jordan Kim', value: 388 },
    { id: 'u-4', name: 'Karen Wilson', value: 350 },
    { id: 'u-8', name: 'Taylor Brooks', value: 301 },
    { id: 'u-5', name: 'Raj Patel', value: 275 },
    { id: 'u-9', name: 'Casey Morgan', value: 240 },
    { id: 'u-10', name: 'Priya Nair', value: 205 },
  ],
  breadth: [
    { id: 'current-user', name: 'Jamie Ortiz', value: 12, isCurrentUser: true },
    { id: 'u-2', name: 'Ana Garcia', value: 11 },
    { id: 'u-3', name: 'Michael Chen', value: 10 },
    { id: 'u-6', name: 'Sam Lee', value: 9 },
    { id: 'u-4', name: 'Karen Wilson', value: 8 },
    { id: 'u-7', name: 'Jordan Kim', value: 8 },
    { id: 'u-5', name: 'Raj Patel', value: 7 },
    { id: 'u-8', name: 'Taylor Brooks', value: 6 },
    { id: 'u-9', name: 'Casey Morgan', value: 5 },
    { id: 'u-10', name: 'Priya Nair', value: 4 },
  ],
  consistency: [
    { id: 'u-3', name: 'Michael Chen', value: 29 },
    { id: 'u-2', name: 'Ana Garcia', value: 28 },
    { id: 'u-6', name: 'Sam Lee', value: 27 },
    { id: 'u-4', name: 'Karen Wilson', value: 25 },
    { id: 'u-7', name: 'Jordan Kim', value: 21 },
    { id: 'u-5', name: 'Raj Patel', value: 19 },
    { id: 'u-8', name: 'Taylor Brooks', value: 17 },
    { id: 'u-9', name: 'Casey Morgan', value: 15 },
    { id: 'u-11', name: 'Morgan Lee', value: 13 },
    { id: 'u-10', name: 'Priya Nair', value: 12 },
  ],
};

export type HighlightsLeaderboardRow = {
  id: string;
  name: string;
  runCount: number;
};

export const HIGHLIGHTS_USER_LEADERBOARD: HighlightsLeaderboardRow[] = [
  { id: 'sa-1', name: 'awx-runner', runCount: 892 },
  { id: 'u-1', name: 'John Smith', runCount: 487 },
  { id: 'u-2', name: 'Ana Garcia', runCount: 342 },
  { id: 'u-3', name: 'Michael Chen', runCount: 278 },
  { id: 'u-4', name: 'Karen Wilson', runCount: 195 },
  { id: 'u-5', name: 'Raj Patel', runCount: 163 },
  { id: 'u-6', name: 'Sam Lee', runCount: 142 },
  { id: 'u-7', name: 'Jordan Kim', runCount: 128 },
  { id: 'u-8', name: 'Taylor Brooks', runCount: 115 },
  { id: 'u-9', name: 'Casey Morgan', runCount: 98 },
];

/** Name is the logged-in user's real display name — the "You" label (not this name) is what
 * indicates ownership, same as everywhere else names are shown in the product. */
export const HIGHLIGHTS_CURRENT_USER: HighlightsLeaderboardRow & { rank: number } = {
  id: 'current-user',
  name: 'Jamie Ortiz',
  runCount: 67,
  rank: 14,
};

export const HIGHLIGHTS_ORG_LEADERBOARD: HighlightsLeaderboardRow[] = [
  { id: 'o-1', name: 'Platform Engineering', runCount: 2840 },
  { id: 'o-2', name: 'Security Operations', runCount: 1923 },
  { id: 'o-3', name: 'Cloud Infrastructure', runCount: 1654 },
  { id: 'o-4', name: 'Application Development', runCount: 1201 },
  { id: 'o-5', name: 'Data Analytics', runCount: 987 },
  { id: 'o-6', name: 'Network Services', runCount: 756 },
  { id: 'o-7', name: 'DevOps Enablement', runCount: 534 },
  { id: 'o-8', name: 'Quality Assurance', runCount: 412 },
  { id: 'o-9', name: 'Release Management', runCount: 298 },
  { id: 'o-10', name: 'IT Operations', runCount: 187 },
];

export const HIGHLIGHTS_CURRENT_ORG: HighlightsLeaderboardRow & { rank: number } = {
  id: 'o-1',
  name: 'Platform Engineering',
  runCount: 2840,
  rank: 1,
};

export const HIGHLIGHTS_AT_A_GLANCE = {
  jobsRun30Days: 12840,
  activeOrganizations: 12,
  featuredTemplate: {
    name: 'Infrastructure provisioning',
    runCount: 1247,
  },
};

export const MILESTONE_BADGE_IDS = [
  'ignition',
  'weekWarrior',
  'monthWarrior',
  'explorer',
  'centurion',
  'reliable',
  'accelerator',
] as const;

export type MilestoneBadgeId = (typeof MILESTONE_BADGE_IDS)[number];

export const ORG_BADGE_IDS = ['sustained', 'rising', 'topTier'] as const;

export type OrgBadgeId = (typeof ORG_BADGE_IDS)[number];

export const MILESTONE_BADGES_EARNED_USER: MilestoneBadgeId[] = [
  'ignition',
  'weekWarrior',
  'explorer',
  'centurion',
];

export const ORG_BADGES_EARNED: OrgBadgeId[] = ['sustained', 'rising'];
