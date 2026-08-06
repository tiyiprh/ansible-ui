import { HttpResponse, http } from 'msw';

const METRICS = '/api/metrics/v1';

const emptyList = { count: 0, results: [], next: null, previous: null };

// ─── Mock filter option data ──────────────────────────────────────────────────

const mockOrganizations = [
  { id: 1, name: 'Platform Engineering' },
  { id: 2, name: 'Security Operations' },
  { id: 3, name: 'Cloud Infrastructure' },
  { id: 4, name: 'Application Development' },
  { id: 5, name: 'Data Analytics' },
];

const mockProjects = [
  { id: 1, name: 'Main project' },
  { id: 2, name: 'POC - Automation' },
  { id: 3, name: 'Legacy migration' },
  { id: 4, name: 'CI/CD pipeline' },
  { id: 5, name: 'Security audit' },
];

const mockTemplates = [
  { id: 1, name: 'Infrastructure provisioning' },
  { id: 2, name: 'Security compliance scan' },
  { id: 3, name: 'Application deployment' },
  { id: 4, name: 'Backup and restore' },
  { id: 5, name: 'Patch management' },
];

const mockLabels = [
  { id: 1, name: 'Production' },
  { id: 2, name: 'Staging' },
  { id: 3, name: 'Development' },
  { id: 4, name: 'Critical' },
  { id: 5, name: 'Compliance' },
];

// ─── Mock report details (IDashboardDetails) ─────────────────────────────────

// Generate last 7 days of chart data
function buildDailyChartData(
  values: number[]
): { kind: 'day'; items: { label: string; value: number }[] } {
  const now = new Date();
  const items = values.map((value, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (values.length - 1 - i));
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { label, value };
  });
  return { kind: 'day', items };
}

const mockDetails = {
  total_number_of_successful_jobs: 7284,
  total_number_of_failed_jobs: 312,
  total_number_of_unique_hosts: 842,
  cost_of_automated_execution: 1240.5,
  cost_of_manual_automation: 18600.0,
  total_hours_of_automation: 309.0,
  total_saving: 17359.5,
  total_time_saving: 18600,
  total_number_of_host_job_runs: 24680,
  total_number_of_job_runs: 7596,
  top_projects: [
    { id: 1, name: 'Main project', execution_count: 2840 },
    { id: 4, name: 'CI/CD pipeline', execution_count: 1923 },
    { id: 2, name: 'POC - Automation', execution_count: 1654 },
    { id: 3, name: 'Legacy migration', execution_count: 1201 },
    { id: 5, name: 'Security audit', execution_count: 987 },
  ],
  top_users: [
    { id: 1, name: 'jdoe', execution_count: 2451 },
    { id: 2, name: 'asmith', execution_count: 1876 },
    { id: 3, name: 'mjones', execution_count: 1432 },
    { id: 4, name: 'kwilliams', execution_count: 987 },
    { id: 5, name: 'rjohnson', execution_count: 754 },
  ],
  job_chart: buildDailyChartData([892, 756, 1043, 934, 1102, 879, 990]),
  host_chart: buildDailyChartData([3200, 2800, 3650, 3100, 4200, 3400, 3730]),
};

// ─── Mock job template report rows (IJobTemplate) ────────────────────────────

const mockReportRows = [
  {
    id: 1,
    template_name: 'Infrastructure provisioning',
    runs: 1247,
    num_hosts: 245,
    time_taken_manually_execute_minutes: 45,
    time_taken_create_automation_minutes: 30,
    elapsed: '120',
    elapsed_str: '2 min',
    automated_costs: 498.8,
    manual_costs: 9352.5,
    savings: 8853.7,
    time_savings: 9352.5,
    time_savings_str: '155 hr 52 min',
  },
  {
    id: 2,
    template_name: 'Security compliance scan',
    runs: 892,
    num_hosts: 892,
    time_taken_manually_execute_minutes: 30,
    time_taken_create_automation_minutes: 20,
    elapsed: '90',
    elapsed_str: '1 min 30 sec',
    automated_costs: 267.6,
    manual_costs: 4460.0,
    savings: 4192.4,
    time_savings: 4460.0,
    time_savings_str: '74 hr 20 min',
  },
  {
    id: 3,
    template_name: 'Application deployment',
    runs: 756,
    num_hosts: 120,
    time_taken_manually_execute_minutes: 60,
    time_taken_create_automation_minutes: 40,
    elapsed: '180',
    elapsed_str: '3 min',
    automated_costs: 226.8,
    manual_costs: 7560.0,
    savings: 7333.2,
    time_savings: 7560.0,
    time_savings_str: '126 hr',
  },
  {
    id: 4,
    template_name: 'Backup and restore',
    runs: 534,
    num_hosts: 78,
    time_taken_manually_execute_minutes: 20,
    time_taken_create_automation_minutes: 15,
    elapsed: '60',
    elapsed_str: '1 min',
    automated_costs: 160.2,
    manual_costs: 1780.0,
    savings: 1619.8,
    time_savings: 1780.0,
    time_savings_str: '29 hr 40 min',
  },
  {
    id: 5,
    template_name: 'Patch management',
    runs: 412,
    num_hosts: 412,
    time_taken_manually_execute_minutes: 25,
    time_taken_create_automation_minutes: 20,
    elapsed: '75',
    elapsed_str: '1 min 15 sec',
    automated_costs: 123.6,
    manual_costs: 1716.67,
    savings: 1593.07,
    time_savings: 1716.67,
    time_savings_str: '28 hr 36 min',
  },
];

