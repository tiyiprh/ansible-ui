import { Flex, FormGroup, FormSelect, FormSelectOption } from '@patternfly/react-core';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GoalsPreviewMode,
  getGoalsPreviewMode,
  setGoalsPreviewMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';

const MODES: readonly { value: GoalsPreviewMode; label: string }[] = [
  { value: 'configured', label: 'Populated' },
  { value: 'day0', label: 'Day 0 (no data)' },
];

export function GoalsPreviewControl() {
  const { t } = useTranslation();
  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );

  return (
    <Flex direction={{ default: 'column' }} gap={{ default: 'gapXs' }}>
      <FormGroup label={t('Dashboard data')} fieldId="dashboard-data-mode">
        <FormSelect
          id="dashboard-data-mode"
          value={previewMode}
          onChange={(_event, value) => setGoalsPreviewMode(value as GoalsPreviewMode)}
          aria-label={t('Dashboard data state')}
          style={{ fontSize: 13 }}
        >
          {MODES.map((mode) => (
            <FormSelectOption key={mode.value} value={mode.value} label={t(mode.label)} />
          ))}
        </FormSelect>
      </FormGroup>
    </Flex>
  );
}
