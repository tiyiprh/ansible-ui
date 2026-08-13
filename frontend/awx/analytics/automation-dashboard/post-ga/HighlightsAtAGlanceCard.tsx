import { Help } from '@ansible/ansible-ui-framework/components/Help';
import { Card, CardBody, CardHeader, Grid, GridItem, Title } from '@patternfly/react-core';
import { ClusterIcon, CubesIcon, SyncAltIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';
import { AtAGlanceKpiMetric } from './AtAGlanceKpiMetric';
import { HIGHLIGHTS_AT_A_GLANCE } from './postGaMockData';

const FEATURED_TEMPLATE_MAX_LENGTH = 40;

function truncateTemplateName(name: string): string {
  if (name.length <= FEATURED_TEMPLATE_MAX_LENGTH) return name;
  return `${name.slice(0, FEATURED_TEMPLATE_MAX_LENGTH - 1)}…`;
}

export function HighlightsAtAGlanceCard() {
  const { t } = useTranslation();
  const { jobsRun30Days, activeOrganizations, featuredTemplate } = HIGHLIGHTS_AT_A_GLANCE;
  const featuredValue = `${truncateTemplateName(featuredTemplate.name)} (${featuredTemplate.runCount.toLocaleString()})`;

  return (
    <Card className="post-ga-at-a-glance-card" style={{ marginBottom: 24, flexShrink: 0 }}>
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
      <CardBody style={{ padding: 'var(--pf-t--global--spacer--md)' }}>
        <Grid hasGutter className="post-ga-at-a-glance-kpi-row">
          <GridItem sm={4} className="post-ga-at-a-glance-kpi-col">
            <AtAGlanceKpiMetric
              label={t('Jobs run')}
              help={t('Total successful job runs across the platform in the last 30 days.')}
              value={jobsRun30Days.toLocaleString()}
              icon={<SyncAltIcon />}
              iconStatus="info"
            />
          </GridItem>
          <GridItem sm={4} className="post-ga-at-a-glance-kpi-col">
            <AtAGlanceKpiMetric
              label={t('Active organizations')}
              help={t('Organizations with at least one successful job run in the last 30 days.')}
              value={activeOrganizations.toLocaleString()}
              icon={<ClusterIcon />}
              iconStatus="info"
            />
          </GridItem>
          <GridItem sm={4} className="post-ga-at-a-glance-kpi-col">
            <AtAGlanceKpiMetric
              label={t('Featured template')}
              help={t('Most-used job template by run count in the last 30 days.')}
              value={featuredValue}
              icon={<CubesIcon />}
              iconStatus="info"
            />
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
}
