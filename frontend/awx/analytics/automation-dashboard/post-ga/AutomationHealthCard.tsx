import { Help } from '@ansible/ansible-ui-framework/components/Help';
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
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, TrophyIcon } from '@patternfly/react-icons';
import { EmptyStateNoData } from '@ansible/ansible-ui-framework/components/EmptyStateNoData';
import { useMemo, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getGoalsPreviewMode,
  isDemoMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { MetricLabel } from './DashboardMetricText';
import {
  AUTOMATION_VELOCITY,
  JOB_SUCCESS_BREAKDOWN,
  STREAK_HEAT_STRIP_DAYS,
  STREAK_PERIOD_DAYS,
  TEMPLATE_REUSE,
} from './postGaMockData';

function VelocitySparkline({
  data,
  width = 180,
  height = 48,
}: Readonly<{ data: readonly number[]; width?: number; height?: number }>) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * chartW;
      const y = padding + chartH - ((v - min) / range) * chartH;
      return `${x},${y}`;
    })
    .join(' ');

  const lastValue = data.at(-1) ?? 0;
  const trend = lastValue - data[0];
  let color = 'var(--pf-t--global--text--color--subtle)';
  if (trend > 0) color = 'var(--pf-t--global--color--status--success--default)';
  else if (trend < 0) color = 'var(--pf-t--global--color--status--danger--default)';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block' }}
      aria-hidden="true"
    >
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
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

function SvgDonut({
  segments,
  size = 140,
  thickness = 20,
  centerLabel,
  centerSubLabel,
}: Readonly<{
  segments: readonly { value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel: string;
  centerSubLabel: string;
}>) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  let offset = -circumference / 4;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg) => {
        const pct = total > 0 ? seg.value / total : 0;
        const dashLen = pct * circumference;
        const el = (
          <circle
            key={seg.color}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={thickness}
            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
            strokeDashoffset={-offset}
          />
        );
        offset += dashLen;
        return el;
      })}
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 22, fontWeight: 700, fill: 'var(--pf-t--global--text--color--regular)' }}>
        {centerLabel}
      </text>
      <text x="50%" y="62%" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fill: 'var(--pf-t--global--text--color--subtle)' }}>
        {centerSubLabel}
      </text>
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M8 0C5.8 3.2 3 5.6 3 9a5 5 0 0 0 10 0c0-3.4-2.8-5.8-5-9ZM6.5 12a2 2 0 0 1-1-1.7c0-1.3 1-2.3 2.5-3.8.8.8 2.5 2.5 2.5 3.8A2 2 0 0 1 8.5 12Z" />
    </svg>
  );
}

function computeCurrentStreak(days: readonly { success: boolean }[]): number {
  let count = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (!days[i].success) break;
    count++;
  }
  return count;
}

function getStreakMilestone(streak: number): number | null {
  const milestones = [30, 14, 7];
  for (const m of milestones) {
    if (streak >= m) return m;
  }
  return null;
}

export function AutomationHealthCard() {
  const { t } = useTranslation();

  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );
  const isDay0 = isDemoMode() && previewMode === 'day0';

  const currentStreak = useMemo(() => computeCurrentStreak(STREAK_HEAT_STRIP_DAYS), []);
  const streakMilestone = useMemo(() => getStreakMilestone(currentStreak), [currentStreak]);

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
    JOB_SUCCESS_BREAKDOWN.successful +
    JOB_SUCCESS_BREAKDOWN.failed +
    JOB_SUCCESS_BREAKDOWN.error +
    JOB_SUCCESS_BREAKDOWN.canceled;
  const successPct = Math.round((JOB_SUCCESS_BREAKDOWN.successful / total) * 100);

  const donutSegments = [
    { value: JOB_SUCCESS_BREAKDOWN.successful, color: '#3e8635' },
    { value: JOB_SUCCESS_BREAKDOWN.failed, color: '#c9190b' },
    { value: JOB_SUCCESS_BREAKDOWN.error, color: '#f0ab00' },
    { value: JOB_SUCCESS_BREAKDOWN.canceled, color: '#06c' },
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
                <SvgDonut
                  segments={donutSegments}
                  centerLabel={`${successPct}%`}
                  centerSubLabel={t('success')}
                />
                <div style={{ fontSize: 'var(--pf-t--global--font--size--sm)' }}>
                  <Flex direction={{ default: 'column' }} gap={{ default: 'gapXs' }}>
                    {[
                      { color: donutSegments[0].color, label: t('Successful'), value: JOB_SUCCESS_BREAKDOWN.successful },
                      { color: donutSegments[1].color, label: t('Failed'), value: JOB_SUCCESS_BREAKDOWN.failed },
                      { color: donutSegments[2].color, label: t('Error'), value: JOB_SUCCESS_BREAKDOWN.error },
                      { color: donutSegments[3].color, label: t('Canceled'), value: JOB_SUCCESS_BREAKDOWN.canceled },
                    ].map((item) => (
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
                      {AUTOMATION_VELOCITY.avgRunsPerDay}
                    </Title>
                  </FlexItem>
                  <FlexItem>
                    <span style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: 'var(--pf-t--global--font--size--sm)' }}>
                      {t('runs/day')}
                    </span>
                  </FlexItem>
                  <FlexItem>
                    <DeltaLabel current={AUTOMATION_VELOCITY.avgRunsPerDay} previous={AUTOMATION_VELOCITY.previousAvg} />
                  </FlexItem>
                </Flex>
                <div style={{ marginTop: 12, color: 'var(--pf-t--global--text--color--subtle)', fontSize: 'var(--pf-t--global--font--size--sm)' }}>
                  {t('Previous period: {{prev}} runs/day', { prev: AUTOMATION_VELOCITY.previousAvg })}
                </div>
                <div style={{ marginTop: 8 }}>
                  <VelocitySparkline data={AUTOMATION_VELOCITY.dailyRuns} />
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
                      {TEMPLATE_REUSE.reusePct}%
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
                        width: `${TEMPLATE_REUSE.reusePct}%`,
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
                    {' '}{t('Reused (2+ runs)')}: {TEMPLATE_REUSE.usedMultiple}
                  </FlexItem>
                  <FlexItem>
                    <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>●</span>
                    {' '}{t('Used once')}: {TEMPLATE_REUSE.usedOnce}
                  </FlexItem>
                  <FlexItem style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                    {t('{{total}} templates total', { total: TEMPLATE_REUSE.total })}
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
              <Label color="orange" isCompact icon={<FlameIcon />}>
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
            {STREAK_HEAT_STRIP_DAYS.map((day) => (
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
