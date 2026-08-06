export const HIGHLIGHTS = { organizationsActive: 10, templatesInUse: 10, runsThisMonth: 7200 };
export const ORGANIZATIONS_TOTAL = 15;
export const TEMPLATES_TOTAL = 15;
export const QUARTERLY_GOAL = { target: 15000, current: 9840 };
export const COST_SAVINGS_AT_GLANCE = { thisMonth: 3200, goal: 5000, lastMonth: 2000 };
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

export const topOrganizations = [
  { orgName: 'Platform Engineering', jobRuns: 2840, isYourOrg: true },
  { orgName: 'Security Operations', jobRuns: 1923 },
  { orgName: 'Cloud Infrastructure', jobRuns: 1654 },
  { orgName: 'Application Development', jobRuns: 1201 },
  { orgName: 'Data Analytics', jobRuns: 987 },
  { orgName: 'Network Services', jobRuns: 756 },
  { orgName: 'DevOps Enablement', jobRuns: 534 },
  { orgName: 'Quality Assurance', jobRuns: 412 },
  { orgName: 'Release Management', jobRuns: 298 },
  { orgName: 'IT Operations', jobRuns: 187 },
];

export const topTemplates = [
  { templateName: 'Infrastructure provisioning', runCount: 1247, org: 'Platform Engineering' },
  { templateName: 'Security compliance scan', runCount: 892, org: 'Security Operations' },
  { templateName: 'Application deployment', runCount: 756, org: 'Platform Engineering' },
  { templateName: 'Backup and restore', runCount: 534, org: 'Cloud Infrastructure' },
  { templateName: 'Patch management', runCount: 412, org: 'Security Operations' },
];

export const topProjects = [
  { projectName: 'Project A', totalJobs: 24, org: 'Platform Engineering' },
  { projectName: 'Project B', totalJobs: 18, org: 'Security Operations' },
  { projectName: 'Project C', totalJobs: 12, org: 'Cloud Infrastructure' },
  { projectName: 'Project D', totalJobs: 10, org: 'Application Development' },
  { projectName: 'Project E', totalJobs: 8, org: 'Platform Engineering' },
];

export const topHumanHoursReclaimed = [
  { userName: 'jdoe', hoursSaved: 124.5, org: 'Platform Engineering' },
  { userName: 'asmith', hoursSaved: 98.2, org: 'Security Operations' },
  { userName: 'mjones', hoursSaved: 87.0, org: 'Cloud Infrastructure' },
  { userName: 'kwilliams', hoursSaved: 72.3, org: 'Platform Engineering' },
  { userName: 'rjohnson', hoursSaved: 65.1, org: 'Application Development' },
];

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
  { id: 'humanHoursReclaimed', label: 'Human hours reclaimed', visible: true },
  { id: 'placeholder1', label: 'Placeholder panel 1', visible: true },
  { id: 'placeholder2', label: 'Placeholder panel 2', visible: true },
  { id: 'placeholder3', label: 'Placeholder panel 3', visible: true },
  { id: 'placeholder4', label: 'Placeholder panel 4', visible: true },
  { id: 'placeholder5', label: 'Placeholder panel 5', visible: true },
];

export const LEADERBOARD_PANEL_IDS = [
  'orgs',
  'templates',
  'projects',
  'users',
  'humanHoursReclaimed',
] as const;

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
