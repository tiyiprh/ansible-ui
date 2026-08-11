import { PrototypeNote } from '../../../../../platform/common/PrototypeNote';

export function GaDashboardToolbarPrototypeNote() {
  return (
    <PrototypeNote
      notes={[
        <>
          <strong>Report actions</strong> menu labels and Create/Update report dialogs match open upstream{' '}
          <a href="https://github.com/ansible/ansible-ui/pull/3439" target="_blank" rel="noreferrer">
            PR #3439
          </a>{' '}
          (
          <a href="https://issues.redhat.com/browse/AAP-85025" target="_blank" rel="noreferrer">
            AAP-85025
          </a>
          ) — merged locally on this branch, not in released AAP yet.
        </>,
        <>
          When a saved report is selected, the toolbar shows a text-only <strong>Report actions</strong>{' '}
          dropdown — #3439 still uses <strong>PlusCircleIcon</strong> on the
          dropdown, which reads as &quot;create only.&quot; Standalone <strong>Create new report</strong>{' '}
          (no saved report selected) keeps <strong>PlusCircleIcon</strong>.
        </>,
        <>
          Secondary description text under <strong>Create new report</strong> and{' '}
          <strong>Update report</strong> menu items is a prototype extension on top of #3439 — needs a
          separate Jira if shipped.
        </>,
        <>
          <strong>Export CSV</strong> in the Cost calculation card header is from cherry-picked{' '}
          <a href="https://github.com/ansible/ansible-ui/pull/3435" target="_blank" rel="noreferrer">
            PR #3435
          </a>{' '}
          — not in released AAP yet.
        </>,
        <>
          Cost calc toolbar uses PF <strong>NumberInput</strong> for hourly rate and monthly AAP cost (
          <a href="https://issues.redhat.com/browse/AAP-85053" target="_blank" rel="noreferrer">
            AAP-85053
          </a>
          ). Per-row <strong>Time taken to manually execute</strong> uses <strong>TextInput</strong>{' '}
          <code>type=&quot;number&quot;</code> in the table — PF guidance for dense table cells.
        </>,
        <>
          Successful saves for subscription costs and per-row template metadata do <strong>not</strong>{' '}
          show success toasts — inline field update only. Error and refresh-failure toasts remain.
        </>,
        <>
          <strong>Include automation creation time</strong> is an inline <strong>Checkbox</strong> (label +
          Help on one line) in the third grid column — not upstream&apos;s inline <strong>Switch</strong> with a
          longer label. Cost toolbar uses a 3-column grid matching <code>PageFormGrid</code> breakpoints (
          <code>xl2=&#123;4&#125;</code>); checkbox column uses top/bottom padding to bracket the NumberInput
          control band and <code>align-items: center</code> so it vertically centers on the inputs only (not label or
          error rows); number fields use <code>reserveErrorSpace</code> so validation errors do not shift the row.
          Export CSV stays in the card header only.
        </>,
      ]}
    />
  );
}

export function PostGaHighlightsPrototypeNote() {
  return (
    <PrototypeNote
      notes={[
        <>
          <strong>Goals</strong> and <strong>Automation at a glance</strong> sit below the Highlights
          filters and Manage view control; they are not in Manage view.
        </>,
        <>
          When goals are not configured, both cards show an empty state with primary{' '}
          <strong>Configure goals</strong> (→ Settings Edit). Page header preview toggle switches empty vs
          populated demo data.
        </>,
        <>
          Organizations rank by <strong>% of quarterly goal met</strong> using the saved quarterly run
          target; shows <strong>—</strong> when goals are not configured.
        </>,
        <>
          <strong>Automation adoption</strong> level (<code>MATURITY_LEVEL</code> in mock data) is
          hardcoded — product needs a backend scorecard from platform metrics. CMMI-style level{' '}
          <strong>names/descriptions</strong> are industry-standard defaults; GA UI shows{' '}
          <strong>level name + description only</strong> (no decimal score).
        </>,
      ]}
      questions={[
        'Should adoption be a scorecard (4–6 platform metrics, each mapped to 0–5), with the displayed level derived from the lowest sub-score or a weighted average? Which inputs are in scope for GA (e.g. org/template activity, utilization, standardization, job reliability, governance)?',
        'For GA UI, confirm level name + description only (no decimal like “3.2 out of 5”). Should level thresholds be configurable in Settings alongside level names, or fixed by the product?',
      ]}
    />
  );
}

/** @deprecated Use PostGaHighlightsPrototypeNote */
export const PostGaLeaderboardsPrototypeNote = PostGaHighlightsPrototypeNote;

export function AutomationDashboardSettingsPrototypeNote() {
  return (
    <PrototypeNote
      notes={[
        <>
          <strong>Settings → Automation Analytics → Dashboard</strong> is new (Gateway settings pattern).
          Goals and adoption levels persist in browser <code>localStorage</code> only in the prototype — settings
          API in product.
        </>,
        <>
          Goal fields have no industry-standard default — admins configure org-specific targets. Adoption
          levels ship with five CMMI-style default rows.
        </>,
      ]}
      questions={[
        'Confirm with PM: settings storage on metrics service (per ANSTRAT) vs gateway API — and whether currency selector (Story 1) ships with that same settings payload.',
        'Aug 10 sync discussed pre-populated numeric goal defaults; prototype ships empty quarterly run and monthly savings fields (org-specific KPIs). Confirm with PM that empty factory defaults are preferred over suggested or pre-filled targets.',
      ]}
    />
  );
}
