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
  TrophyIcon,
} from '@patternfly/react-icons';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Dispatch, ReactNode, SetStateAction, useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { useAutomationDashboardToolbar } from '../components';
import { AutomationDashboardDateRangeFilterPresets } from '../constants';
import {
  FILTER_ORGANIZATIONS,
  topOrganizations,
  topProjects,
  topTemplates,
  topUsers,
} from './postGaMockData';
import { DashboardAtAGlanceCard } from './DashboardAtAGlanceCard';
import { DashboardGoalsCard } from './DashboardGoalsCard';
import { usePostGADashboardPeriodFilter } from './PostGADashboardFilterContext';
import { useManagedLeaderboardPanels } from './useManagedLeaderboardPanels';
import { AutomationHealthCard } from './AutomationHealthCard';
import {
  getGoalsPreviewMode,
  isDemoMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';

function getFilteredEmptyBody(
  t: (key: string, options?: Record<string, string>) => string,
  viewFilter: string | null,
  resource: string
): string {
  if (viewFilter) {
    return t(`No ${resource} data for {{org}} in the selected period.`, { org: viewFilter });
  }
  return t(`No ${resource} data for the selected period.`);
}

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

const RANK_BG_COLORS_LIGHT = [
  'rgba(240, 195, 0, 0.08)',
  'rgba(192, 192, 192, 0.10)',
  'rgba(205, 133, 63, 0.08)',
] as const;

const RANK_BG_COLORS_DARK = [
  'rgba(240, 195, 0, 0.15)',
  'rgba(192, 192, 192, 0.12)',
  'rgba(205, 133, 63, 0.12)',
] as const;

function isDarkTheme(): boolean {
  return document.documentElement.classList.contains('pf-v6-theme-dark');
}

function getRankBgColor(position: number): string {
  const colors = isDarkTheme() ? RANK_BG_COLORS_DARK : RANK_BG_COLORS_LIGHT;
  return colors[position - 1];
}

function getRankRowStyle(
  position: number,
  isYourOrg?: boolean
): React.CSSProperties | undefined {
  if (position <= 3) {
    const style: React.CSSProperties = { backgroundColor: getRankBgColor(position) };
    if (isYourOrg) {
      style.boxShadow = 'inset 3px 0 0 var(--pf-t--global--color--brand--default)';
    }
    return style;
  }
  if (isYourOrg) {
    return {
      backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
    };
  }
  return undefined;
}

function RankBadge({ position }: Readonly<{ position: number }>) {
  if (position === 1) {
    return (
      <Label color="gold" isCompact icon={<TrophyIcon />}>
        {'#1'}
      </Label>
    );
  }
  if (position === 2) {
    return (
      <Label
        isCompact
        style={{ '--pf-v6-c-label--BackgroundColor': isDarkTheme() ? 'rgba(192, 192, 192, 0.25)' : '#e8e8e8' } as React.CSSProperties}
      >
        {'#2'}
      </Label>
    );
  }
  if (position === 3) {
    return (
      <Label
        isCompact
        style={{ '--pf-v6-c-label--BackgroundColor': isDarkTheme() ? 'rgba(205, 133, 63, 0.25)' : '#f0d9b5' } as React.CSSProperties}
      >
        {'#3'}
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

  const filteredUsers = useMemo(() => {
    const scaled = topUsers.map((row) => ({
      ...row,
      jobRuns: Math.round(row.jobRuns * periodScale),
    }));
    if (!viewFilter) return scaled.slice(0, 5);
    return scaled.filter((r) => r.org === viewFilter).slice(0, 5);
  }, [viewFilter, periodScale]);

  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );
  const isDay0 = isDemoMode() && previewMode === 'day0';

  const orgsToShow = isDay0 ? [] : filteredOrganizations;
  const templatesToShow = isDay0 ? [] : filteredTemplates;
  const projectsToShow = isDay0 ? [] : filteredProjects;
  const usersToShow = isDay0 ? [] : filteredUsers;

  const day0EmptyBody = t('Leaderboard data will appear after your first automation runs.');

  const emptyOrgBody = isDay0
    ? day0EmptyBody
    : getFilteredEmptyBody(t, viewFilter, 'organization');
  const emptyTemplateBody = isDay0
    ? day0EmptyBody
    : getFilteredEmptyBody(t, viewFilter, 'template');
  const emptyProjectBody = isDay0
    ? day0EmptyBody
    : getFilteredEmptyBody(t, viewFilter, 'project');
  const emptyUserBody = isDay0
    ? day0EmptyBody
    : t('User run data for the selected period will appear here when available.');

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
                    'Organizations ranked by total automation job runs in the selected period.'
                  )}
                  isEmpty={orgsToShow.length === 0}
                  emptyTitle={t('No data')}
                  emptyBody={emptyOrgBody}
                >
                  <Table variant="compact" aria-label={t('Top organizations')}>
                    <Thead>
                      <Tr>
                        <Th style={{ width: 48 }}>{t('Rank')}</Th>
                        <Th>{t('Organization')}</Th>
                        <Th>{t('Job runs')}</Th>
                        <Th style={{ width: 80, minWidth: 80 }}>{t('Trend')}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {orgsToShow.map((row, index) => (
                        <Tr key={row.orgName} style={getRankRowStyle(index + 1, row.isYourOrg)}>
                          <Td dataLabel={t('Rank')}>
                            <RankBadge position={index + 1} />
                          </Td>
                          <Td
                            dataLabel={t('Organization')}
                            style={isTopThree(index) ? { fontWeight: 700 } : undefined}
                          >
                            <Button variant="link" isInline>
                              {row.orgName}
                            </Button>
                            {row.isYourOrg && (
                              <>
                                {' '}
                                <Label color="blue" isCompact>
                                  {t('You')}
                                </Label>
                              </>
                            )}
                          </Td>
                          <Td dataLabel={t('Job runs')}>{row.jobRuns.toLocaleString()}</Td>
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
                  help={t('Job templates ranked by number of runs in the selected period.')}
                  isEmpty={templatesToShow.length === 0}
                  emptyTitle={t('No data')}
                  emptyBody={emptyTemplateBody
                  }
                >
                  <Table variant="compact" aria-label={t('Top templates')}>
                    <Thead>
                      <Tr>
                        <Th style={{ width: 48 }}>{t('Rank')}</Th>
                        <Th>{t('Template')}</Th>
                        <Th>{t('Runs')}</Th>
                        <Th style={{ width: 80, minWidth: 80 }}>{t('Trend')}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {templatesToShow.map((row, index) => (
                        <Tr key={row.templateName} style={getRankRowStyle(index + 1)}>
                          <Td dataLabel={t('Rank')}>
                            <RankBadge position={index + 1} />
                          </Td>
                          <Td
                            dataLabel={t('Template')}
                            style={isTopThree(index) ? { fontWeight: 700 } : undefined}
                          >
                            <Button variant="link" isInline>
                              {row.templateName}
                            </Button>
                          </Td>
                          <Td dataLabel={t('Runs')}>{row.runCount.toLocaleString()}</Td>
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
                  help={t('Projects ranked by total number of jobs in the selected period.')}
                  isEmpty={projectsToShow.length === 0}
                  emptyTitle={t('No data')}
                  emptyBody={emptyProjectBody}
                >
                  <Table variant="compact" aria-label={t('Top projects')}>
                    <Thead>
                      <Tr>
                        <Th style={{ width: 48 }}>{t('Rank')}</Th>
                        <Th>{t('Project')}</Th>
                        <Th>{t('Jobs')}</Th>
                        <Th style={{ width: 80, minWidth: 80 }}>{t('Trend')}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {projectsToShow.map((row, index) => (
                        <Tr key={row.projectName} style={getRankRowStyle(index + 1)}>
                          <Td dataLabel={t('Rank')}>
                            <RankBadge position={index + 1} />
                          </Td>
                          <Td
                            dataLabel={t('Project')}
                            style={isTopThree(index) ? { fontWeight: 700 } : undefined}
                          >
                            <Button variant="link" isInline>
                              {row.projectName}
                            </Button>
                          </Td>
                          <Td dataLabel={t('Jobs')}>{row.totalJobs.toLocaleString()}</Td>
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
                    'Users ranked by the automation runs they triggered in the selected period.'
                  )}
                  isEmpty={usersToShow.length === 0}
                  emptyTitle={t('No user data')}
                  emptyBody={emptyUserBody}
                >
                  <Table variant="compact" aria-label={t('Top users')}>
                    <Thead>
                      <Tr>
                        <Th style={{ width: 48 }}>{t('Rank')}</Th>
                        <Th>{t('User')}</Th>
                        <Th>{t('Job runs')}</Th>
                        <Th style={{ width: 80, minWidth: 80 }}>{t('Trend')}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {usersToShow.map((row, index) => (
                        <Tr key={row.userName} style={getRankRowStyle(index + 1)}>
                          <Td dataLabel={t('Rank')}>
                            <RankBadge position={index + 1} />
                          </Td>
                          <Td
                            dataLabel={t('User')}
                            style={isTopThree(index) ? { fontWeight: 700 } : undefined}
                          >
                            <Button variant="link" isInline>
                              {row.displayName}
                            </Button>
                          </Td>
                          <Td dataLabel={t('Job runs')}>{row.jobRuns.toLocaleString()}</Td>
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

    </>
  );
}
