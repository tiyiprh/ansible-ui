import { Flex, Switch } from '@patternfly/react-core';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { PrototypeDemoControl } from '../../../../../platform/common/PrototypeDemoControl';
import {
  getGoalsPreviewMode,
  setGoalsPreviewMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';

export function GoalsPreviewControl() {
  const { t } = useTranslation();
  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );
  const isPopulated = previewMode === 'configured';

  return (
    <PrototypeDemoControl>
      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
        <span style={{ fontWeight: 400, textTransform: 'none' }}>{t('Goals')}</span>
        <span
          style={{
            fontWeight: 400,
            textTransform: 'none',
            opacity: isPopulated ? 0.55 : 1,
          }}
        >
          {t('Empty state')}
        </span>
        <Switch
          aria-label={t('Toggle goals preview between empty state and populated')}
          isChecked={isPopulated}
          hasCheckIcon
          onChange={(_event, checked) => {
            setGoalsPreviewMode(checked ? 'configured' : 'empty');
          }}
        />
        <span
          style={{
            fontWeight: 400,
            textTransform: 'none',
            opacity: isPopulated ? 1 : 0.55,
          }}
        >
          {t('Populated')}
        </span>
      </Flex>
    </PrototypeDemoControl>
  );
}
