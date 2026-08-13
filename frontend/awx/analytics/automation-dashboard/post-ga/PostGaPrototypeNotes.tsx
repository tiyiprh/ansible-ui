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
          When a saved report is selected, the <strong>Report actions</strong> dropdown is text-only
          (no icon). Standalone <strong>Create new report</strong> keeps{' '}
          <strong>PlusCircleIcon</strong> when no saved report is selected (
          <a href="https://issues.redhat.com/browse/AAP-87098" target="_blank" rel="noreferrer">
            AAP-87098
          </a>
          ).
        </>,
        <>
          Secondary description text under <strong>Create new report</strong> and{' '}
          <strong>Update report</strong> menu items clarifies each action;{' '}
          <strong>Delete report</strong> has no description (
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
          Cost toolbar uses PF <strong>NumberInput</strong> for hourly rate and monthly AAP cost in
          a 3-column grid with <code>reserveErrorSpace</code> so validation errors do not shift the
          row. Per-row <strong>Time taken to manually execute</strong> uses{' '}
          <strong>TextInput</strong> <code>type=&quot;number&quot;</code> in the table (
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
          <strong>Highlights</strong> tab implements{' '}
          <a
            href="https://redhat.atlassian.net/browse/ANSTRAT-1976"
            target="_blank"
            rel="noreferrer"
          >
            ANSTRAT-1976
          </a>
          . The interim <strong>Leaderboards</strong> admin tab and{' '}
          <strong>Gamification (concepts)</strong> tab are retired — content converges here.
        </>,
        <>
          Fixed <strong>30-day</strong> window for all sections. No period or organization toolbar
          filters. Streak calendar days use <strong>UTC</strong>.
        </>,
        <>
          Section order: sync timestamp → automation streak (§1) → dimensions (§2) → leaderboard
          (§3) → milestone badges (§4) → automation at a glance (§5). Mock shapes in{' '}
          <code>postGaMockData.ts</code> (<code>HIGHLIGHTS_*</code>, <code>MILESTONE_*</code>).
        </>,
        <>
          <strong>Featured template</strong> = single template with the most runs in the 30-day
          window, as of last sync (~hourly). <strong>Service accounts</strong> (e.g.{' '}
          <code>awx-runner</code>) appear on the user leaderboard per spec.
        </>,
        <>
          <strong>Milestone badges</strong>: 7 badges (Ignition, Week Warrior, Month Warrior,
          Explorer, Centurion, Reliable, Accelerator). Earned/locked only — no bronze/silver/gold
          tiers. Badges re-earn each window; no lifetime history. Org badges assume the same 7 rules
          at org scope (pending PM confirmation).
        </>,
        <>
          Backend required: dedicated highlights/gamification metrics endpoints (or extensions to
          metrics service) for streak calendar states, dimension scores/ranks, leaderboard rows,
          badge eligibility, and <code>last_sync</code> timestamp.
        </>,
        <>
          <strong>Admin toggle</strong>: Platform admins need a setting (likely under{' '}
          <strong>Settings → General</strong> or a new <strong>Dashboard</strong> subsection) to
          enable/disable gamification features platform-wide. When disabled, users see only the
          standard dashboard without Highlights tab content (streaks, badges, leaderboard).
        </>,
      ]}
      questions={[
        'Org Reliable badge: does the 20 consecutive successful jobs rule apply at org scope the same way as for individuals?',
        'Service accounts on the user leaderboard: show a "Service account" label, distinct icon, or plain username only?',
        'Org leaderboard ranking: successful job runs only — confirm status filter and field names when API lands.',
        'Admin gamification toggle: gateway settings API field (e.g. gamification_enabled) vs metrics service config? Should this be a single on/off or granular per-feature (badges, streaks, leaderboard)?',
      ]}
    />
  );
}

/** @deprecated Retired with Highlights consolidation — see PostGaHighlightsPrototypeNote */
export function PostGaGamificationPrototypeNote({
  defaultOpen,
}: Readonly<{ defaultOpen?: boolean }> = {}) {
  return <PostGaHighlightsPrototypeNote defaultOpen={defaultOpen} />;
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
