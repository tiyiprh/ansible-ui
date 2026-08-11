import { Help } from '@ansible/ansible-ui-framework/components/Help';
import {
  IFilterState,
  IToolbarFilter,
  PageToolbarFilters,
  ToolbarFilterType,
} from '@ansible/ansible-ui-framework';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  EmptyStateBody,
  Flex,
  Grid,
  GridItem,
  Label,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { CogIcon } from '@patternfly/react-icons';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Dispatch, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAutomationDashboardToolbar } from '../components';
import { AutomationDashboardDateRangeFilterPresets } from '../constants';
import {
  FILTER_ORGANIZATIONS,
  topOrganizations,
  topProjects,
  topTemplates,
} from './postGaMockData';
import { getEffectiveGoalTargets, shouldUseGoalTargetsForDisplay } from './dashboardSettingsUtils';
import { DashboardAtAGlanceCard } from './DashboardAtAGlanceCard';
import { DashboardGoalsCard } from './DashboardGoalsCard';
import { usePostGADashboardPeriodFilter } from './PostGADashboardFilterContext';
import { useManagedLeaderboardPanels } from './useManagedLeaderboardPanels';

function getPeriodScale(period: string[] | undefined): number {
  const preset = period?.[0];
  switch (preset) {
    case AutomationDashboardDateRangeFilterPresets.last_14_days:
      return 1.15;
    case AutomationDashboardDateRangeFilterPresets.last_30_days:
      return 1.3;
    case AutomationDashboardDateRangeFilterPresets.last_60_days:
      return 1.8;
    case AutomationDashboardDateRangeFilterPresets.last_90_days:
      return 2.5;
    case AutomationDashboardDateRangeFilterPresets.custom:
      return 1.2;
    case AutomationDashboardDateRangeFilterPresets.last_7_days:
    default:
      return 1;
  }
}

function formatGoalMetPercent(
  useGoalTargets: boolean,
  quarterlyRunTarget: number,
  jobRuns: number
): string {
  if (!useGoalTargets) {
    return '—';
  }
  if (quarterlyRunTarget <= 0) {
    return '0%';
  }
  return `${((jobRuns / quarterlyRunTarget) * 100).toFixed(1)}%`;
}

