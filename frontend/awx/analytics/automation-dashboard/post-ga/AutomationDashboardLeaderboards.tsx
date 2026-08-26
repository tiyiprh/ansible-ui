import { PostGaHelpPopover } from './PostGaHelpPopover';
import {
  IFilterState,
  PageToolbarFilters,
} from '@ansible/ansible-ui-framework';
import {
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  EmptyStateBody,
  Grid,
  GridItem,
  Label,
  Title,
  Toolbar,
  ToolbarContent,
} from '@patternfly/react-core';
import { CrownIcon } from '@patternfly/react-icons';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { PageLoadingTable } from '../../../../../framework/PageTable/PageLoadingTable';
import { useAutomationDashboardToolbar } from '../components';

function abbreviateName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.map((p) => p[0].toUpperCase()).join('');
}
import { IDashboardTableItem } from '../types';
import { useAutomationDashboardView } from '../views/useAutomationDashboardView';
import {
  LEADERBOARD_PANEL_IDS,
  topOrganizations,
  topTemplates,
} from './postGaMockData';
import { LeaderboardsAtAGlanceCard } from './LeaderboardsAtAGlanceCard';
import { PostGaHighlightsFilterProvider } from './PostGaHighlightsFilterContext';
import {
  getLeaderboardPeriodScale,
  mapLeaderboardPeriodToApiPeriod,
} from './postGaLeaderboardsFilterUtils';
import { usePostGaLeaderboardsToolbar } from './usePostGaLeaderboardsToolbar';
import './postGa.css';
import {
  getGoalsPreviewMode,
  isDemoMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';

type LeaderboardRow = {
  id: number;
  name: string;
  execution_count: number;
};

type MockLeaderboardRow = {
  key: string;
  name: string;
  execution_count: number;
  org?: string;
};

function mapApiLeaderboardRows(items: IDashboardTableItem[]): LeaderboardRow[] {
  return items.slice(0, 5).map((item) => ({
    id: item.id,
    name: item.name,
    execution_count: item.execution_count,
  }));
}

function LeaderboardPanelCard({
  id,
  title,
  help,
  children,
  isEmpty,
  emptyTitle,
  emptyBody,
  loading,
}: Readonly<{
  id: string;
  title: string;
  help: string;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
  loading?: boolean;
}>) {
  return (
    <Card
      id={id}
      data-testid={id}
      style={{ height: 320, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      <CardHeader>
        <Title
          headingLevel="h3"
          size="xl"
          style={{ display: 'inline-block', verticalAlign: '-0.15em', lineHeight: 1.2 }}
        >
          {title}
        </Title>
        <PostGaHelpPopover title={title} help={help} />
      </CardHeader>
      <CardBody
        style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: isEmpty || loading ? undefined : 0 }}
      >
        {loading ? (
          <PageLoadingTable rows={5} />
        ) : isEmpty ? (
          <EmptyState variant="sm" headingLevel="h4" titleText={emptyTitle} icon={CubesIcon}>
            <EmptyStateBody>{emptyBody}</EmptyStateBody>
          </EmptyState>
        ) : (
          children
        )}
      </CardBody>
    </Card>
  );
}

const RANK_LABEL_COLORS = {
  1: 'yellow',
  2: 'grey',
  3: 'orange',
} as const;

const LEADERBOARD_RANK_CROWN_CLASS = {
  1: 'post-ga-leaderboard-rank-crown--1',
  2: 'post-ga-leaderboard-rank-crown--2',
  3: 'post-ga-leaderboard-rank-crown--3',
} as const;

function LeaderboardRankCell({ position }: Readonly<{ position: number }>) {
  if (position <= 3) {
    const color = RANK_LABEL_COLORS[position as 1 | 2 | 3];
    return (
      <Label
        variant="outline"
        color={color}
        isCompact
        icon={<CrownIcon className={LEADERBOARD_RANK_CROWN_CLASS[position as 1 | 2 | 3]} />}
      >
        {`#${position}`}
      </Label>
    );
  }

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', minWidth: 24, display: 'inline-block' }}>
      #{position}
    </span>
  );
}

