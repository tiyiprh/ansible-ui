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
        <>
          <strong>Card title sizing</strong>: This tab uses a CSS override (
          <code>.post-ga-dashboard-tab</code>) to step card titles down one size (xl → lg) so
          they sit below a future smaller page-level title. The Leaderboards tab keeps standard
          xl card titles. For the real implementation, consider adding a{' '}
          <code>titleSize</code> prop to <code>PageDashboardCard</code> instead of the CSS
          override.
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
          Backend required: dedicated leaderboard/gamification metrics endpoints for streak calendar
          states, dimension scores/ranks, org leaderboard rows, achievement eligibility, and{' '}
          <code>last_sync</code> timestamp.
        </>,
        <>
          <strong>Admin toggle</strong>: Platform admins need a setting to enable/disable
          gamification features platform-wide for all users. This should be in the current Platform gateway
          settings page. When disabled, admins and auditors would see only the standard dashboard without Leaderboards
          tab content as they do today.
        </>,
        <>
          <strong>Top 10 organizations + 30-day achievements cards</strong>: These sit side by side
          using a PatternFly Grid and stack on smaller screens. The Overview page uses the
          framework&apos;s <code>PageDashboardCard</code> + <code>PageDashboard</code> for its
          responsive grid — consider using that for the real implementation so the cards
          share the same responsive breakpoints as the Overview tab.
        </>,
      ]}
      questions={[
        'Admin gamification toggle: gateway settings API field (e.g. gamification_enabled) vs metrics service config?',
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