function LeaderboardPanelCard({
  id,
  title,
  help,
  children,
  isEmpty,
  emptyTitle,
  emptyBody,
}: Readonly<{
  id: string;
  title: string;
  help: string;
  children: ReactNode;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
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
        style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: isEmpty ? undefined : 0 }}
      >
        {isEmpty ? (
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

const LEADERBOARD_ORG_FILTER_DEFAULTS: IFilterState = {
  organization: ['View all'],
};

export function AutomationDashboardLeaderboards() {
  const { t } = useTranslation();
  const { openManageLeaderboards, visiblePanels } = useManagedLeaderboardPanels();
  const dashboardToolbarFilters = useAutomationDashboardToolbar();
  const periodToolbarFilter = useMemo(
    () => dashboardToolbarFilters.find((filter) => filter.key === 'period'),
    [dashboardToolbarFilters]
  );
  const { period, setPeriod } = usePostGADashboardPeriodFilter();
  const [orgFilterState, setOrgFilterState] = useState<IFilterState>(
    LEADERBOARD_ORG_FILTER_DEFAULTS
  );

  const leaderboardToolbarFilters = useMemo<IToolbarFilter[]>(
    () => [
      ...(periodToolbarFilter ? [periodToolbarFilter] : []),
      {
        key: 'organization',
        label: t('Organization'),
        type: ToolbarFilterType.SingleSelect,
        isPinned: true,
        isRequired: true,
        placeholder: t('Select organization'),
        query: 'organization',
        options: [
          { label: t('View all'), value: 'View all' },
          ...FILTER_ORGANIZATIONS.map((org) => ({ label: org, value: org })),
        ],
      },
    ],
    [periodToolbarFilter, t]
  );

  const filterState = useMemo<IFilterState>(
    () => ({
      period,
      organization: orgFilterState.organization,
    }),
    [orgFilterState.organization, period]
  );

  const setFilterState = useCallback<Dispatch<SetStateAction<IFilterState>>>(
    (next) => {
      const resolved = typeof next === 'function' ? next(filterState) : next;
      if (resolved.period) {
        setPeriod(resolved.period);
      }
      if (resolved.organization) {
        setOrgFilterState({ organization: resolved.organization });
      }
    },
    [filterState, setPeriod]
  );

  const periodScale = getPeriodScale(period);
  const useGoalTargets = shouldUseGoalTargetsForDisplay();
  const quarterlyRunTarget = useGoalTargets ? getEffectiveGoalTargets().quarterlyRunTarget : 0;

  const viewFilter =
    filterState.organization?.[0] === 'View all' ? null : (filterState.organization?.[0] ?? null);

  const filteredOrganizations = useMemo(() => {
    const scaled = topOrganizations.map((row) => ({
      ...row,
      jobRuns: Math.round(row.jobRuns * periodScale),
    }));
    if (!viewFilter) return scaled.slice(0, 5);
    const match = scaled.find((r) => r.orgName === viewFilter);
    return match ? [match] : [];
  }, [viewFilter, periodScale]);

  const filteredTemplates = useMemo(() => {
    const scaled = topTemplates.map((row) => ({
      ...row,
      runCount: Math.round(row.runCount * periodScale),
    }));
    if (!viewFilter) return scaled.slice(0, 5);
    return scaled.filter((r) => r.org === viewFilter).slice(0, 5);
  }, [viewFilter, periodScale]);

  const filteredProjects = useMemo(() => {
    const scaled = topProjects.map((row) => ({
      ...row,
      totalJobs: Math.round(row.totalJobs * periodScale),
    }));
    if (!viewFilter) return scaled;
    return scaled.filter((r) => r.org === viewFilter);
  }, [viewFilter, periodScale]);

  const emptyOrgBody = viewFilter
    ? t('No organization data for {{org}} in the selected period.', { org: viewFilter })
    : t('No organization data for the selected period.');

  return (
    <>
      <Toolbar
        ouiaId="highlights-toolbar"
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
            toolbarFilters={leaderboardToolbarFilters}
            filterState={filterState}
            setFilterState={setFilterState}
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

      <div className="post-ga-goals-row" style={{ marginBottom: 24 }}>
        <DashboardGoalsCard />
        <DashboardAtAGlanceCard />
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
                    'Organizations ranked by percentage of quarterly automation goal met in the selected period.'
                  )}
                  isEmpty={filteredOrganizations.length === 0}
                  emptyTitle={t('No data')}
                  emptyBody={emptyOrgBody}
                >
                  <Table variant="compact" aria-label={t('Top organizations')}>
                    <Thead>
                      <Tr>
                        <Th>{t('Organization')}</Th>
                        <Th>{t('Percentage of goal met')}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredOrganizations.map((row) => (
                        <Tr key={row.orgName}>
                          <Td dataLabel={t('Organization')}>
                            <Flex
                              alignItems={{ default: 'alignItemsCenter' }}
                              gap={{ default: 'gapSm' }}
                            >
                              <Button variant="link" isInline>
                                {row.orgName}
                              </Button>
                              {row.isYourOrg && <Label color="blue">{t('Yours')}</Label>}
                            </Flex>
                          </Td>
                          <Td dataLabel={t('Percentage of goal met')}>
                            {formatGoalMetPercent(useGoalTargets, quarterlyRunTarget, row.jobRuns)}
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
                  help={t('Job templates ranked by number of runs in the selected period.')}
                  isEmpty={filteredTemplates.length === 0}
                  emptyTitle={t('No data')}
                  emptyBody={
                    viewFilter
                      ? t('No template data for {{org}} in the selected period.', {
                          org: viewFilter,
                        })
                      : t('No template data for the selected period.')
                  }
                >
                  <Table variant="compact" aria-label={t('Top templates')}>
                    <Thead>
                      <Tr>
                        <Th>{t('Template')}</Th>
                        <Th>{t('Runs')}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredTemplates.map((row) => (
                        <Tr key={row.templateName}>
                          <Td dataLabel={t('Template')}>
                            <Button variant="link" isInline>
                              {row.templateName}
                            </Button>
                          </Td>
                          <Td dataLabel={t('Runs')}>{row.runCount.toLocaleString()}</Td>
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
                  help={t('Projects ranked by total number of jobs in the selected period.')}
                  isEmpty={filteredProjects.length === 0}
                  emptyTitle={t('No data')}
                  emptyBody={
                    viewFilter
                      ? t('No project data for {{org}} in the selected period.', {
                          org: viewFilter,
                        })
                      : t('No project data for the selected period.')
                  }
                >
                  <Table variant="compact" aria-label={t('Top projects')}>
                    <Thead>
                      <Tr>
                        <Th>{t('Project')}</Th>
                        <Th>{t('Jobs')}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredProjects.map((row) => (
                        <Tr key={row.projectName}>
                          <Td dataLabel={t('Project')}>
                            <Button variant="link" isInline>
                              {row.projectName}
                            </Button>
                          </Td>
                          <Td dataLabel={t('Jobs')}>{row.totalJobs}</Td>
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
                    'Users ranked by the automation runs they triggered in the selected period.'
                  )}
                  isEmpty
                  emptyTitle={t('No user data')}
                  emptyBody={t(
                    'User run data for the selected period will appear here when available.'
                  )}
                >
                  {null}
                </LeaderboardPanelCard>
              </GridItem>
            );
          }

          return null;
        })}
      </Grid>
    </>
  );
}
