import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Progress,
  ProgressMeasureLocation,
  Title,
} from '@patternfly/react-core';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { MetricLabel, MetricValue } from './DashboardMetricText';
import {
  daysRemainingInQuarter,
  getGoalsCardSnapshot,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';
import { GoalsConfigureEmptyState } from './GoalsConfigureEmptyState';
import { COST_SAVINGS_AT_GLANCE, QUARTERLY_GOAL } from './postGaMockData';

function useGoalsCardState() {
  return useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsCardSnapshot,
    getGoalsCardSnapshot
  );
}

export function DashboardGoalsCard() {
  const { t } = useTranslation();
  const { showEmpty, targets } = useGoalsCardState();

  const runsRemaining = targets.quarterlyRunTarget - QUARTERLY_GOAL.current;
  const savingsVsLastMonth = COST_SAVINGS_AT_GLANCE.thisMonth - COST_SAVINGS_AT_GLANCE.lastMonth;
  const savingsPct =
    COST_SAVINGS_AT_GLANCE.lastMonth > 0
      ? Math.round((savingsVsLastMonth / COST_SAVINGS_AT_GLANCE.lastMonth) * 100)
      : 0;
  const daysLeft = daysRemainingInQuarter();

  function getQuarterlyHelperText(): string {
    if (runsRemaining > 0) {
      return t('{{count}} runs to go · {{days}} days left in quarter', {
        count: runsRemaining,
        days: daysLeft,
      });
    }
    return t('Goal reached · {{days}} days left in quarter', { days: daysLeft });
  }

  const quarterlyProgressValue = Math.round(
    (QUARTERLY_GOAL.current / targets.quarterlyRunTarget) * 100
  );

  const savingsProgressValue = Math.min(
    100,
    Math.round((COST_SAVINGS_AT_GLANCE.thisMonth / targets.monthlySavingsTarget) * 100)
  );

  const quarterlyHelperText = getQuarterlyHelperText();

  const savingsHelperText = t('vs last month: +{{amount}} ({{pct}}%)', {
    amount: savingsVsLastMonth.toLocaleString(),
    pct: savingsPct,
  });

  return (
    <Card className="post-ga-goals-row-card">
      <CardHeader>
        <Title headingLevel="h3" size="xl">
          {t('Goals')}
        </Title>
      </CardHeader>
      <CardBody
        className="post-ga-goals-row-card-body"
        style={{ padding: 'var(--pf-t--global--spacer--md)' }}
      >
        {showEmpty ? (
          <GoalsConfigureEmptyState
            title={t('No goals configured')}
            description={t(
              'Set quarterly run and monthly savings targets to track progress on this dashboard.'
            )}
          />
        ) : (
          <Grid hasGutter>
            <GridItem
              span={12}
              style={{
                paddingBottom: 'var(--pf-t--global--spacer--md)',
                borderBottom: '1px solid var(--pf-t--global--border--color--default)',
              }}
            >
              <DashboardSectionHeading
                title={t('Quarterly automation goal')}
                help={t(
                  'Target number of automation job runs for your organization this quarter. The progress bar shows how many runs you have completed toward that goal.'
                )}
              />
              <div className="post-ga-goals-metric-stack post-ga-goals-metric-stack--populated">
                <MetricValue>
                  {QUARTERLY_GOAL.current.toLocaleString()} {t('of')}{' '}
                  {targets.quarterlyRunTarget.toLocaleString()} {t('runs')}
                </MetricValue>
                <Progress
                  value={quarterlyProgressValue}
                  measureLocation={ProgressMeasureLocation.outside}
                  aria-label={t('Quarterly run goal progress')}
                />
                <MetricLabel>{quarterlyHelperText}</MetricLabel>
              </div>
            </GridItem>
            <GridItem span={12} style={{ paddingTop: 'var(--pf-t--global--spacer--md)' }}>
              <DashboardSectionHeading
                title={t('Cost savings this month')}
                help={t(
                  'Estimated savings from automation instead of manual work this month. Compare your progress to your goal and to last month.'
                )}
              />
              <div className="post-ga-goals-metric-stack post-ga-goals-metric-stack--populated">
                <MetricValue>
                  ${COST_SAVINGS_AT_GLANCE.thisMonth.toLocaleString()} {t('of')} $
                  {targets.monthlySavingsTarget.toLocaleString()} {t('goal')}
                </MetricValue>
                <Progress
                  value={savingsProgressValue}
                  measureLocation={ProgressMeasureLocation.outside}
                  aria-label={t('Cost savings goal progress')}
                />
                <MetricLabel>{savingsHelperText}</MetricLabel>
              </div>
            </GridItem>
          </Grid>
        )}
      </CardBody>
    </Card>
  );
}
