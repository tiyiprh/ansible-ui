import { Help } from '@ansible/ansible-ui-framework/components/Help';
import { PageChartContainer } from '@ansible/ansible-ui-framework';
import {
  pfDanger,
  pfInfo,
  pfSuccess,
  pfWarning,
} from '@ansible/ansible-ui-framework/components/pfcolors';
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Icon,
  Label,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { Chart, ChartDonut, ChartLine } from '@patternfly/react-charts/victory';
import { ArrowUpIcon, ArrowDownIcon, FireIcon, MinusIcon, TrophyIcon } from '@patternfly/react-icons';
import { EmptyStateNoData } from '@ansible/ansible-ui-framework/components/EmptyStateNoData';
import { useMemo, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getGoalsPreviewMode,
  isDemoMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';
import { usePostGaHighlightsFilters } from './PostGaHighlightsFilterContext';
import {
  computeStreakLength,
  getStreakDaysForFilter,
  scaleByHighlightsFilters,
} from './postGaHighlightsFilterUtils';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { MetricLabel } from './DashboardMetricText';
import {
  AUTOMATION_VELOCITY,
  JOB_SUCCESS_BREAKDOWN,
  STREAK_PERIOD_DAYS,
  TEMPLATE_REUSE,
} from './postGaMockData';

const JOB_OUTCOME_COLORS = {
  successful: pfSuccess,
  failed: pfDanger,
  error: pfWarning,
  canceled: pfInfo,
} as const;

function VelocitySparkline({ data }: Readonly<{ data: readonly number[] }>) {
  if (data.length < 2) return null;

  const chartData = data.map((value, index) => ({ x: index + 1, y: value }));
  const trend = (data.at(-1) ?? 0) - data[0];
  let stroke = 'var(--pf-t--global--text--color--subtle)';
  if (trend > 0) stroke = pfSuccess;
  else if (trend < 0) stroke = pfDanger;

  return (
    <div className="automation-health-sparkline">
      <PageChartContainer height={48}>
        {(size) => (
          <Chart
            width={size.width}
            height={size.height}
            padding={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <ChartLine
              data={chartData}
              style={{ data: { stroke, strokeWidth: 2 } }}
            />
          </Chart>
        )}
      </PageChartContainer>
    </div>
  );
}

function JobSuccessDonut({
  segments,
  successPct,
  successLabel,
}: Readonly<{
  segments: readonly { label: string; value: number; color: string }[];
  successPct: number;
  successLabel: string;
}>) {
  return (
    <div className="automation-health-chart">
      <PageChartContainer height={140}>
        {(size) => (
          <ChartDonut
            ariaDesc={successLabel}
            ariaTitle={successLabel}
            constrainToVisibleArea
            data={segments.map((segment) => ({ x: segment.label, y: segment.value }))}
            colorScale={segments.map((segment) => segment.color)}
            height={size.height}
            width={size.width}
            innerRadius={48}
            title={`${successPct}%`}
            subTitle={successLabel}
            padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
          />
        )}
      </PageChartContainer>
    </div>
  );
}

function DeltaLabel({
  current,
  previous,
}: Readonly<{ current: number; previous: number }>) {
  if (previous === 0) return null;
  const delta = current - previous;
  const pct = Math.round((delta / previous) * 100);
  const isPositive = delta > 0;
  const isNegative = delta < 0;

  let ArrowIcon = MinusIcon;
  let status: 'success' | 'danger' | undefined;
  if (isPositive) {
    ArrowIcon = ArrowUpIcon;
    status = 'success';
  } else if (isNegative) {
    ArrowIcon = ArrowDownIcon;
    status = 'danger';
  }

  const prefix = isPositive ? '+' : '';

  return (
    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapXs' }}>
      <FlexItem>
        <Icon size="sm" status={status}>
          <ArrowIcon />
        </Icon>
      </FlexItem>
      <FlexItem>
        <span style={{ fontWeight: 600, fontSize: 'var(--pf-t--global--font--size--sm)' }}>
          {prefix}{pct}%
        </span>
      </FlexItem>
    </Flex>
  );
}

function getStreakMilestone(streak: number): number | null {
  const milestones = [30, 7];
  for (const m of milestones) {
    if (streak >= m) return m;
  }
  return null;
}

export function AutomationHealthCard() {
  const { t } = useTranslation();
  const { organizationFilterIds, periodScale, orgFilterScale } = usePostGaHighlightsFilters();

  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );
  const isDay0 = isDemoMode() && previewMode === 'day0';

  const streakDays = useMemo(
    () => getStreakDaysForFilter(organizationFilterIds),
    [organizationFilterIds]
  );
  const currentStreak = useMemo(() => computeStreakLength(streakDays), [streakDays]);
  const streakMilestone = useMemo(() => getStreakMilestone(currentStreak), [currentStreak]);

  const jobBreakdown = useMemo(
    () => ({
      successful: scaleByHighlightsFilters(JOB_SUCCESS_BREAKDOWN.successful, periodScale, orgFilterScale),
      failed: scaleByHighlightsFilters(JOB_SUCCESS_BREAKDOWN.failed, periodScale, orgFilterScale),
      error: scaleByHighlightsFilters(JOB_SUCCESS_BREAKDOWN.error, periodScale, orgFilterScale),
      canceled: scaleByHighlightsFilters(JOB_SUCCESS_BREAKDOWN.canceled, periodScale, orgFilterScale),
    }),
    [orgFilterScale, periodScale]
  );

  const velocity = useMemo(
    () => ({
      avgRunsPerDay: scaleByHighlightsFilters(
        AUTOMATION_VELOCITY.avgRunsPerDay,
        periodScale,
        orgFilterScale
      ),
      previousAvg: scaleByHighlightsFilters(
        AUTOMATION_VELOCITY.previousAvg,
        periodScale,
        orgFilterScale
      ),
      dailyRuns: AUTOMATION_VELOCITY.dailyRuns.map((value) =>
        scaleByHighlightsFilters(value, periodScale, orgFilterScale)
      ),
    }),
    [orgFilterScale, periodScale]
  );

  const templateReuse = useMemo(
    () => ({
      usedOnce: Math.max(0, Math.round(TEMPLATE_REUSE.usedOnce * orgFilterScale)),
      usedMultiple: Math.max(0, Math.round(TEMPLATE_REUSE.usedMultiple * orgFilterScale)),
      total: Math.max(1, Math.round(TEMPLATE_REUSE.total * orgFilterScale)),
      reusePct: TEMPLATE_REUSE.reusePct,
    }),
    [orgFilterScale]
  );

  if (isDay0) {
    return (
      <Card style={{ marginBottom: 24 }}>
        <CardHeader>
          <Title headingLevel="h3" size="xl">
            {t('Automation health')}
          </Title>
        </CardHeader>
        <CardBody>
          <EmptyStateNoData
            variant="sm"
            title={t('No job data yet')}
            description={t('Run your first automation job to see success rates, velocity, and template reuse metrics.')}
          />
        </CardBody>
      </Card>
    );
  }

  const total =
    jobBreakdown.successful +
    jobBreakdown.failed +
    jobBreakdown.error +
    jobBreakdown.canceled;
  const successPct = Math.round((jobBreakdown.successful / total) * 100);

  const donutSegments = [
    { label: t('Successful'), value: jobBreakdown.successful, color: JOB_OUTCOME_COLORS.successful },
    { label: t('Failed'), value: jobBreakdown.failed, color: JOB_OUTCOME_COLORS.failed },
    { label: t('Error'), value: jobBreakdown.error, color: JOB_OUTCOME_COLORS.error },
    { label: t('Canceled'), value: jobBreakdown.canceled, color: JOB_OUTCOME_COLORS.canceled },
  ] as const;

  return (
    <Card style={{ marginBottom: 24 }}>
      <CardHeader>
        <Title headingLevel="h3" size="xl" style={{ display: 'inline-block', verticalAlign: '-0.15em' }}>
          {t('Automation health')}
        </Title>
        <Help
          title={t('Automation health')}
          help={t('Key health metrics for your automation platform including job success rate, execution velocity, and template reuse.')}
        />
      </CardHeader>
      <CardBody>
        <Grid hasGutter>
          <GridItem md={4}>
            <div className="automation-health-metric">
              <DashboardSectionHeading
                title={t('Job success rate')}
                help={t('Breakdown of job outcomes across all runs in the selected period.')}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                <JobSuccessDonut
                  segments={donutSegments}
                  successPct={successPct}
                  successLabel={t('success')}
                />
                <div style={{ fontSize: 'var(--pf-t--global--font--size--sm)' }}>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapXs' }}>
                    {donutSegments.map((item) => (
                      <FlexItem key={item.label}>
                        <span style={{ color: item.color }}>●</span>
                        {' '}{item.label}: {item.value.toLocaleString()}
                      </FlexItem>
                    ))}
                  </Flex>
                </div>
              </div>
            </div>
          </GridItem>

          <GridItem md={4}>
            <div className="automation-health-metric" style={{ borderLeft: '1px solid var(--pf-t--global--border--color--default)', paddingLeft: 24 }}>
              <DashboardSectionHeading
                title={t('Automation velocity')}
                help={t('Average daily automation runs over the last 14 days compared to the previous period.')}
              />
              <div style={{ marginTop: 8 }}>
                <Flex alignItems={{ default: 'alignItemsBaseline' }} gap={{ default: 'gapMd' }}>
                  <FlexItem>
                    <Title headingLevel="h2" size="2xl" style={{ lineHeight: 1.1 }}>
                      {velocity.avgRunsPerDay}
                    </Title>
                  </FlexItem>
                  <FlexItem>
                    <span style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: 'var(--pf-t--global--font--size--sm)' }}>
                      {t('runs/day')}
                    </span>
                  </FlexItem>
                  <FlexItem>
                    <DeltaLabel current={velocity.avgRunsPerDay} previous={velocity.previousAvg} />
                  </FlexItem>
                </Flex>
                <div style={{ marginTop: 12, color: 'var(--pf-t--global--text--color--subtle)', fontSize: 'var(--pf-t--global--font--size--sm)' }}>
                  {t('Previous period: {{prev}} runs/day', { prev: velocity.previousAvg })}
                </div>
                <div style={{ marginTop: 8 }}>
                  <VelocitySparkline data={velocity.dailyRuns} />
                </div>
                <div style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: 'var(--pf-t--global--font--size--xs)', marginTop: 4 }}>
                  {t('Last 14 days')}
                </div>
              </div>
            </div>
          </GridItem>

          <GridItem md={4}>
            <div className="automation-health-metric" style={{ borderLeft: '1px solid var(--pf-t--global--border--color--default)', paddingLeft: 24 }}>
              <DashboardSectionHeading
                title={t('Template reuse')}
                help={t('Percentage of templates that have been used more than once, indicating healthy content reuse.')}
              />
              <div style={{ marginTop: 8 }}>
                <Flex alignItems={{ default: 'alignItemsBaseline' }} gap={{ default: 'gapMd' }}>
                  <FlexItem>
                    <Title headingLevel="h2" size="2xl" style={{ lineHeight: 1.1 }}>
                      {templateReuse.reusePct}%
                    </Title>
                  </FlexItem>
                  <FlexItem>
                    <span style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: 'var(--pf-t--global--font--size--sm)' }}>
                      {t('reuse rate')}
                    </span>
                  </FlexItem>
                </Flex>
                <div style={{ marginTop: 12 }}>
                  <div
                    style={{
                      display: 'flex',
                      height: 12,
                      borderRadius: 6,
                      overflow: 'hidden',
                      backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                    }}
                  >
                    <div
                      style={{
                        width: `${templateReuse.reusePct}%`,
                        backgroundColor: 'var(--pf-t--global--color--status--success--default)',
                        borderRadius: 6,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
                <Flex
                  direction={{ default: 'column' }}
                  gap={{ default: 'gapXs' }}
                  style={{ marginTop: 12, fontSize: 'var(--pf-t--global--font--size--sm)' }}
                >
                  <FlexItem>
                    <span style={{ color: 'var(--pf-t--global--color--status--success--default)' }}>●</span>
                    {' '}{t('Reused (2+ runs)')}: {templateReuse.usedMultiple}
                  </FlexItem>
                  <FlexItem>
                    <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>●</span>
                    {' '}{t('Used once')}: {templateReuse.usedOnce}
                  </FlexItem>
                  <FlexItem style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                    {t('{{total}} templates total', { total: templateReuse.total })}
                  </FlexItem>
                </Flex>
              </div>
            </div>
          </GridItem>
        </Grid>

        <div style={{ borderTop: '1px solid var(--pf-t--global--border--color--default)', paddingTop: 16, marginTop: 16 }}>
          <Flex
            alignItems={{ default: 'alignItemsCenter' }}
            gap={{ default: 'gapSm' }}
            flexWrap={{ default: 'wrap' }}
          >
            <DashboardSectionHeading
              title={t('Success streak')}
              help={t('Shows whether you had at least one successful job run each day over the last 30 days. Green means at least one successful run that day. Gray means no successful runs.')}
            />
            {currentStreak > 0 && (
              <Label color="orange" isCompact icon={<FireIcon />}>
                {t('{{count}}-day streak', { count: currentStreak })}
              </Label>
            )}
            {streakMilestone !== null && (
              <Label color="gold" isCompact icon={<TrophyIcon />}>
                {t('{{count}}-day milestone!', { count: streakMilestone })}
              </Label>
            )}
          </Flex>
          <MetricLabel>{t('Last {{days}} days', { days: STREAK_PERIOD_DAYS })}</MetricLabel>
          <Flex
            gap={{ default: 'gapXs' }}
            flexWrap={{ default: 'wrap' }}
            style={{ width: '100%', marginTop: 8 }}
          >
            {streakDays.map((day) => (
              <Tooltip
                key={day.dateStr}
                content={
                  <>
                    <strong>{day.dateStr}</strong>
                    <br />
                    {day.success
                      ? t('{{count}} successful run(s)', { count: day.runs })
                      : t('No successful runs')}
                  </>
                }
                position="top"
              >
                <div
                  className={
                    day.success
                      ? 'streak-heat-cell streak-heat-cell--success'
                      : 'streak-heat-cell streak-heat-cell--empty'
                  }
                  aria-label={
                    day.success
                      ? `${day.dateStr}: ${day.runs} runs`
                      : `${day.dateStr}: No runs`
                  }
                />
              </Tooltip>
            ))}
          </Flex>
        </div>
      </CardBody>
    </Card>
  );
}
