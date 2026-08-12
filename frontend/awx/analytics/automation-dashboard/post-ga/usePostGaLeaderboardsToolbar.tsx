import { IToolbarFilter, ToolbarFilterType } from '@ansible/ansible-ui-framework';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FILTER_ORGANIZATIONS } from './postGaMockData';
import { LEADERBOARD_PERIOD_PRESETS } from './postGaLeaderboardsFilterUtils';

/** Leaderboards tab toolbar: period SingleSelect (month / quarter / all) + org multi-select. */
export function usePostGaLeaderboardsToolbar(): IToolbarFilter[] {
  const { t } = useTranslation();

  return useMemo<IToolbarFilter[]>(
    () => [
      {
        key: 'period',
        label: t('Period'),
        type: ToolbarFilterType.SingleSelect,
        isPinned: true,
        isRequired: true,
        placeholder: t('Select period'),
        query: 'period',
        options: [
          { label: t('This month'), value: LEADERBOARD_PERIOD_PRESETS.month },
          { label: t('This quarter'), value: LEADERBOARD_PERIOD_PRESETS.quarter },
          { label: t('All time'), value: LEADERBOARD_PERIOD_PRESETS.all },
        ],
      },
      {
        key: 'organization',
        label: t('Organization'),
        type: ToolbarFilterType.MultiSelect,
        isPinned: true,
        placeholder: t('Filter by organization'),
        query: 'organization',
        options: FILTER_ORGANIZATIONS.map((org) => ({ label: org, value: org })),
      },
    ],
    [t]
  );
}
