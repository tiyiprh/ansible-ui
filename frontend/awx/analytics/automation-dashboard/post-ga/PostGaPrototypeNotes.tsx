import { PrototypeNote } from '../../../../../platform/common/PrototypeNote';

export function GaDashboardToolbarPrototypeNote({
  defaultOpen,
}: Readonly<{ defaultOpen?: boolean }> = {}) {
  return (
    <PrototypeNote
      defaultOpen={defaultOpen}
      notes={[
        <>
          <strong>Report actions</strong> menu: <strong>Create new report</strong>,{' '}
          <strong>Update report</strong>, and <strong>Delete report</strong> with matching modal
          titles, descriptions, and disabled-state tooltips (
          <a href="https://issues.redhat.com/browse/AAP-85025" target="_blank" rel="noreferrer">
            AAP-85025
          </a>
          ).
        </>,
        <>
          When a saved report is selected, the <strong>Report actions</strong> dropdown is
          text-only (no icon). Standalone <strong>Create new report</strong> keeps{' '}
          <strong>PlusCircleIcon</strong> when no saved report is selected (
          <a href="https://issues.redhat.com/browse/AAP-87098" target="_blank" rel="noreferrer">
            AAP-87098
          </a>
          ).
        </>,
        <>
          Secondary description text under <strong>Create new report</strong> and{' '}
          <strong>Update report</strong> menu items clarifies each action; <strong>Delete report</strong>{' '}
          has no description (
          <a href="https://issues.redhat.com/browse/AAP-87097" target="_blank" rel="noreferrer">
            AAP-87097
          </a>
          ).
        </>,
        <>
          <strong>Export CSV</strong> sits in the Cost calculation card header, not the toolbar (
          <a href="https://issues.redhat.com/browse/AAP-85062" target="_blank" rel="noreferrer">
            AAP-85062
          </a>
          ).
        </>,
        <>
          Cost toolbar uses PF <strong>NumberInput</strong> for hourly rate and monthly AAP cost in a
          3-column grid with <code>reserveErrorSpace</code> so validation errors do not shift the
          row. Per-row <strong>Time taken to manually execute</strong> uses <strong>TextInput</strong>{' '}
          <code>type=&quot;number&quot;</code> in the table (
          <a href="https://issues.redhat.com/browse/AAP-85053" target="_blank" rel="noreferrer">
            AAP-85053
          </a>
          ).
        </>,
        <>
          <strong>Include automation creation time</strong> is an inline <strong>Checkbox</strong>{' '}
          (label + Help on one line) in the third grid column — open PM decision vs{' '}
          <strong>Switch</strong> (
          <a href="https://issues.redhat.com/browse/AAP-85053" target="_blank" rel="noreferrer">
            AAP-85053
          </a>
          ).
        </>,
        <>
          Successful inline saves for subscription costs and per-row template metadata do{' '}
          <strong>not</strong> show success toasts; error and refresh-failure toasts remain (
          <a href="https://issues.redhat.com/browse/AAP-85060" target="_blank" rel="noreferrer">
            AAP-85060
          </a>
          ).
        </>,
        <>
          Cost KPI and toolbar <strong>Help</strong> popover copy follows PatternFly content
          guidelines — 1–3 concise sentences, second person (
          <a href="https://issues.redhat.com/browse/AAP-87099" target="_blank" rel="noreferrer">
            AAP-87099
          </a>
          ).
        </>,
      ]}
    />
  );
}

export function PostGaHighlightsPrototypeNote({
  defaultOpen,
}: Readonly<{ defaultOpen?: boolean }> = {}) {
  return (
    <PrototypeNote
      defaultOpen={defaultOpen}
      notes={[
        <>
          Toolbar (period + organization) → <strong>Automation at a glance</strong> card → four{' '}
          <strong>Top 5</strong> panels.
        </>,
        <>
          Period filter (<strong>This month</strong> / <strong>This quarter</strong> /{' '}
          <strong>All time</strong>) is independent from the Dashboard tab DateRange filter.
        </>,
        <>
          At-a-glance metrics, org leaderboard, and template fallback rows are mock data in{' '}
          <code>postGaMockData.ts</code>, scaled when period or org filter changes.
        </>,
        <>
          <strong>Projects</strong>, <strong>users</strong>, and <strong>templates</strong> use live{' '}
          <code>dashboard_reports/report/details/</code> data — period only in this prototype; org IDs
          are not passed to the API yet.
        </>,
        <>
          <strong>Success streak</strong> is always platform-wide (last 30 days) — not scoped by period
          or organization filters.
        </>,
        <>
          Column headers: <strong>Projects</strong> — <strong>Total jobs</strong>;{' '}
          <strong>Templates</strong>, <strong>Organizations</strong>, <strong>Users</strong> —{' '}
          <strong>Total job runs</strong>. Org filter uses prototype org names; product should use
          gateway org IDs.
        </>,
      ]}
      questions={[
        'Wire organization filter to report details so top_projects, top_users, and template runs respect the Leaderboards org multi-select (API supports org filter; prototype gap).',
        'Does top_projects use a distinct job-count field, or is execution_count acceptable for v1?',
        'Org leaderboard: rank by successful job runs only — which metrics-service field or status filter?',
      ]}
    />
  );
}