function isTopThree(index: number): boolean {
  return index < 3;
}

function scaleMockLeaderboardRows(rows: MockLeaderboardRow[], periodScale: number): MockLeaderboardRow[] {
  return rows.map((row) => ({
    ...row,
    execution_count: Math.round(row.execution_count * periodScale),
  }));
}

function filterRowsByOrganizations<T extends { org?: string; orgName?: string }>(
  rows: readonly T[],
  selectedOrganizations: readonly string[]
): T[] {
  if (selectedOrganizations.length === 0) return [...rows];
  const selected = new Set(selectedOrganizations);
  return rows.filter((row) => {
    const orgName = 'orgName' in row && row.orgName ? row.orgName : row.org;
    return orgName !== undefined && selected.has(orgName);
  });
}

const LEADERBOARD_FILTER_DEFAULTS: IFilterState = {
  period: ['month'],
  organization: [],
};

export function AutomationDashboardLeaderboards() {
  const { t } = useTranslation();
  const leaderboardsToolbarFilters = usePostGaLeaderboardsToolbar();
  const dashboardToolbarFilters = useAutomationDashboardToolbar();
  const periodOnlyToolbarFilters = useMemo(
    () => dashboardToolbarFilters.filter((filter) => filter.key === 'period'),
    [dashboardToolbarFilters]
  );
  const view = useAutomationDashboardView({
    toolbarFilters: periodOnlyToolbarFilters,
    disableQueryString: true,
  });
  const [filterState, setFilterState] = useState<IFilterState>(LEADERBOARD_FILTER_DEFAULTS);
  const { setFilterState: setApiFilterState } = view.mainTableView;

  const apiPeriod = useMemo(
    () => mapLeaderboardPeriodToApiPeriod(filterState.period),
    [filterState.period]
  );

  useEffect(() => {
    setApiFilterState((prev) => ({ ...prev, period: apiPeriod }));
  }, [apiPeriod, setApiFilterState]);

  const periodScale = getLeaderboardPeriodScale(filterState.period);
  const organizationFilterIds = filterState.organization ?? [];
  const selectedOrganizations = organizationFilterIds;

  const visiblePanels = useMemo(
    () => LEADERBOARD_PANEL_IDS.map((id) => ({ id })),
    []
  );

  const { details, detailsLoading } = view;

  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );
  const isDay0 = isDemoMode() && previewMode === 'day0';

  const totalJobsColumn = t('Total jobs');
  const totalJobRunsColumn = t('Total job runs');

  const projectsToShow = useMemo(
    () => (isDay0 ? [] : mapApiLeaderboardRows(details?.top_projects ?? [])),
    [details?.top_projects, isDay0]
  );

  const usersToShow = useMemo(
    () => (isDay0 ? [] : mapApiLeaderboardRows(details?.top_users ?? [])),
    [details?.top_users, isDay0]
  );

  const templatesToShow = useMemo((): LeaderboardRow[] => {
    if (isDay0) return [];
    const items = view.mainTableView.pageItems ?? [];
    return [...items]
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        name: item.template_name,
        execution_count: item.runs,
      }));
  }, [isDay0, view.mainTableView.pageItems]);

  const orgsToShow = useMemo((): MockLeaderboardRow[] => {
    if (isDay0) return [];
    const scaled = scaleMockLeaderboardRows(
      topOrganizations.map((row) => ({
        key: row.orgName,
        name: row.orgName,
        execution_count: row.execution_count,
        org: row.orgName,
      })),
      periodScale
    );
    return filterRowsByOrganizations(scaled, selectedOrganizations).slice(0, 5);
  }, [isDay0, periodScale, selectedOrganizations]);

  const mockTemplatesToShow = useMemo((): MockLeaderboardRow[] => {
    if (isDay0) return [];
    const scaled = scaleMockLeaderboardRows(
      topTemplates.map((row) => ({
        key: row.templateName,
        name: row.templateName,
        execution_count: row.execution_count,
        org: row.org,
      })),
      periodScale
    );
    return filterRowsByOrganizations(scaled, selectedOrganizations).slice(0, 5);
  }, [isDay0, periodScale, selectedOrganizations]);

  const day0EmptyBody = t('Leaderboard data will appear after your first job runs.');

  const emptyProjectBody = isDay0
    ? day0EmptyBody
    : view.mainTableView.itemCount
      ? t('Automation data exists, but no job runs are currently associated with projects.')
      : t('Project data will appear after your first job runs.');

  const emptyUserBody = isDay0
    ? day0EmptyBody
    : view.mainTableView.itemCount
      ? t('Automation data exists, but no job runs are currently attributed to individual users.')
      : t('User data will appear after your first job runs.');

  const emptyTemplateBody = isDay0
    ? day0EmptyBody
    : t('Template data for the selected period will appear here when available.');

  const emptyOrgBody = isDay0
    ? day0EmptyBody
    : selectedOrganizations.length > 0
      ? t('No organization data for the selected organizations in this period.')
      : t('Organization ranking data will appear here when available.');

  const useLiveTemplates = !detailsLoading && templatesToShow.length > 0;
  const templateRows: ReadonlyArray<LeaderboardRow | MockLeaderboardRow> = useLiveTemplates
    ? templatesToShow
    : mockTemplatesToShow;

  return (
    <PostGaHighlightsFilterProvider
      organizationFilterIds={organizationFilterIds}
      periodScale={periodScale}
    >
      <Toolbar
        ouiaId="leaderboards-toolbar"
        inset={{
          default: 'insetMd',
          sm: 'insetMd',
          md: 'insetMd',
          lg: 'insetMd',
          xl: 'insetLg',
          '2xl': 'insetLg',
        }}
        style={{ marginBottom: 24, paddingInline: 0 }}
      >
        <ToolbarContent>
          <PageToolbarFilters
            toolbarFilters={leaderboardsToolbarFilters}
            filterState={filterState}
            setFilterState={setFilterState}
          />
        </ToolbarContent>
      </Toolbar>

      <div style={{ flexShrink: 0 }}>
        <LeaderboardsAtAGlanceCard />
      </div>

      <Grid hasGutter>
        {visiblePanels.map((panel) => {
          if (panel.id === 'orgs') {
            return (
              <GridItem key={panel.id} md={6}>
                <LeaderboardPanelCard
                  id="leaderboard-orgs-card"
                  title={t('Top 5 organizations')}
                  help={t(
                    'Organizations ranked by successful job runs in the selected period. Helps identify which organizations are driving the most automation activity.'
                  )}
                  isEmpty={orgsToShow.length === 0}
                  emptyTitle={t('No data')}
                  emptyBody={emptyOrgBody}
                >
                  <Table variant="compact" aria-label={t('Top organizations')}>
                    <Thead>
                      <Tr>
                        <Th style={{ width: 72, minWidth: 72 }}>{t('Rank')}</Th>
                        <Th>{t('Organization')}</Th>
                        <Th>{totalJobRunsColumn}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {orgsToShow.map((row, index) => (
                        <Tr key={row.key}>
                          <Td dataLabel={t('Rank')}>
                            <LeaderboardRankCell position={index + 1} />
                          </Td>
                          <Td
                            dataLabel={t('Organization')}
                            style={isTopThree(index) ? { fontWeight: 700 } : undefined}
                          >
                            {row.name}
                          </Td>
                          <Td dataLabel={totalJobRunsColumn}>
                            {row.execution_count.toLocaleString()}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </LeaderboardPanelCard>
              </GridItem>
            );
          }

          if (panel.id === 'templates') {
            return (
              <GridItem key={panel.id} md={6}>
                <LeaderboardPanelCard
                  id="leaderboard-templates-card"
                  title={t('Top 5 templates')}
                  help={t(
                    'Job templates ranked by total number of job runs in the selected period. Helps identify which templates are driving the most automation activity.'
                  )}
                  isEmpty={!detailsLoading && templateRows.length === 0}
                  emptyTitle={t('No data')}
                  emptyBody={emptyTemplateBody}
                  loading={detailsLoading && !useLiveTemplates}
                >
                  <Table variant="compact" aria-label={t('Top templates')}>
                    <Thead>
                      <Tr>
                        <Th style={{ width: 72, minWidth: 72 }}>{t('Rank')}</Th>
                        <Th>{t('Template')}</Th>
                        <Th>{totalJobRunsColumn}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {templateRows.map((row, index) => (
                        <Tr key={'key' in row ? row.key : row.id}>
                          <Td dataLabel={t('Rank')}>
                            <LeaderboardRankCell position={index + 1} />
                          </Td>
                          <Td
                            dataLabel={t('Template')}
                            style={isTopThree(index) ? { fontWeight: 700 } : undefined}
                          >
                            {row.name}
                          </Td>
                          <Td dataLabel={totalJobRunsColumn}>
                            {row.execution_count.toLocaleString()}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </LeaderboardPanelCard>
              </GridItem>
            );
          }

          if (panel.id === 'projects') {
            return (
              <GridItem key={panel.id} md={6}>
                <LeaderboardPanelCard
                  id="leaderboard-projects-card"
                  title={t('Top 5 projects')}
                  help={t(
                    'Projects ranked by total number of jobs in the selected period. Uses a different measure than templates, which are ranked by job runs.'
                  )}
                  isEmpty={!detailsLoading && projectsToShow.length === 0}
                  emptyTitle={t('No data')}
                  emptyBody={emptyProjectBody}
                  loading={detailsLoading}
                >
                  <Table variant="compact" aria-label={t('Top projects')}>
                    <Thead>
                      <Tr>
                        <Th style={{ width: 72, minWidth: 72 }}>{t('Rank')}</Th>
                        <Th>{t('Project')}</Th>
                        <Th>{totalJobsColumn}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {projectsToShow.map((row, index) => (
                        <Tr key={row.id}>
                          <Td dataLabel={t('Rank')}>
                            <LeaderboardRankCell position={index + 1} />
                          </Td>
                          <Td
                            dataLabel={t('Project')}
                            style={isTopThree(index) ? { fontWeight: 700 } : undefined}
                          >
                            {row.name}
                          </Td>
                          <Td dataLabel={totalJobsColumn}>
                            {row.execution_count.toLocaleString()}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </LeaderboardPanelCard>
              </GridItem>
            );
          }

          if (panel.id === 'users') {
            return (
              <GridItem key={panel.id} md={6}>
                <LeaderboardPanelCard
                  id="leaderboard-users-card"
                  title={t('Top 5 users')}
                  help={t(
                    'Users ranked by job runs they triggered or that ran in their context in the selected period. Shows individual adoption and activity.'
                  )}
                  isEmpty={!detailsLoading && usersToShow.length === 0}
                  emptyTitle={t('No user data')}
                  emptyBody={emptyUserBody}
                  loading={detailsLoading}
                >
                  <Table variant="compact" aria-label={t('Top users')}>
                    <Thead>
                      <Tr>
                        <Th style={{ width: 72, minWidth: 72 }}>{t('Rank')}</Th>
                        <Th>{t('User')}</Th>
                        <Th>{totalJobRunsColumn}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {usersToShow.map((row, index) => (
                        <Tr key={row.id}>
                          <Td dataLabel={t('Rank')}>
                            <LeaderboardRankCell position={index + 1} />
                          </Td>
                          <Td
                            dataLabel={t('User')}
                            style={isTopThree(index) ? { fontWeight: 700 } : undefined}
                          >
                            {abbreviateName(row.name)}
                          </Td>
                          <Td dataLabel={totalJobRunsColumn}>
                            {row.execution_count.toLocaleString()}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </LeaderboardPanelCard>
              </GridItem>
            );
          }

          return null;
        })}
      </Grid>

    </PostGaHighlightsFilterProvider>
  );
}
