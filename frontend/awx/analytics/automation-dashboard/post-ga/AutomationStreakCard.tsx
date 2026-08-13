import { Help } from '@ansible/ansible-ui-framework/components/Help';
import { PageChartLegend } from '@ansible/ansible-ui-framework/PageDashboard/PageChartLegend';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FlexItem,
  Label,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { ClusterIcon, CubesIcon, FireIcon, SyncAltIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';
import { AtAGlanceKpiMetric } from './AtAGlanceKpiMetric';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { MetricLabel } from './DashboardMetricText';
import { HIGHLIGHTS_AT_A_GLANCE, HIGHLIGHTS_STREAK } from './postGaMockData';

type StreakDay = (typeof HIGHLIGHTS_STREAK.calendarDays)[number];
type Translate = (key: string, options?: Record<string, unknown>) => string;

function jobRunsLabel(count: number, t: Translate): string {
  return count === 1
    ? t('{{count}} successful job run', { count })
    : t('{{count}} successful job runs', { count });
}

function streakDayTooltipContent(day: StreakDay, success: boolean, runs: number, t: Translate) {
  return (
    <>
      <strong>{day.dateStr}</strong>
      <br />
      {success ? jobRunsLabel(runs, t) : t('No successful job runs')}
    </>
  );
}

function streakDayTooltipAriaLabel(
  day: StreakDay,
  success: boolean,
  runs: number,
  t: Translate
): string {
  return `${day.dateStr}: ${success ? jobRunsLabel(runs, t) : t('No successful job runs')}`;
}

function StreakBadge({ streakDays }: Readonly<{ streakDays: number }>) {
  const { t } = useTranslation();

  return streakDays > 0 ? (
    <Label isCompact color="purple" icon={<FireIcon />}>
      {t('{{count}}-day streak', { count: streakDays })}
    </Label>
  ) : (
    <MetricLabel>{t('No active streak')}</MetricLabel>
  );
}

function StreakDayStrip({
  title,
  streakDays,
  showLegend,
  days,
  isSuccess,
  getRuns,
}: Readonly<{
  title: string;
  streakDays: number;
  /** Only shown on one strip — both strips use the same two colors, so one legend covers both. */
  showLegend?: boolean;
  days: readonly StreakDay[];
  isSuccess: (day: StreakDay) => boolean;
  getRuns: (day: StreakDay) => number;
}>) {
  const { t } = useTranslation();

  return (
    <div>
      <Flex
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        alignItems={{ default: 'alignItemsCenter' }}
        flexWrap={{ default: 'wrap' }}
        gap={{ default: 'gapMd' }}
      >
        <FlexItem>
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
            <FlexItem>
              <div style={{ whiteSpace: 'nowrap' }}>
                <DashboardSectionHeading title={title} size="md" />
              </div>
            </FlexItem>
            <FlexItem>
              <StreakBadge streakDays={streakDays} />
            </FlexItem>
          </Flex>
        </FlexItem>
        {showLegend ? (
          <FlexItem>
            <PageChartLegend
              id="automation-streak-legend"
              horizontal
              showLegendCount={false}
              legend={[
                { label: t('Successful job run'), color: '#3d7317' },
                { label: t('No activity'), color: '#e0e0e0' },
              ]}
            />
          </FlexItem>
        ) : null}
      </Flex>
      <Flex
        gap={{ default: 'gapXs' }}
        flexWrap={{ default: 'wrap' }}
        className="post-ga-at-a-glance-streak-cells"
        style={{ marginTop: 8 }}
      >
        {days.map((day) => {
          const success = isSuccess(day);
          const runs = getRuns(day);
          return (
            <Tooltip
              key={day.dateStr}
              content={streakDayTooltipContent(day, success, runs, t)}
              position="top"
            >
              <div
                className={
                  success
                    ? 'streak-heat-cell streak-heat-cell--success'
                    : 'streak-heat-cell streak-heat-cell--empty'
                }
                aria-label={streakDayTooltipAriaLabel(day, success, runs, t)}
              />
            </Tooltip>
          );
        })}
      </Flex>
    </div>
  );
}

const FEATURED_TEMPLATE_MAX_LENGTH = 40;

function truncateTemplateName(name: string): string {
  if (name.length <= FEATURED_TEMPLATE_MAX_LENGTH) return name;
  return `${name.slice(0, FEATURED_TEMPLATE_MAX_LENGTH - 1)}…`;
}

function AtAGlanceSection() {
  const { t } = useTranslation();
  const { jobsRun30Days, activeOrganizations, featuredTemplate } = HIGHLIGHTS_AT_A_GLANCE;

  const featuredTemplateCaption = (
    <span style={{ fontSize: 'var(--pf-t--global--font--size--sm)', textAlign: 'center' }}>
      {truncateTemplateName(featuredTemplate.name)}
    </span>
  );

  return (
    <div>
      <Flex hasGutter style={{ marginTop: 8 }} alignItems={{ default: 'alignItemsFlexStart' }}>
        <FlexItem
          style={{
            flex: 1,
            borderRight: '1px solid var(--pf-t--global--border--color--default)',
            paddingRight: 'var(--pf-t--global--spacer--md)',
          }}
        >
          <AtAGlanceKpiMetric
            label={t('Jobs run')}
            help={t('Total successful job runs across the platform in the last 30 days.')}
            value={jobsRun30Days.toLocaleString()}
            icon={<SyncAltIcon />}
            iconStatus="info"
          />
        </FlexItem>
        <FlexItem
          style={{
            flex: 1,
            borderRight: '1px solid var(--pf-t--global--border--color--default)',
            paddingRight: 'var(--pf-t--global--spacer--md)',
          }}
        >
          <AtAGlanceKpiMetric
            label={t('Active organizations')}
            help={t('Organizations with at least one successful job run in the last 30 days.')}
            value={activeOrganizations.toLocaleString()}
            icon={<ClusterIcon />}
            iconStatus="info"
          />
        </FlexItem>
        <FlexItem style={{ flex: 1 }}>
          <AtAGlanceKpiMetric
            label={t('Featured template')}
            help={t(
              'Most-used job template by run count in the last 30 days. Ties are broken alphabetically.'
            )}
            value={`${featuredTemplate.runCount.toLocaleString()} ${t('runs')}`}
            caption={featuredTemplateCaption}
            icon={<CubesIcon />}
            iconStatus="info"
          />
        </FlexItem>
      </Flex>
    </div>
  );
}

export function AutomationStreakCard() {
  const { t } = useTranslation();
  const { enterpriseStreakDays, orgStreakDays, calendarDays } = HIGHLIGHTS_STREAK;

  return (
    <Card style={{ marginBottom: 24, flexShrink: 0 }}>
      <CardHeader>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Title
            headingLevel="h3"
            size="lg"
            style={{ display: 'inline-block', verticalAlign: '-0.15em', lineHeight: 1.2 }}
          >
            {t('Automation at a glance')}
          </Title>
          <Help
            title={t('Automation at a glance')}
            help={t('Enterprise-wide automation summary for the last 30 days.')}
          />
        </div>
      </CardHeader>
      <CardBody>
        <AtAGlanceSection />
        <Divider style={{ margin: '16px 0' }} />
        <DashboardSectionHeading
          title={t('Automation streak')}
          help={t(
            'Consecutive calendar days (UTC) with at least one successful job run. Enterprise streak counts platform-wide activity; your org streak counts activity in your organization only.'
          )}
          size="md"
        />
        <div style={{ marginTop: 8 }}>
          <StreakDayStrip
            title={t('Enterprise')}
            streakDays={enterpriseStreakDays}
            showLegend
            days={calendarDays}
            isSuccess={(day) => day.state !== 'none'}
            getRuns={(day) => day.enterpriseRuns}
          />
          <Divider style={{ margin: '16px 0' }} />
          <StreakDayStrip
            title={t('Your org')}
            streakDays={orgStreakDays}
            days={calendarDays}
            isSuccess={(day) => day.state === 'enterpriseAndOrg'}
            getRuns={(day) => day.orgRuns}
          />
        </div>
      </CardBody>
    </Card>
  );
}
