import { Content, Icon } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';
import { HIGHLIGHTS_LAST_SYNC } from './postGaMockData';

export function HighlightsSyncTimestamp() {
  const { t } = useTranslation();
  const syncedAt = new Date(HIGHLIGHTS_LAST_SYNC);
  const formatted = syncedAt.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  });

  return (
    <Content
      component="small"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
        color: 'var(--pf-t--global--text--color--subtle)',
        marginBottom: 'var(--pf-t--global--spacer--md)',
      }}
    >
      <Icon size="sm">
        <InfoCircleIcon color="var(--pf-t--global--text--color--subtle)" />
      </Icon>
      {t('All data is shown as from the last 30 days with the last sync on {{timestamp}} UTC', { timestamp: formatted })}
    </Content>
  );
}
