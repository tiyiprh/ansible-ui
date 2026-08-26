import { Content, Icon } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';
import { HIGHLIGHTS_LAST_SYNC } from './postGaMockData';

export function HighlightsPageIntro() {
  const { t } = useTranslation();
  const syncedAt = new Date(HIGHLIGHTS_LAST_SYNC);
  const formatted = syncedAt.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  });

  return (
    <div style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
      <Content
        component="small"
        style={{ color: 'var(--pf-t--global--text--color--subtle)', marginBottom: 8 }}
      >
        {t(
          'All data shown is for the last 30 days, based on your most active organization. Platform rankings show activity across all organizations.'
        )}
      </Content>
      <Content
        component="small"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: 'var(--pf-t--global--text--color--subtle)',
        }}
      >
        <Icon size="sm">
          <InfoCircleIcon color="var(--pf-t--global--text--color--subtle)" />
        </Icon>
        {t('Last synced {{timestamp}} UTC', { timestamp: formatted })}
      </Content>
    </div>
  );
}

/** @deprecated Use HighlightsPageIntro */
export const HighlightsSyncTimestamp = HighlightsPageIntro;