export function PostGaGamificationPrototypeNote({
  defaultOpen,
}: Readonly<{ defaultOpen?: boolean }> = {}) {
  return (
    <PrototypeNote
      defaultOpen={defaultOpen}
      notes={[
        <>
          Frozen snapshot of the prior gamification direction — do not edit for the new Leaderboards
          work. Tab tooltip: future-scoped concepts, not current release. Implementation handoff:{' '}
          <code>CHANGES-Gamification.md</code>. Active direction: <strong>Leaderboards</strong> tab (
          <code>AutomationDashboardLeaderboards.tsx</code>).
        </>,
        <>
          <strong>Automation health</strong>, <strong>Automation trends</strong>,{' '}
          <strong>At a glance</strong> metrics, <strong>Achievements</strong>, and{' '}
          <strong>Top organizations / templates</strong> rows are mock data in{' '}
          <code>postGaMockData.ts</code>, scaled when period or org filter changes — not live API
          responses.
        </>,
        <>
          <strong>Projects</strong> and <strong>users</strong> leaderboards use live metrics-service{' '}
          <code>top_projects</code> / <code>top_users</code> from{' '}
          <code>GET /api/metrics/v1/dashboard_reports/report/details/</code> (period only).{' '}
          <strong>Templates</strong> use report list <code>runs</code> when loaded; mock fallback
          otherwise.
        </>,
        <>
          Backend required: <code>top_organizations</code> on the details endpoint; org leaderboard
          ranked by <strong>% of quarterly goal met</strong> (G-5) — prototype still mocks{' '}
          <code>execution_count</code>. Week-over-week trend values, job success breakdown, velocity
          series, template reuse %, daily streak cells, and achievement tier state all need metrics
          definitions (or a dedicated gamification/achievements API).
        </>,
        <>
          Organization filter uses prototype org names (<code>FILTER_ORGANIZATIONS</code>) — product
          should use real org IDs. Org filter does not scope live API panels today.
        </>,
        <>
          Eight <strong>Achievement</strong> badges and bronze/silver/gold thresholds are computed
          client-side from <code>ACHIEVEMENT_METRICS</code> — demo values tuned to show earned and
          locked tiers. Earned-first sort order is a prototype UX choice.
        </>,
      ]}
      questions={[
        'Org leaderboard for GA: rank by % of quarterly goal met (G-5) or execution_count?',
        'Day 0: show a row of locked achievement badges, placeholder copy, or hide achievements until the first job runs?',
        'Remove Org Adoption and Daily Streak badges? They overlap org active % (At a glance) and success streak (Automation health).',
        'Recovery / Clean week / Run distribution / Execution balance — confirm thresholds and whether canceled jobs count like failures for streak and success rate.',
      ]}
    />
  );
}

/** @deprecated Use PostGaHighlightsPrototypeNote */
export const PostGaLeaderboardsPrototypeNote = PostGaHighlightsPrototypeNote;

export function AutomationDashboardSettingsPrototypeNote({
  defaultOpen,
}: Readonly<{ defaultOpen?: boolean }> = {}) {
  return (
    <PrototypeNote
      defaultOpen={defaultOpen}
      notes={[
        <>
          <strong>Settings → Automation Analytics → Dashboard</strong> may be hidden in demo nav;
          route and form remain in codebase for handoff. Goal targets persist in browser{' '}
          <code>localStorage</code> only in the prototype — settings API in product.
        </>,
      ]}
      questions={[
        'Confirm with PM: settings storage on metrics service (per ANSTRAT) vs gateway API — and whether currency selector (Story 1) ships with that same settings payload.',
        'Aug 10 sync discussed pre-populated numeric goal defaults; prototype ships empty quarterly run and monthly savings fields (org-specific KPIs). Confirm with PM that empty factory defaults are preferred over suggested or pre-filled targets.',
      ]}
    />
  );
}
