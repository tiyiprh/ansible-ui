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
          (AAP-85025) — merged locally on this branch, not in released AAP yet.
        </>,
        <>
          Secondary description text under <strong>Create new report</strong> and{' '}
          <strong>Update report</strong> menu items is a prototype extension on top of #3439 — needs a
          separate Jira if shipped.
        </>,
        <>
          <strong>Export CSV</strong> in the Cost calculation card header and subscription-cost toolbar
          layout (3-column form, header-to-fields spacing) are part of cherry-picked{' '}
          <a href="https://github.com/ansible/ansible-ui/pull/3435" target="_blank" rel="noreferrer">
            PR #3435
          </a>{' '}
          — not in released AAP yet.
        </>,
      ]}
    />
  );
}

export function PostGaLeaderboardsPrototypeNote() {
  return (
    <PrototypeNote
      notes={[
        <>
          Organizations rank by <strong>% of quarterly goal met</strong> using the saved quarterly run
          target; shows <strong>—</strong> when goals are not configured.
        </>,
      ]}
    />
  );
}

export function AutomationDashboardSettingsPrototypeNote() {
  return (
    <PrototypeNote
      notes={[
        <>
          <strong>Settings → Automation Dashboard</strong> is new (Gateway settings pattern). Goals and
          adoption levels persist in browser <code>localStorage</code> only — not metrics service DB.
        </>,
      ]}
      questions={[
        'Confirm with PM: settings storage on metrics service (per ANSTRAT) vs gateway API — and whether currency selector (Story 1) ships with that same settings payload.',
      ]}
    />
  );
}
