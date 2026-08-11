import { Button } from '@patternfly/react-core';
import AngleDoubleLeftIcon from '@patternfly/react-icons/dist/esm/icons/angle-double-left-icon';
import AngleDoubleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-double-right-icon';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GoalsPreviewControl } from '../../frontend/awx/analytics/automation-dashboard/post-ga/GoalsPreviewControl';

const OVERLAY_Z_INDEX = 1100;

function OverlayPanel({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div
      style={{
        background: '#fffde7',
        border: '2px dashed #f9a825',
        borderRadius: 8,
        padding: '4px 12px',
        fontSize: 13,
        lineHeight: 1.5,
        color: '#5d4037',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      }}
    >
      {children}
    </div>
  );
}

export function PrototypeSidebarOverlay() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  if (import.meta.env.VITE_DEMO_MODE !== 'true') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: 16,
        bottom: 72,
        zIndex: OVERLAY_Z_INDEX,
        display: 'flex',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      {isExpanded ? (
        <div style={{ width: 232, pointerEvents: 'auto' }}>
          <OverlayPanel>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  fontSize: 11,
                  color: '#f57f17',
                }}
              >
                {t('Prototype controls')}
              </span>
              <Button
                variant="plain"
                aria-label={t('Collapse prototype controls')}
                onClick={() => setIsExpanded(false)}
                style={{ padding: 4, minHeight: 'unset' }}
              >
                <AngleDoubleLeftIcon />
              </Button>
            </div>

            <GoalsPreviewControl />
          </OverlayPanel>
        </div>
      ) : (
        <Button
          variant="secondary"
          aria-label={t('Expand prototype controls')}
          onClick={() => setIsExpanded(true)}
          style={{
            pointerEvents: 'auto',
            borderRadius: '0 8px 8px 0',
            border: '2px dashed #f9a825',
            background: '#fffde7',
            fontSize: 13,
            lineHeight: 1.5,
            fontWeight: 700,
            color: '#5d4037',
            padding: '8px 10px',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            minHeight: 140,
          }}
          icon={<AngleDoubleRightIcon />}
          iconPosition="end"
        >
          {t('Prototype controls')}
        </Button>
      )}
    </div>
  );
}
