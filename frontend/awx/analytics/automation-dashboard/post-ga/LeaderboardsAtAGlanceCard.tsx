import { PageChartContainer } from '@ansible/ansible-ui-framework';
import { EmptyStateNoData } from '@ansible/ansible-ui-framework/components/EmptyStateNoData';
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Icon,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { ChartDonutUtilization } from '@patternfly/react-charts/victory';
import { ClusterIcon, DollarSignIcon, SyncAltIcon } from '@patternfly/react-icons';
import { useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getGoalsPreviewMode,
  isDemoMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { MetricLabel } from './DashboardMetricText';
import { usePostGaHighlightsFilters } from './PostGaHighlightsFilterContext';
import { getScaledHighlights, scaleByHighlightsFilters } from './postGaHighlightsFilterUtils';
import { WEEK_COMPARISON } from './postGaMockData';
import { SuccessStreakStrip } from './SuccessStreakStrip';

type KpiIconStatus = 'info' | 'success' | 'warning' | 'danger' | 'custom';

function KpiMetricCol({
  label,
  help,
  value,
  formatValue,
  icon,
  iconStatus,
}: Readonly<{
  label: string;
  help: string;
  value: number;
  formatValue: (n: number) => string;
  icon: ReactNode;
  iconStatus: KpiIconStatus;
}>) {
  return (
    <Flex
      direction={{ default: 'column' }}
      alignItems={{ default: 'alignItemsCenter' }}
      gap={{ default: 'gapSm' }}
      className="post-ga-at-a-glance-kpi"
    >
      <Icon size="xl" status={iconStatus}>
        {icon}
      </Icon>
      <div className="post-ga-at-a-glance-kpi-heading">
        <DashboardSectionHeading title={label} help={help} />
      </div>
      <Title headingLevel="h2" size="xl" style={{ lineHeight: 1.1 }}>
        {formatValue(value)}
      </Title>
    </Flex>
  );
}

function AdoptionDonutCol({
  title,
  help,
  active,
  total,
  detailLabel,
  centerSubTitle,
}: Readonly<{
  title: string;
  help: string;
  active: number;
  total: number;
  detailLabel: string;
  centerSubTitle: string;
}>) {
  const pct = total > 0 ? Math.round((active / total) * 100) : 0;

  return (
    <Stack hasGutter className="post-ga-at-a-glance-donut-stack">
      <StackItem>
        <DashboardSectionHeading title={title} help={help} />
      </StackItem>
      <StackItem>
        <Flex justifyContent={{ default: 'justifyContentCenter' }}>
          <FlexItem className="post-ga-at-a-glance-donut-chart">
            <PageChartContainer height={108}>
              {(size) => {
                const chartSize = Math.min(size.width, size.height);
                return (
                  <ChartDonutUtilization
                    ariaDesc={detailLabel}
                    ariaTitle={title}
                    constrainToVisibleArea
                    data={{ x: title, y: pct }}
                    height={chartSize}
                    labels={({ datum }) => (datum.x ? `${datum.x}: ${datum.y}%` : null)}
                    name={title}
                    padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
                    subTitle={centerSubTitle}
                    title={`${pct}%`}
                    width={chartSize}
                  />
                );
              }}
            </PageChartContainer>
          </FlexItem>
        </Flex>
      </StackItem>
      <StackItem>
        <MetricLabel>{detailLabel}</MetricLabel>
      </StackItem>
    </Stack>
  );
}

/** Leaderboards tab — KPIs, period metrics, and success streak in one card. */
export function LeaderboardsAtAGlanceCard() {
  const { t } = useTranslation();
  const { organizationFilterIds, periodScale, orgFilterScale } = usePostGaHighlightsFilters();

  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );
  const isDay0 = isDemoMode() && previewMode === 'day0';

  const highlights = useMemo(
    () => getScaledHighlights(organizationFilterIds, periodScale),
    [organizationFilterIds, periodScale]
  );

  const periodMetrics = useMemo(
    () => ({
      runs: scaleByHighlightsFilters(WEEK_COMPARISON.runs.current, periodScale, orgFilterScale),
      savings: scaleByHighlightsFilters(
        WEEK_COMPARISON.savings.current,
        periodScale,
        orgFilterScale
      ),
      hosts: scaleByHighlightsFilters(WEEK_COMPARISON.hosts.current, periodScale, orgFilterScale),
    }),
    [orgFilterScale, periodScale]
  );

  return (
    <Card className="post-ga-at-a-glance-card" style={{ marginBottom: 24 }}>
      <CardHeader>
        <Title headingLevel="h3" size="xl">
          {t('Automation at a glance')}
        </Title>
      </CardHeader>
      <CardBody>
        {isDay0 ? (
          <EmptyStateNoData
            variant="sm"
            title={t('No automation activity yet')}
            description={t(
              'Start automating to see organization activity, template usage, period metrics, and success streak.'
            )}
          />
        ) : (
          <Grid hasGutter className="post-ga-at-a-glance-layout">
            <GridItem span={12} className="post-ga-at-a-glance-summary-row">
              <Grid hasGutter className="post-ga-at-a-glance-summary-grid" style={{ alignItems: 'center' }}>
                <GridItem md={6} className="post-ga-at-a-glance-summary-left">
                  <Grid hasGutter>
                    <GridItem sm={6} className="post-ga-at-a-glance-donut-col">
                      <AdoptionDonutCol
                        title={t('Organizations active')}
                        help={t(
                          'Share of organizations that ran at least one job in the selected period.'
                        )}
                        active={highlights.organizationsActive}
                        total={highlights.organizationsTotal}
                        centerSubTitle={t('Active')}
                        detailLabel={t('{{active}} out of {{total}} organizations active', {
                          active: highlights.organizationsActive,
                          total: highlights.organizationsTotal,
                        })}
                      />
                    </GridItem>
                    <GridItem sm={6} className="post-ga-at-a-glance-donut-col">
                      <AdoptionDonutCol
                        title={t('Templates in use')}
                        help={t(
                          'Share of job templates that ran at least once in the selected period.'
                        )}
                        active={highlights.templatesInUse}
                        total={highlights.templatesTotal}
                        centerSubTitle={t('In use')}
                        detailLabel={t('{{active}} out of {{total}} templates in use', {
                          active: highlights.templatesInUse,
                          total: highlights.templatesTotal,
                        })}
                      />
                    </GridItem>
                  </Grid>
                </GridItem>

                <GridItem md={6} className="post-ga-at-a-glance-summary-right">
                  <Grid hasGutter className="post-ga-at-a-glance-kpi-row">
                    <GridItem sm={4} className="post-ga-at-a-glance-kpi-col">
                      <KpiMetricCol
                        label={t('Job runs')}
                        help={t('Total job runs in the selected period.')}
                        value={periodMetrics.runs}
                        formatValue={(n) => n.toLocaleString()}
                        icon={<SyncAltIcon />}
                        iconStatus="info"
                      />
                    </GridItem>
                    <GridItem sm={4} className="post-ga-at-a-glance-kpi-col">
                      <KpiMetricCol
                        label={t('Cost savings')}
                        help={t('Estimated cost savings from automation in the selected period.')}
                        value={periodMetrics.savings}
                        formatValue={(n) => `$${n.toLocaleString()}`}
                        icon={<DollarSignIcon />}
                        iconStatus="info"
                      />
                    </GridItem>
                    <GridItem sm={4} className="post-ga-at-a-glance-kpi-col">
                      <KpiMetricCol
                        label={t('Hosts managed')}
                        help={t('Total managed hosts in the selected period.')}
                        value={periodMetrics.hosts}
                        formatValue={(n) => n.toLocaleString()}
                        icon={<ClusterIcon />}
                        iconStatus="info"
                      />
                    </GridItem>
                  </Grid>
                </GridItem>
              </Grid>
            </GridItem>

            <GridItem span={12}>
              <SuccessStreakStrip />
            </GridItem>
          </Grid>
        )}
      </CardBody>
    </Card>
  );
}
