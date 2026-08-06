import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import { useState } from 'react';

const JIRA_URL = 'https://issues.redhat.com/browse/AAP-85988';

export function PrototypeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (import.meta.env.VITE_DEMO_MODE !== 'true' || dismissed) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'auto',
        whiteSpace: 'nowrap',
        zIndex: 9999,
        backgroundColor: '#f0ab00',
        color: '#1b1d21',
        borderRadius: '0 0 8px 8px',
        padding: '10px 20px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
      <span>
        <strong>UX Prototype</strong> —{' '}
        <a
          href={JIRA_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#1b1d21', fontWeight: 600 }}
        >
          AAP-85988
        </a>
        {' · '}
        All data is mocked, no real backend · Form submissions reset on page refresh
      </span>
      <button
        type="button"
        aria-label="Dismiss prototype notice"
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 2,
          color: '#1b1d21',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TimesIcon />
      </button>
    </div>
  );
}
