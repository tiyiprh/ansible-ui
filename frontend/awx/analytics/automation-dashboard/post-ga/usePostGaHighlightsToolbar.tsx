import { IToolbarFilter, ToolbarFilterType } from '@ansible/ansible-ui-framework';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAutomationDashboardToolbar } from '../components';
import { FILTER_ORGANIZATIONS } from './postGaMockData';

/** Leaderboards tab toolbar: GA period DateRange filter + prototype org multi-select. */
export function usePostGaHighlightsToolbar(): IToolbarFilter[] {
  const { t } = useTranslation();
  const dashboardToolbarFilters = useAutomationDashboardToolbar();
  const periodToolbarFilter = useMemo(
    () => dashboardToolbarFilters.find((filter) => filter.key === 'period'),
    [dashboardToolbarFilters]
  );

  return useMemo<IToolbarFilter[]>(
    () => [
      ...(periodToolbarFilter ? [periodToolbarFilter] : []),
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
    [periodToolbarFilter, t]
  );
}
