import { useCallback, useMemo, useRef, useState } from 'react';
import { IToolbarFilter } from '../../../../../framework';
import { metricsAPI } from '../../../common/api/metrics-utils';
import { AutomationDashboardDateRangeFilterPresets } from '../constants';
import { IAutomationDashboardView, IJobTemplate, ReportType } from '../types';
import {
  AUTOMATION_DASHBOARD_DEFAULT_FILTERS,
  isDefaultAutomationDashboardFilterState,
} from '../utils/defaultFilterState';
import { useGetReportDetails } from './useGetReportDetails';
import { useSubscriptionCostState } from './useSubscriptionCostState';
import { useExportCsv } from './useExportCsv';
import {
  IAutomationDashboardBaseView,
  useAutomationDashboardBaseView,
} from '../common/useAutomationDashboardBaseView';

// Resolved once at module load — the user's time zone does not change during a session.
export const QUERY_PARAMS = { tz: Intl.DateTimeFormat().resolvedOptions().timeZone };

export function useAutomationDashboardView(options: {
  toolbarFilters: IToolbarFilter[];
  disableQueryString?: boolean;
}): IAutomationDashboardView {
  const { toolbarFilters, disableQueryString } = options;
  const mainTableViewBase = useAutomationDashboardBaseView<IJobTemplate>({
    url: metricsAPI`/dashboard_reports/report/`,
    defaultFilters: AUTOMATION_DASHBOARD_DEFAULT_FILTERS,
    toolbarFilters,
    disableQueryString,
  });

  const { filterState, setFilterState } = mainTableViewBase;

  // Ref for callback from toolbar (to reset dropdown when filters cleared)
  const onClearFiltersCallback = useRef<(() => void) | undefined>();

  // Override clearAllFilters to retain the required 'period' filter and call toolbar callback
  const clearAllFilters = useCallback(() => {
    setFilterState({ period: [AutomationDashboardDateRangeFilterPresets.last_7_days] });

    // Call toolbar callback to reset dropdown
    onClearFiltersCallback.current?.();
  }, [setFilterState]);

  // Function to register callback from toolbar
  const registerClearCallback = useCallback((callback: () => void) => {
    onClearFiltersCallback.current = callback;
  }, []);

  const mainTableView: IAutomationDashboardBaseView<IJobTemplate> = useMemo(
    () => ({ ...mainTableViewBase, clearAllFilters }),
    [mainTableViewBase, clearAllFilters]
  );

  const detailsResponse = useGetReportDetails(toolbarFilters, filterState, QUERY_PARAMS);
  const { costState, setCostState } = useSubscriptionCostState();

  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([detailsResponse.refreshDetails(), mainTableView.refresh()]);
    } finally {
      setLoading(false);
    }
  }, [mainTableView, detailsResponse]);

  const exportCsvBase = useExportCsv(toolbarFilters, filterState, QUERY_PARAMS);

  const exportCsv = useCallback(
    async (reportType: ReportType) => {
      setLoading(true);
      try {
        await exportCsvBase(reportType);
      } finally {
        setLoading(false);
      }
    },
    [exportCsvBase]
  );

  // Compute whether filter state is default
  const isFilterStateDefaultValue = useMemo(
    () => isDefaultAutomationDashboardFilterState(filterState),
    [filterState]
  );

  return useMemo(
    () => ({
      mainTableView,
      details: detailsResponse.reportDetails,
      detailsError: detailsResponse.error,
      detailsLoading: detailsResponse.isLoading,
      costState,
      setCostState,
      loading,
      refresh,
      exportCsv,
      isFilterStateDefault: isFilterStateDefaultValue,
      registerClearCallback,
    }),
    [
      mainTableView,
      detailsResponse.reportDetails,
      detailsResponse.error,
      detailsResponse.isLoading,
      costState,
      setCostState,
      loading,
      refresh,
      exportCsv,
      isFilterStateDefaultValue,
      registerClearCallback,
    ]
  );
}
