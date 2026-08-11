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
          <strong>Goals</strong> and <strong>Automation at a glance</strong> sit below the
          Highlights filters and Manage view control; they are not in Manage view.
        </>,
        <>
          When goals are not configured, both cards show an empty state with primary{' '}
          <strong>Configure goals</strong> (→ Settings Edit). Sidebar prototype overlay switches
          empty vs populated demo data.
        </>,
        <>
          Organizations rank by <strong>% of quarterly goal met</strong> using the saved quarterly
          run target; shows <strong>—</strong> when goals are not configured.
        </>,
        <>
          <strong>Automation adoption</strong> level (<code>MATURITY_LEVEL</code> in mock data) is
          hardcoded — product needs a backend scorecard from platform metrics. CMMI-style level{' '}
          <strong>names/descriptions</strong> are industry-standard defaults; GA UI shows{' '}
          <strong>level name + description only</strong> (no decimal score).
        </>,
      ]}
      questions={[
        'Should Automation at a glance show org %, template %, runs, and success streak before goals are configured? In product these metrics could be computed from existing metrics data without goal targets; the prototype gates both cards on goals (G-3).',
        'Should adoption be a scorecard (4–6 platform metrics, each mapped to 0–5), with the displayed level derived from the lowest sub-score or a weighted average? Which inputs are in scope for GA (e.g. org/template activity, utilization, standardization, job reliability, governance)?',
        'For GA UI, confirm level name + description only (no decimal like “3.2 out of 5”). Should level thresholds be configurable in Settings alongside level names, or fixed by the product?',
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
          <strong>Settings → Automation Analytics → Dashboard</strong> is new (Gateway settings
          pattern). Goals and adoption levels persist in browser <code>localStorage</code> only in
          the prototype — settings API in product.
        </>,
        <>
          Goal fields have no industry-standard default — admins configure org-specific targets.
          Adoption levels ship with five CMMI-style default rows.
        </>,
      ]}
      questions={[
        'Confirm with PM: settings storage on metrics service (per ANSTRAT) vs gateway API — and whether currency selector (Story 1) ships with that same settings payload.',
        'Aug 10 sync discussed pre-populated numeric goal defaults; prototype ships empty quarterly run and monthly savings fields (org-specific KPIs). Confirm with PM that empty factory defaults are preferred over suggested or pre-filled targets.',
      ]}
    />
  );
}
