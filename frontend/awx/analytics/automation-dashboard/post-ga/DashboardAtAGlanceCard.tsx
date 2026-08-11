import {
  Card,
  CardBody,
  CardHeader,
  Content,
  Flex,
  Grid,
  GridItem,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { MetricLabel, MetricValue } from './DashboardMetricText';
import {
  getGoalsCardSnapshot,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';
import { GoalsConfigureEmptyState } from './GoalsConfigureEmptyState';
import { loadMaturityLevels } from './maturityUtils';
import {
  HIGHLIGHTS,
  MATURITY_LEVEL,
  ORGANIZATIONS_TOTAL,
  STREAK_HEAT_STRIP_DAYS,
  STREAK_PERIOD_DAYS,
  TEMPLATES_TOTAL,
} from './postGaMockData';

function useGoalsCardState() {
  return useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsCardSnapshot,
    getGoalsCardSnapshot
  );
}

export function DashboardAtAGlanceCard() {
  const { t } = useTranslation();
  const { showEmpty } = useGoalsCardState();
  const levels = loadMaturityLevels();
  const levelCount = levels.length;
  const maturityLevel = Math.min(Math.max(MATURITY_LEVEL, 1), levelCount);
  const currentLevel = levels[maturityLevel - 1];

  return (
    <Card className="post-ga-goals-row-card">
      <CardHeader>
        <Title headingLevel="h3" size="xl">
          {t('Automation at a glance')}
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
              'Configure automation goals to see adoption, activity, and success streak summaries.'
            )}
          />
        ) : (
          <Grid hasGutter>
            <GridItem
              span={12}
              style={{
                paddingBottom: 'var(--pf-t--global--spacer--sm)',
              }}
            >
              <Grid hasGutter>
                <GridItem span={4} className="post-ga-at-a-glance-metric-col">
                  <MetricValue>
                    {ORGANIZATIONS_TOTAL > 0
                      ? Math.round((HIGHLIGHTS.organizationsActive / ORGANIZATIONS_TOTAL) * 100)
                      : 0}
                    %
                  </MetricValue>
                  <MetricLabel>
                    {t('{{active}} out of {{total}} organizations active', {
                      active: HIGHLIGHTS.organizationsActive,
                      total: ORGANIZATIONS_TOTAL,
                    })}
                  </MetricLabel>
                </GridItem>
                <GridItem span={4} className="post-ga-at-a-glance-metric-col">
                  <MetricValue>
                    {TEMPLATES_TOTAL > 0
                      ? Math.round((HIGHLIGHTS.templatesInUse / TEMPLATES_TOTAL) * 100)
                      : 0}
                    %
                  </MetricValue>
                  <MetricLabel>
                    {t('{{active}} out of {{total}} templates in use', {
                      active: HIGHLIGHTS.templatesInUse,
                      total: TEMPLATES_TOTAL,
                    })}
                  </MetricLabel>
                </GridItem>
                <GridItem span={4} className="post-ga-at-a-glance-metric-col">
                  <MetricValue>{HIGHLIGHTS.runsThisMonth.toLocaleString()}</MetricValue>
                  <MetricLabel>{t('Runs this month')}</MetricLabel>
                </GridItem>
              </Grid>
            </GridItem>

            <GridItem
              span={12}
              style={{
                borderTop: '1px solid var(--pf-t--global--border--color--default)',
                paddingTop: 'var(--pf-t--global--spacer--sm)',
                paddingBottom: 'var(--pf-t--global--spacer--sm)',
                textAlign: 'center',
              }}
            >
              <Flex
                alignItems={{ default: 'alignItemsCenter' }}
                justifyContent={{ default: 'justifyContentCenter' }}
                gap={{ default: 'gapSm' }}
                flexWrap={{ default: 'wrap' }}
              >
                <DashboardSectionHeading
                  title={t('Automation adoption')}
                  help={
                    <>
                      <Content component="p" style={{ marginBottom: 12 }}>
                        {t(
                          'Your organization is assessed at one of {{total}} maturity levels based on adoption, consistency, scale, and governance.',
                          { total: levelCount }
                        )}
                      </Content>
                      <Content component="p" style={{ marginBottom: 12 }}>
                        {t(
                          'Levels increase as automation becomes more consistent, standardized, and measured.'
                        )}
                      </Content>
                      <Content component="p" style={{ fontWeight: 600, marginBottom: 6 }}>
                        {t('Levels')}
                      </Content>
                      <ul style={{ margin: 0, paddingLeft: 20, textAlign: 'left' }}>
                        {levels.map((level, i) => (
                          <li key={level.name} style={{ marginBottom: 6 }}>
                            <strong>
                              {t('Level {{n}} – {{name}}:', { n: i + 1, name: level.name })}
                            </strong>{' '}
                            {level.description}
                          </li>
                        ))}
                      </ul>
                    </>
                  }
                />
              </Flex>
              <Flex
                direction={{ default: 'column' }}
                alignItems={{ default: 'alignItemsCenter' }}
                gap={{ default: 'gapSm' }}
                style={{ marginTop: 8 }}
              >
                <MetricValue>
                  {t('Level {{n}} – {{name}}', {
                    n: maturityLevel,
                    name: currentLevel?.name ?? '',
                  })}
                </MetricValue>
                {currentLevel?.description && (
                  <MetricLabel>{currentLevel.description}</MetricLabel>
                )}
              </Flex>
            </GridItem>

            <GridItem
              span={12}
              style={{
                borderTop: '1px solid var(--pf-t--global--border--color--default)',
                paddingTop: 'var(--pf-t--global--spacer--sm)',
              }}
            >
              <DashboardSectionHeading
                title={t('Success streak')}
                help={t(
                  'Shows whether you had at least one successful job run each day over the last 30 days. Green means at least one successful run that day. Gray means no successful runs.'
                )}
              />
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
                      className={`streak-heat-cell ${day.success ? 'streak-heat-cell--success' : 'streak-heat-cell--empty'}`}
                      aria-label={`${day.dateStr}: ${day.success ? `${day.runs} runs` : 'No runs'}`}
                    />
                  </Tooltip>
                ))}
              </Flex>
            </GridItem>
          </Grid>
        )}
      </CardBody>
    </Card>
  );
}
