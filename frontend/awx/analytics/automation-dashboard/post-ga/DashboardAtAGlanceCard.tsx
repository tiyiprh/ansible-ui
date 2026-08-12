import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Title,
} from '@patternfly/react-core';
import { EmptyStateNoData } from '@ansible/ansible-ui-framework/components/EmptyStateNoData';
import { useSyncExternalStore, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getGoalsPreviewMode,
  isDemoMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';
import { usePostGaHighlightsFilters } from './PostGaHighlightsFilterContext';
import { getScaledHighlights } from './postGaHighlightsFilterUtils';
import { AchievementBadges } from './AchievementBadges';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { MetricLabel, MetricValue } from './DashboardMetricText';

export function DashboardAtAGlanceCard() {
  const { t } = useTranslation();
  const { organizationFilterIds, periodScale } = usePostGaHighlightsFilters();

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
                  {highlights.organizationsTotal > 0
                    ? Math.round(
                        (highlights.organizationsActive / highlights.organizationsTotal) * 100
                      )
                    : 0}
                  %
                </MetricValue>
                <MetricLabel>
                  {t('{{active}} out of {{total}} organizations active', {
                    active: highlights.organizationsActive,
                    total: highlights.organizationsTotal,
                  })}
                </MetricLabel>
              </GridItem>
              <GridItem span={4} className="post-ga-at-a-glance-metric-col">
                <MetricValue>
                  {highlights.templatesTotal > 0
                    ? Math.round((highlights.templatesInUse / highlights.templatesTotal) * 100)
                    : 0}
                  %
                </MetricValue>
                <MetricLabel>
                  {t('{{active}} out of {{total}} templates in use', {
                    active: highlights.templatesInUse,
                    total: highlights.templatesTotal,
                  })}
                </MetricLabel>
              </GridItem>
              <GridItem span={4} className="post-ga-at-a-glance-metric-col">
                <MetricValue>{highlights.runsInPeriod.toLocaleString()}</MetricValue>
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
              help={t(
                'Badges earned based on your automation milestones. Use the arrows to see more. Hover over each badge for details and tier requirements.'
              )}
            />
            <AchievementBadges />
          </GridItem>
        </Grid>
        )}
      </CardBody>
    </Card>
  );
}
