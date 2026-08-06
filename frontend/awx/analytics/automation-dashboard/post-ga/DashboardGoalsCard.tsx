import { useGetPageUrl } from '@ansible/ansible-ui-framework';
import {
  Button,
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
import { Link } from 'react-router-dom';
import { PlatformRoute } from '../../../../../platform/main/PlatformRoutes';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { MetricLabel, MetricValue } from './DashboardMetricText';
import {
  daysRemainingInQuarter,
  getGoalsCardSnapshot,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';
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
  const getPageUrl = useGetPageUrl();
  const { showEmpty, targets } = useGoalsCardState();
  const settingsEditUrl = `${getPageUrl(PlatformRoute.AutomationDashboardSettings)}/edit`;

  const runsRemaining = QUARTERLY_GOAL.current - targets.quarterlyRunTarget;
  const savingsVsLastMonth = COST_SAVINGS_AT_GLANCE.thisMonth - COST_SAVINGS_AT_GLANCE.lastMonth;
  const savingsPct =
    COST_SAVINGS_AT_GLANCE.lastMonth > 0
      ? Math.round((savingsVsLastMonth / COST_SAVINGS_AT_GLANCE.lastMonth) * 100)
      : 0;
  const daysLeft = daysRemainingInQuarter();

  function getQuarterlyHelperText(): string {
    if (showEmpty) {
      return t('— · {{days}} days left in quarter', { days: daysLeft });
    }
    if (runsRemaining > 0) {
      return t('{{count}} runs to go · {{days}} days left in quarter', {
        count: runsRemaining,
        days: daysLeft,
      });
    }
    return t('Goal reached · {{days}} days left in quarter', { days: daysLeft });
  }

  const quarterlyProgressValue = showEmpty
    ? 0
    : Math.round((QUARTERLY_GOAL.current / targets.quarterlyRunTarget) * 100);

  const savingsProgressValue = showEmpty
    ? 0
    : Math.min(
        100,
        Math.round((COST_SAVINGS_AT_GLANCE.thisMonth / targets.monthlySavingsTarget) * 100)
      );

  const quarterlyHelperText = getQuarterlyHelperText();

  const savingsHelperText = showEmpty
    ? '—'
    : t('vs last month: +{{amount}} ({{pct}}%)', {
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
                'Enterprise-wide target for automation job runs this quarter. The progress bar shows how many runs have been completed toward the goal; use it to track team adoption and capacity planning.'
              )}
            />
            <div
              className={`post-ga-goals-metric-stack${showEmpty ? '' : ' post-ga-goals-metric-stack--populated'}`}
            >
              <MetricValue>
                {showEmpty ? (
                  <>
                    — {t('of')} — {t('runs')}
                  </>
                ) : (
                  <>
                    {QUARTERLY_GOAL.current.toLocaleString()} {t('of')}{' '}
                    {targets.quarterlyRunTarget.toLocaleString()} {t('runs')}
                  </>
                )}
              </MetricValue>
              <Progress
                value={quarterlyProgressValue}
                measureLocation={ProgressMeasureLocation.outside}
                aria-label={t('Quarterly run goal progress')}
                aria-hidden={showEmpty}
              />
              <MetricLabel>{quarterlyHelperText}</MetricLabel>
            </div>
          </GridItem>
          <GridItem span={12} style={{ paddingTop: 'var(--pf-t--global--spacer--md)' }}>
            <DashboardSectionHeading
              title={t('Cost savings this month')}
              help={t(
                'Estimated savings from running jobs on automation instead of manually, for the current month. Compare to your goal and to last month to track trend.'
              )}
            />
            <div
              className={`post-ga-goals-metric-stack${showEmpty ? '' : ' post-ga-goals-metric-stack--populated'}`}
            >
              <MetricValue>
                {showEmpty ? (
                  <>
                    $— {t('of')} $— {t('goal')}
                  </>
                ) : (
                  <>
                    ${COST_SAVINGS_AT_GLANCE.thisMonth.toLocaleString()} {t('of')} $
                    {targets.monthlySavingsTarget.toLocaleString()} {t('goal')}
                  </>
                )}
              </MetricValue>
              <Progress
                value={savingsProgressValue}
                measureLocation={ProgressMeasureLocation.outside}
                aria-label={t('Cost savings goal progress')}
                aria-hidden={showEmpty}
              />
              <MetricLabel>{savingsHelperText}</MetricLabel>
            </div>
          </GridItem>
          <GridItem span={12} style={{ paddingTop: 'var(--pf-t--global--spacer--md)' }}>
            {showEmpty ? (
              <Link to={settingsEditUrl}>
                <Button variant="primary">{t('Configure goals')}</Button>
              </Link>
            ) : (
              <span className="post-ga-goals-card-actions-spacer" aria-hidden="true" />
            )}
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
}