// ─── Mock subscription costs ──────────────────────────────────────────────────

const mockSubscriptionCosts = [
  {
    id: 1,
    monthly_subscription_cost: 2000,
    engineer_avg_hourly_rate: 50,
    include_template_creation_time_in_costs: false,
  },
];

// ─── Handlers ─────────────────────────────────────────────────────────────────

export const metricsHandlers = [
  // Collection status — enabled=true so the dashboard renders
  http.get(`${METRICS}/dashboard_reports/collection_status/`, () =>
    HttpResponse.json({
      enabled: true,
      next_run: new Date(Date.now() + 55 * 60 * 1000).toISOString(),
      initial_collection_status: 'successful',
    })
  ),

  // Report details (the value cards + charts + top tables)
  http.get(`${METRICS}/dashboard_reports/report/details/`, () =>
    HttpResponse.json(mockDetails)
  ),

  // Report rows (the main cost table)
  http.get(`${METRICS}/dashboard_reports/report/`, () =>
    HttpResponse.json({
      count: mockReportRows.length,
      results: mockReportRows,
      next: null,
      previous: null,
    })
  ),

  // Filter sets (saved reports)
  http.get(`${METRICS}/dashboard_reports/filter_sets/`, () =>
    HttpResponse.json(emptyList)
  ),
  http.post(`${METRICS}/dashboard_reports/filter_sets/`, async ({ request }) => {
    const body = (await request.json()) as { name: string; filters: string };
    return HttpResponse.json({ id: Date.now(), name: body.name, filters: body.filters, is_default: false }, { status: 201 });
  }),
  http.patch(`${METRICS}/dashboard_reports/filter_sets/:id/`, async ({ params, request }) => {
    const body = (await request.json()) as { name?: string; filters?: string };
    return HttpResponse.json({ id: Number(params.id), ...body, is_default: false });
  }),
  http.delete(`${METRICS}/dashboard_reports/filter_sets/:id/`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  // Filter options
  http.get(`${METRICS}/dashboard_reports/organizations/`, () =>
    HttpResponse.json({ count: mockOrganizations.length, results: mockOrganizations, next: null, previous: null })
  ),
  http.get(`${METRICS}/dashboard_reports/organizations`, () =>
    HttpResponse.json({ count: mockOrganizations.length, results: mockOrganizations, next: null, previous: null })
  ),
  http.get(`${METRICS}/dashboard_reports/projects/`, () =>
    HttpResponse.json({ count: mockProjects.length, results: mockProjects, next: null, previous: null })
  ),
  http.get(`${METRICS}/dashboard_reports/projects`, () =>
    HttpResponse.json({ count: mockProjects.length, results: mockProjects, next: null, previous: null })
  ),
  http.get(`${METRICS}/dashboard_reports/templates/`, () =>
    HttpResponse.json({ count: mockTemplates.length, results: mockTemplates, next: null, previous: null })
  ),
  http.get(`${METRICS}/dashboard_reports/templates`, () =>
    HttpResponse.json({ count: mockTemplates.length, results: mockTemplates, next: null, previous: null })
  ),
  http.get(`${METRICS}/dashboard_reports/labels/`, () =>
    HttpResponse.json({ count: mockLabels.length, results: mockLabels, next: null, previous: null })
  ),
  http.get(`${METRICS}/dashboard_reports/labels`, () =>
    HttpResponse.json({ count: mockLabels.length, results: mockLabels, next: null, previous: null })
  ),

  // Subscription costs — list endpoint returns a plain array (not paginated)
  http.get(`${METRICS}/dashboard_reports/subscription_costs/`, () =>
    HttpResponse.json(mockSubscriptionCosts)
  ),
  http.put(`${METRICS}/dashboard_reports/subscription_costs/:id/`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<(typeof mockSubscriptionCosts)[0]>;
    const updated = { ...mockSubscriptionCosts[0], id: Number(params.id), ...body };
    mockSubscriptionCosts[0] = updated;
    return HttpResponse.json(updated);
  }),
  http.patch(`${METRICS}/dashboard_reports/subscription_costs/:id/`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<(typeof mockSubscriptionCosts)[0]>;
    const updated = { ...mockSubscriptionCosts[0], id: Number(params.id), ...body };
    mockSubscriptionCosts[0] = updated;
    return HttpResponse.json(updated);
  }),

  // Template metadata (for cost table row editing)
  http.get(`${METRICS}/dashboard_reports/template_metadata/:id/`, ({ params }) =>
    HttpResponse.json({
      id: Number(params.id),
      time_taken_manually_execute_minutes: 30,
      time_taken_create_automation_minutes: 20,
    })
  ),
  http.put(`${METRICS}/dashboard_reports/template_metadata/:id/`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: Number(params.id), ...body });
  }),
  http.patch(`${METRICS}/dashboard_reports/template_metadata/:id/`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: Number(params.id), ...body });
  }),
];
