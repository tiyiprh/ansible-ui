import { Help } from '@ansible/ansible-ui-framework/components/Help';
import {
  IFilterState,
  PageToolbarFilters,
} from '@ansible/ansible-ui-framework';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  EmptyStateBody,
  Grid,
  GridItem,
  Icon,
  Label,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  CogIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  CrownIcon,
} from '@patternfly/react-icons';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { PageLoadingTable } from '../../../../../framework/PageTable/PageLoadingTable';
import { useAutomationDashboardToolbar } from '../components';
import { IDashboardTableItem } from '../types';
import { useAutomationDashboardView } from '../views/useAutomationDashboardView';
import {
  topOrganizations,
  topTemplates,
} from './postGaMockData';
import { DashboardAtAGlanceCard } from './DashboardAtAGlanceCard';
import { DashboardGoalsCard } from './DashboardGoalsCard';
import { usePostGADashboardPeriodFilter, withSharedPeriod } from './PostGADashboardFilterContext';
import { useManagedLeaderboardPanels } from './useManagedLeaderboardPanels';
import { AutomationHealthCard } from './AutomationHealthCard';
import { PostGaHighlightsFilterProvider } from './PostGaHighlightsFilterContext';
import { getPeriodScale } from './postGaHighlightsFilterUtils';
import { usePostGaHighlightsToolbar } from './usePostGaHighlightsToolbar';
import './postGa.css';
import {
  getGoalsPreviewMode,
  isDemoMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';

const STEADY_TREND = 'steady' as const;

type LeaderboardTrendRow = {
  id: number;
  name: string;
  execution_count: number;
  trend: typeof STEADY_TREND;
};

type MockLeaderboardRow = {
  key: string;
  name: string;
  execution_count: number;
  trend: 'up' | 'down' | 'steady';
  org?: string;
};

function mapApiLeaderboardRows(items: IDashboardTableItem[]): LeaderboardTrendRow[] {
  return items.slice(0, 5).map((item) => ({
    id: item.id,
    name: item.name,
    execution_count: item.execution_count,
    trend: STEADY_TREND,
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
        <Help title={title} help={help} />
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

function TrendArrow({ trend }: Readonly<{ trend: 'up' | 'down' | 'steady' }>) {
  switch (trend) {
    case 'up':
      return (
        <Icon status="success" size="sm">
          <ArrowUpIcon />
        </Icon>
      );
    case 'down':
      return (
        <Icon status="danger" size="sm">
          <ArrowDownIcon />
        </Icon>
      );
    case 'steady':
    default:
      return (
        <Icon size="sm" style={{ color: 'var(--pf-t--global--icon--color--subtle)' }}>
          <MinusIcon />
        </Icon>
      );
  }
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

const HIGHLIGHTS_ORG_FILTER_DEFAULTS: IFilterState = {
  organization: [],
};

export function AutomationDashboardGamificationHighlights() {
  const { t } = useTranslation();
  const { openManageLeaderboards, visiblePanels } = useManagedLeaderboardPanels(
    'post-ga-gamification-highlights'
  );
  const highlightsToolbarFilters = usePostGaHighlightsToolbar();
  const dashboardToolbarFilters = useAutomationDashboardToolbar();
  const periodOnlyToolbarFilters = useMemo(
    () => dashboardToolbarFilters.filter((filter) => filter.key === 'period'),
    [dashboardToolbarFilters]
  );
  const view = useAutomationDashboardView({
    toolbarFilters: periodOnlyToolbarFilters,
    disableQueryString: true,
  });
  const { period, setPeriod, periodArraysEqual } = usePostGADashboardPeriodFilter();
  const [orgFilterState, setOrgFilterState] = useState<IFilterState>(HIGHLIGHTS_ORG_FILTER_DEFAULTS);
  const { filterState: apiFilterState, setFilterState: setApiFilterState } = view.mainTableView;
  const syncingPeriodRef = useRef(false);

  useEffect(() => {
    if (syncingPeriodRef.current) return;
    if (!periodArraysEqual(apiFilterState.period, period)) {
      syncingPeriodRef.current = true;
      setApiFilterState((prev) => withSharedPeriod(prev, period));
      syncingPeriodRef.current = false;
    }
  }, [apiFilterState.period, period, periodArraysEqual, setApiFilterState]);

  useEffect(() => {
    if (syncingPeriodRef.current) return;
    if (apiFilterState.period && !periodArraysEqual(apiFilterState.period, period)) {
      syncingPeriodRef.current = true;
      setPeriod(apiFilterState.period);
      syncingPeriodRef.current = false;
    }
  }, [apiFilterState.period, period, periodArraysEqual, setPeriod]);

  const highlightsFilterState = useMemo<IFilterState>(
    () => ({
      period,
      organization: orgFilterState.organization,
    }),
    [orgFilterState.organization, period]
  );

  const setHighlightsFilterState = useCallback<Dispatch<SetStateAction<IFilterState>>>(
    (next) => {
      const resolved = typeof next === 'function' ? next(highlightsFilterState) : next;
      if (resolved.period) {
        setPeriod(resolved.period);
      }
      if (resolved.organization !== undefined) {
        setOrgFilterState({ organization: resolved.organization });
      }
    },
    [highlightsFilterState, setPeriod]
  );

  const periodScale = getPeriodScale(period);
  const organizationFilterIds = highlightsFilterState.organization ?? [];
  const selectedOrganizations = organizationFilterIds;

  const { details, detailsLoading } = view;

  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );
  const isDay0 = isDemoMode() && previewMode === 'day0';

  const executionCountColumn = t('Total no. of jobs');

  const projectsToShow = useMemo(
    () => (isDay0 ? [] : mapApiLeaderboardRows(details?.top_projects ?? [])),
    [details?.top_projects, isDay0]
  );

  const usersToShow = useMemo(
    () => (isDay0 ? [] : mapApiLeaderboardRows(details?.top_users ?? [])),
    [details?.top_users, isDay0]
  );

  const templatesToShow = useMemo((): LeaderboardTrendRow[] => {
    if (isDay0) return [];
    const items = view.mainTableView.pageItems ?? [];
    return [...items]
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        name: item.template_name,
        execution_count: item.runs,
        trend: STEADY_TREND,
      }));
  }, [isDay0, view.mainTableView.pageItems]);

  const orgsToShow = useMemo((): MockLeaderboardRow[] => {
    if (isDay0) return [];
    const scaled = scaleMockLeaderboardRows(
      topOrganizations.map((row) => ({
        key: row.orgName,
        name: row.orgName,
        execution_count: row.execution_count,
        trend: row.trend,
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
        trend: row.trend,
        org: row.org,
      })),
      periodScale
    );
    return filterRowsByOrganizations(scaled, selectedOrganizations).slice(0, 5);
  }, [isDay0, periodScale, selectedOrganizations]);

  const day0EmptyBody = t('Leaderboard data will appear after your first automation runs.');

  const emptyProjectBody = isDay0
    ? day0EmptyBody
    : view.mainTableView.itemCount
      ? t('Automation data exists, but no runs are currently associated with projects.')
      : t('Project data will appear after your first automation runs.');

  const emptyUserBody = isDay0
    ? day0EmptyBody
    : view.mainTableView.itemCount
      ? t('Automation data exists, but no runs are currently attributed to individual users.')
      : t('User data will appear after your first automation runs.');

  const emptyTemplateBody = isDay0
    ? day0EmptyBody
    : t('Template data for the selected period will appear here when available.');

  const emptyOrgBody = isDay0
    ? day0EmptyBody
    : selectedOrganizations.length > 0
      ? t('No organization data for the selected organizations in this period.')
      : t('Organization ranking data will appear here when available.');

  const useLiveTemplates = !detailsLoading && templatesToShow.length > 0;
  const templateRows: ReadonlyArray<LeaderboardTrendRow | MockLeaderboardRow> = useLiveTemplates
    ? templatesToShow
    : mockTemplatesToShow;

  return (
    <PostGaHighlightsFilterProvider
      organizationFilterIds={organizationFilterIds}
      periodScale={periodScale}
    >
      <Toolbar
        ouiaId="gamification-highlights-toolbar"
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
            toolbarFilters={highlightsToolbarFilters}
            filterState={highlightsFilterState}
            setFilterState={setHighlightsFilterState}
          />
          <ToolbarGroup variant="action-group" align={{ default: 'alignEnd' }}>
            <ToolbarItem>
              <Button icon={<CogIcon />} variant="link" onClick={openManageLeaderboards}>
                {t('Manage view')}
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <div style={{ flexShrink: 0 }}>
        <AutomationHealthCard />
      </div>

      <div className="post-ga-goals-row" style={{ marginBottom: 24 }}>
        <DashboardAtAGlanceCard />
        <DashboardGoalsCard />
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
                    'Organizations ranked by total job count in the selected period. Helps identify which organizations are driving the most automation activity.'
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
                        <Th>{executionCountColumn}</Th>
                        <Th style={{ width: 80, minWidth: 80 }}>{t('Trend')}</Th>
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
                            <Button variant="link" isInline>
                              {row.name}
                            </Button>
                          </Td>
                          <Td dataLabel={executionCountColumn}>
                            {row.execution_count.toLocaleString()}
                          </Td>
                          <Td dataLabel={t('Trend')}>
                            <TrendArrow trend={row.trend} />
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
                    'Job templates ranked by total job count in the selected period. Helps identify which templates are driving the most automation activity.'
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
                        <Th>{executionCountColumn}</Th>
                        <Th style={{ width: 80, minWidth: 80 }}>{t('Trend')}</Th>
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
                            <Button variant="link" isInline>
                              {row.name}
                            </Button>
                          </Td>
                          <Td dataLabel={executionCountColumn}>
                            {row.execution_count.toLocaleString()}
                          </Td>
                          <Td dataLabel={t('Trend')}>
                            <TrendArrow trend={row.trend} />
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
                    'Projects ranked by total job count in the selected period. Helps identify which projects are driving the most automation activity.'
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
                        <Th>{executionCountColumn}</Th>
                        <Th style={{ width: 80, minWidth: 80 }}>{t('Trend')}</Th>
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
                            <Button variant="link" isInline>
                              {row.name}
                            </Button>
                          </Td>
                          <Td dataLabel={executionCountColumn}>
                            {row.execution_count.toLocaleString()}
                          </Td>
                          <Td dataLabel={t('Trend')}>
                            <TrendArrow trend={row.trend} />
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
                    'Users ranked by automation runs they triggered or that ran in their context in the selected period. Shows individual adoption and activity.'
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
                        <Th>{executionCountColumn}</Th>
                        <Th style={{ width: 80, minWidth: 80 }}>{t('Trend')}</Th>
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
                            <Button variant="link" isInline>
                              {row.name}
                            </Button>
                          </Td>
                          <Td dataLabel={executionCountColumn}>
                            {row.execution_count.toLocaleString()}
                          </Td>
                          <Td dataLabel={t('Trend')}>
                            <TrendArrow trend={row.trend} />
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
