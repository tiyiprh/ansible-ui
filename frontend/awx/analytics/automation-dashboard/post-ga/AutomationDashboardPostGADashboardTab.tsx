import { PageDashboardContext, useGetPageUrl } from '@ansible/ansible-ui-framework';
import { Grid, GridItem } from '@patternfly/react-core';
import useResizeObserver from '@react-hook/resize-observer';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AwxRoute } from '../../../main/AwxRoutes';
import { useAutomationDashboardCollectionStatus } from '../common/useAutomationDashboardCollectionStatus';
import {
  DashboardChartCard,
  DashboardMainTableCard,
  DashboardValueCard,
  useAutomationDashboardToolbar,
} from '../components';
import { DashboardToolbar } from '../components/DashboardToolbar';
import { useAutomationDashboardView } from '../views/useAutomationDashboardView';
import { LoadingState } from '@ansible/ansible-ui-framework/components/LoadingState';
import { Scrollable } from '@ansible/ansible-ui-framework/components/Scrollable';
import { DashboardAtAGlanceCard } from './DashboardAtAGlanceCard';
import { DashboardGoalsCard } from './DashboardGoalsCard';
import {
  GaDashboardToolbarPrototypeNote,
} from './PostGaPrototypeNotes';
import './postGa.css';

const Divisor = 1662 / 24;
const WIDE_LAYOUT_MIN_COLUMNS = 16;
const WIDE_LAYOUT_MAX_COLUMNS = 31;

function calculateGridColumns(width: number) {
  return Math.max(1, Math.floor(width / Divisor));
}

export function AutomationDashboardPostGADashboardTab() {
  const { t } = useTranslation();
  const toolbarFilters = useAutomationDashboardToolbar();
  const getPageUrl = useGetPageUrl();
  const view = useAutomationDashboardView({ toolbarFilters });
  const { details } = view;
  const noDataString = t('No jobs have been run.');
  const { isLoading } = useAutomationDashboardCollectionStatus();

  const measureRef = useRef<HTMLDivElement>(null);
  const [gridColumns, setGridColumns] = useState(1);

  const updateGridColumns = () => {
    setGridColumns(calculateGridColumns(measureRef.current?.clientWidth ?? 0));
  };

  useLayoutEffect(() => {
    updateGridColumns();
  }, [isLoading]);

  useResizeObserver(measureRef, (entry) => {
    setGridColumns(calculateGridColumns(entry.contentRect.width ?? 0));
  });

  const isWideLayout =
    WIDE_LAYOUT_MIN_COLUMNS <= gridColumns && gridColumns <= WIDE_LAYOUT_MAX_COLUMNS;
  const valueCardWidth = isWideLayout ? 'xs' : ('md' as const);

  const pageDashboardContextValue = useMemo(() => ({ columns: gridColumns }), [gridColumns]);

  if (isLoading) {
    return (
      <Scrollable marginLeft={20} marginRight={20} marginBottom={16} marginTop={16}>
        <LoadingState />
      </Scrollable>
    );
  }

  return (
    <>
      <DashboardToolbar
        toolbarFilters={toolbarFilters}
        {...view.mainTableView}
        keyFn={(item) => item.id}
        registerClearCallback={view.registerClearCallback}
      />
      <GaDashboardToolbarPrototypeNote />
      <PageDashboardContext.Provider value={pageDashboardContextValue}>
        <Scrollable marginLeft={20} marginRight={20} marginBottom={16} marginTop={16}>
          <div ref={measureRef} style={{ width: '100%' }}>
            <div className="post-ga-goals-row">
              <DashboardGoalsCard />
              <DashboardAtAGlanceCard />
            </div>
            <div
              style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              }}
            >
              <GridItem style={{ gridColumn: `span ${gridColumns}` }}>
                <Grid hasGutter style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
                  <DashboardValueCard
                    id="successful-jobs-card"
                    title={t('Successful jobs')}
                    help={t(
                      'Number of job runs that completed without error in the selected period. Compare successful and failed jobs to track automation health over time.'
                    )}
                    linkText={t('See all successful jobs')}
                    to={getPageUrl(AwxRoute.Jobs) + '?status=successful'}
                    value={details?.total_number_of_successful_jobs ?? noDataString}
                    error={view.detailsError}
                    errorStateTitle={t('Error loading successful jobs')}
                    width={valueCardWidth}
                  />
                  <DashboardValueCard
                    id="failed-jobs-card"
                    title={t('Failed jobs')}
                    help={t(
                      'Number of job runs that failed in the selected period. Review failed jobs to fix playbooks, credentials, or inventory issues.'
                    )}
                    linkText={t('See all failed jobs')}
                    to={getPageUrl(AwxRoute.Jobs) + '?status=failed'}
                    value={details?.total_number_of_failed_jobs ?? noDataString}
                    error={view.detailsError}
                    errorStateTitle={t('Error loading failed jobs')}
                    width={valueCardWidth}
                  />
                  <DashboardValueCard
                    id="unique-hosts-card"
                    title={t('Hosts automated')}
                    help={t(
                      'Number of hosts that ran at least one automation job in the selected period. Shows how much of your inventory is actively automated.'
                    )}
                    value={details?.total_number_of_unique_hosts ?? noDataString}
                    error={view.detailsError}
                    errorStateTitle={t('Error loading unique hosts')}
                    width={valueCardWidth}
                  />
                  <DashboardValueCard
                    id="automation-hours-card"
                    title={t('Hours of automation')}
                    help={t(
                      'Total job runtime in the selected period. Use this to understand automation workload and plan capacity.'
                    )}
                    value={details?.total_hours_of_automation ?? noDataString}
                    valueSuffix={details?.total_hours_of_automation ? 'h' : undefined}
                    error={view.detailsError}
                    errorStateTitle={t('Error loading hours of automation')}
                    width={valueCardWidth}
                  />
                </Grid>
              </GridItem>

              <GridItem style={{ gridColumn: `span ${gridColumns}` }}>
                <Grid hasGutter style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
                  <DashboardChartCard
                    id="host-chart-card"
                    title={t('Number of hosts jobs are running on')}
                    help={t(
                      'Number of hosts that ran at least one job in the selected period. Shows how broadly automation is applied across your inventory.'
                    )}
                    summaryValue={details?.total_number_of_host_job_runs ?? 0}
                    data={details?.host_chart ?? { kind: 'day', items: [] }}
                    variant="lineChart"
                    error={view.detailsError}
                    errorStateTitle={t('Error loading host chart')}
                    legendLabel={t('Hosts')}
                  />
                  <DashboardChartCard
                    id="job-chart-card"
                    title={t('Number of times jobs were run')}
                    help={t(
                      'Total job executions in the selected period, including successful and failed runs. Use this to track automation volume and trends.'
                    )}
                    variant="barChart"
                    summaryValue={details?.total_number_of_job_runs ?? 0}
                    data={details?.job_chart ?? { kind: 'day', items: [] }}
                    errorStateTitle={t('Error loading job chart')}
                    error={view.detailsError}
                    legendLabel={t('Job runs')}
                  />
                </Grid>
              </GridItem>

              <GridItem style={{ gridColumn: `span ${gridColumns}` }}>
                <Grid hasGutter style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
                  <DashboardMainTableCard
                    {...view}
                    toolbarFilters={toolbarFilters}
                    topCardsWidth={valueCardWidth}
                  />
                </Grid>
              </GridItem>
            </div>
          </div>
        </Scrollable>
      </PageDashboardContext.Provider>
    </>
  );
}
