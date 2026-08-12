export const HIGHLIGHTS = { organizationsActive: 10, templatesInUse: 10, runsThisMonth: 7200 };
export const ORGANIZATIONS_TOTAL = 15;
export const TEMPLATES_TOTAL = 15;
export const QUARTERLY_GOAL = { target: 15000, current: 9840 };
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
  const successByIndex = [
    true, false, true, true, false, true, false, true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, false, true, true, true, false, true, true, true, true,
  ];
  const runsByIndex = [
    125, 0, 98, 210, 0, 45, 0, 88, 156, 203, 189, 244, 167, 221, 198, 176, 134, 212, 155, 178,
    142, 0, 165, 199, 88, 0, 112, 201, 167, 190,
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

export const QUARTER_COMPARISON = {
  runs: { current: 9840, previous: 7200 },
  savings: { current: 3200, previous: 2000 },
  hosts: { current: 1247, previous: 980 },
};

export const SPARKLINE_DATA = {
  orgActivity: [58, 60, 62, 59, 64, 65, 67],
  templateUtil: [60, 62, 58, 63, 65, 64, 67],
  runs: [980, 1020, 1100, 1050, 1150, 1180, 1200],
};

export const topOrganizations = [
  { orgName: 'Platform Engineering', jobRuns: 2840, isYourOrg: true, trend: 'up' as const },
  { orgName: 'Security Operations', jobRuns: 1923, trend: 'up' as const },
  { orgName: 'Cloud Infrastructure', jobRuns: 1654, trend: 'down' as const },
  { orgName: 'Application Development', jobRuns: 1201, trend: 'steady' as const },
  { orgName: 'Data Analytics', jobRuns: 987, trend: 'up' as const },
  { orgName: 'Network Services', jobRuns: 756, trend: 'down' as const },
  { orgName: 'DevOps Enablement', jobRuns: 534, trend: 'steady' as const },
  { orgName: 'Quality Assurance', jobRuns: 412, trend: 'up' as const },
  { orgName: 'Release Management', jobRuns: 298, trend: 'down' as const },
  { orgName: 'IT Operations', jobRuns: 187, trend: 'steady' as const },
];

export const topTemplates = [
  { templateName: 'Infrastructure provisioning', runCount: 1247, org: 'Platform Engineering', trend: 'up' as const },
  { templateName: 'Security compliance scan', runCount: 892, org: 'Security Operations', trend: 'steady' as const },
  { templateName: 'Application deployment', runCount: 756, org: 'Platform Engineering', trend: 'up' as const },
  { templateName: 'Backup and restore', runCount: 534, org: 'Cloud Infrastructure', trend: 'down' as const },
  { templateName: 'Patch management', runCount: 412, org: 'Security Operations', trend: 'up' as const },
];

export const topProjects = [
  { projectName: 'Project A', totalJobs: 24, org: 'Platform Engineering', trend: 'up' as const },
  { projectName: 'Project B', totalJobs: 18, org: 'Security Operations', trend: 'steady' as const },
  { projectName: 'Project C', totalJobs: 12, org: 'Cloud Infrastructure', trend: 'down' as const },
  { projectName: 'Project D', totalJobs: 10, org: 'Application Development', trend: 'up' as const },
  { projectName: 'Project E', totalJobs: 8, org: 'Platform Engineering', trend: 'steady' as const },
];

export const topUsers = [
  { userName: 'jsmith', displayName: 'John Smith', jobRuns: 487, org: 'Platform Engineering', trend: 'up' as const },
  { userName: 'agarcia', displayName: 'Ana Garcia', jobRuns: 342, org: 'Security Operations', trend: 'steady' as const },
  { userName: 'mchen', displayName: 'Michael Chen', jobRuns: 278, org: 'Cloud Infrastructure', trend: 'up' as const },
  { userName: 'kwilson', displayName: 'Karen Wilson', jobRuns: 195, org: 'Platform Engineering', trend: 'down' as const },
  { userName: 'rpatel', displayName: 'Raj Patel', jobRuns: 163, org: 'Data Analytics', trend: 'up' as const },
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
