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
          Cost calc toolbar differs from <code>origin/devel</code>: hourly rate and monthly AAP cost
          use PF <strong>NumberInput</strong> (<code>FormGroup</code> label above, +/- steppers) — upstream
          uses <code>TextInput</code> <code>type=&quot;number&quot;</code> (
          <a href="https://issues.redhat.com/browse/AAP-85053" target="_blank" rel="noreferrer">
            AAP-85053
          </a>
          ).
        </>,
        <>
          <strong>Include automation creation time</strong> is an inline <strong>Checkbox</strong> (label +
          Help on one line), vertically aligned with the number inputs — not upstream&apos;s inline{' '}
          <strong>Switch</strong> with a longer label.
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
          <strong>Settings → Automation Analytics → Dashboard</strong> is new (Gateway settings pattern).
          Goals and adoption levels persist in browser <code>localStorage</code> only in the prototype — settings
          API in product.
        </>,
      ]}
      questions={[
        'Confirm with PM: settings storage on metrics service (per ANSTRAT) vs gateway API — and whether currency selector (Story 1) ships with that same settings payload.',
      ]}
    />
  );
}
