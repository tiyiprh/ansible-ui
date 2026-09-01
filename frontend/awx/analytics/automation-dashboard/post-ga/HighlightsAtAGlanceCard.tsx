import { Card, CardBody, Grid, GridItem, Icon, Title } from '@patternfly/react-core';
import { ClusterIcon, CubesIcon, StarIcon, SyncAltIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';
import { MetricValue } from './DashboardMetricText';
import { HighlightsSplitKpiCard } from './HighlightsSplitKpiCard';
import { HIGHLIGHTS_AT_A_GLANCE } from './postGaMockData';

export function HighlightsAtAGlanceKpiCards() {
  const { t } = useTranslation();
  const { jobsRun30Days, activeOrganizations, featuredTemplate } = HIGHLIGHTS_AT_A_GLANCE;

  return (
    <div className="post-ga-at-a-glance-section" style={{ marginBottom: 24, flexShrink: 0 }}>
      <Title
        headingLevel="h3"
        size="xl"
        className="post-ga-at-a-glance-section__title"
        style={{ display: 'block', lineHeight: 1.2 }}
      >
        {t('At a glance')}
      </Title>
      <Grid hasGutter className="post-ga-highlights-kpi-cards">
        <GridItem md={4}>
          <Card style={{ height: '100%', flexShrink: 0 }}>
            <CardBody style={{ padding: 'var(--pf-t--global--spacer--md)' }}>
              <HighlightsSplitKpiCard
                dimensionLabel={t('Velocity')}
                dimensionIcon={<SyncAltIcon />}
                metricLabel={t('Jobs run')}
                helpTitle={t('Jobs run')}
                help={t('Total successful job runs across the platform.')}
                value={<MetricValue>{jobsRun30Days.toLocaleString()}</MetricValue>}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={4}>
          <Card style={{ height: '100%', flexShrink: 0 }}>
            <CardBody style={{ padding: 'var(--pf-t--global--spacer--md)' }}>
              <HighlightsSplitKpiCard
                dimensionLabel={t('Reach')}
                dimensionIcon={<ClusterIcon />}
                metricLabel={t('Active orgs')}
                helpTitle={t('Active orgs')}
                help={t('Organizations with at least one successful job run.')}
                value={<MetricValue>{activeOrganizations.toLocaleString()}</MetricValue>}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem md={4}>
          <Card style={{ height: '100%', flexShrink: 0 }}>
            <CardBody style={{ padding: 'var(--pf-t--global--spacer--md)' }}>
              <HighlightsSplitKpiCard
                dimensionLabel={t('Usage')}
                dimensionIcon={<CubesIcon />}
                metricLabel={t('Featured template')}
                helpTitle={t('Featured template')}
                help={t('Most-used job template by run count. Ties are broken alphabetically.')}
                value={<MetricValue>{featuredTemplate.runCount.toLocaleString()}</MetricValue>}
                caption={
                  <span
                    style={{
                      fontSize: 'var(--pf-t--global--font--size--sm)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Icon size="sm" status="custom" className="post-ga-featured-template-star">
                      <StarIcon />
                    </Icon>
                    {featuredTemplate.name}
                  </span>
                }
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </div>
  );
}

/** @deprecated Use HighlightsAtAGlanceKpiCards */
export const HighlightsAtAGlanceCard = HighlightsAtAGlanceKpiCards;
