import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Title,
} from '@patternfly/react-core';
import { EmptyStateNoData } from '@ansible/ansible-ui-framework/components/EmptyStateNoData';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getGoalsPreviewMode,
  isDemoMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';
import { AchievementBadges } from './AchievementBadges';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { MetricLabel, MetricValue } from './DashboardMetricText';
import {
  HIGHLIGHTS,
  ORGANIZATIONS_TOTAL,
  TEMPLATES_TOTAL,
} from './postGaMockData';

export function DashboardAtAGlanceCard() {
  const { t } = useTranslation();

  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );
  const isDay0 = isDemoMode() && previewMode === 'day0';

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
        {isDay0 ? (
          <EmptyStateNoData
            variant="sm"
            title={t('No automation activity yet')}
            description={t('Start automating to see organization activity, template usage, and achievements.')}
          />
        ) : (
        <Grid hasGutter>
          <GridItem span={12}>
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
                <MetricLabel>{t('Runs in selected period')}</MetricLabel>
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem
            span={12}
            style={{
              borderTop: '1px solid var(--pf-t--global--border--color--default)',
              paddingTop: 'var(--pf-t--global--spacer--sm)',
            }}
          >
            <DashboardSectionHeading
              title={t('Achievements')}
              help={t('Badges earned based on your automation milestones. Hover over each badge for details and next tier requirements.')}
            />
            <div style={{ marginTop: 8 }}>
              <AchievementBadges />
            </div>
          </GridItem>
        </Grid>
        )}
      </CardBody>
    </Card>
  );
}
