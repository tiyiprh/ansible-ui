import {
  Card,
  CardBody,
  CardHeader,
  Content,
  Flex,
  FlexItem,
  Icon,
  Title,
} from '@patternfly/react-core';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@patternfly/react-icons';
import { EmptyStateNoData } from '@ansible/ansible-ui-framework/components/EmptyStateNoData';
import { useSyncExternalStore, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getGoalsPreviewMode,
  isDemoMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';
import { usePostGaHighlightsFilters } from './PostGaHighlightsFilterContext';
import { scaleByHighlightsFilters } from './postGaHighlightsFilterUtils';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { WEEK_COMPARISON } from './postGaMockData';

function DeltaIndicator({ current, previous }: Readonly<{ current: number; previous: number }>) {
  if (previous === 0) {
    return (
      <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
        —
      </Content>
    );
  }
  const delta = current - previous;
  const pct = Math.round((delta / previous) * 100);
  const isPositive = delta > 0;
  const isNegative = delta < 0;

  let color = 'var(--pf-t--global--text--color--subtle)';
  if (isPositive) color = 'var(--pf-t--global--color--status--success--default)';
  else if (isNegative) color = 'var(--pf-t--global--color--status--danger--default)';

  let ArrowIcon = MinusIcon;
  if (isPositive) ArrowIcon = ArrowUpIcon;
  else if (isNegative) ArrowIcon = ArrowDownIcon;

  const prefix = isPositive ? '+' : '';

  let status: 'success' | 'danger' | undefined;
  if (isPositive) status = 'success';
  else if (isNegative) status = 'danger';

  return (
    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapXs' }}>
      <FlexItem>
        <Icon size="sm" status={status} style={!status ? { color } : undefined}>
          <ArrowIcon />
        </Icon>
      </FlexItem>
      <FlexItem>
        <span style={{ color, fontWeight: 600, fontSize: 'var(--pf-t--global--font--size--sm)' }}>
          {prefix}{pct}%
        </span>
      </FlexItem>
    </Flex>
  );
}

function ComparisonRow({
  label,
  help,
  currentValue,
  previousValue,
  previousLabel,
  formatValue,
  showComparison = true,
}: Readonly<{
  label: string;
  help: string;
  currentValue: number;
  previousValue: number;
  previousLabel: string;
  formatValue: (n: number) => string;
  showComparison?: boolean;
}>) {
  return (
    <div style={{ paddingBlock: 'var(--pf-t--global--spacer--md)' }}>
      <Flex
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        alignItems={{ default: 'alignItemsFlexStart' }}
      >
        <FlexItem style={{ flex: 1 }}>
          <DashboardSectionHeading title={label} help={help} />
          <Title headingLevel="h2" size="3xl" style={{ lineHeight: 1.1, marginTop: 4 }}>
            {formatValue(currentValue)}
          </Title>
        </FlexItem>
        <FlexItem style={{ textAlign: 'right', paddingTop: 4 }}>
          {showComparison ? (
            <>
              <DeltaIndicator current={currentValue} previous={previousValue} />
              <Content
                component="small"
                style={{ marginTop: 4, color: 'var(--pf-t--global--text--color--subtle)', display: 'block' }}
              >
                {previousLabel}: {formatValue(previousValue)}
              </Content>
            </>
          ) : (
            <Content
              component="small"
              style={{ color: 'var(--pf-t--global--text--color--subtle)', fontStyle: 'italic' }}
            >
              No previous period data yet
            </Content>
          )}
        </FlexItem>
      </Flex>
    </div>
  );
}

export function DashboardGoalsCard() {
  const { t } = useTranslation();
  const { periodScale, orgFilterScale } = usePostGaHighlightsFilters();

  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );
  const isDay0 = isDemoMode() && previewMode === 'day0';

  const weekComparison = useMemo(
    () => ({
      runs: {
        current: scaleByHighlightsFilters(WEEK_COMPARISON.runs.current, periodScale, orgFilterScale),
        previous: scaleByHighlightsFilters(WEEK_COMPARISON.runs.previous, periodScale, orgFilterScale),
      },
      savings: {
        current: scaleByHighlightsFilters(WEEK_COMPARISON.savings.current, periodScale, orgFilterScale),
        previous: scaleByHighlightsFilters(WEEK_COMPARISON.savings.previous, periodScale, orgFilterScale),
      },
      hosts: {
        current: scaleByHighlightsFilters(WEEK_COMPARISON.hosts.current, periodScale, orgFilterScale),
        previous: scaleByHighlightsFilters(WEEK_COMPARISON.hosts.previous, periodScale, orgFilterScale),
      },
    }),
    [orgFilterScale, periodScale]
  );

  return (
    <Card className="post-ga-goals-row-card">
      <CardHeader>
        <Title headingLevel="h3" size="xl">
          {t('Automation trends')}
        </Title>
      </CardHeader>
      <CardBody
        className="post-ga-goals-row-card-body"
        style={{ padding: 'var(--pf-t--global--spacer--md)' }}
      >
        {isDay0 ? (
          <EmptyStateNoData
            variant="sm"
            title={t('No trend data yet')}
            description={t('Trend comparisons will appear here after your first period of automation data.')}
          />
        ) : (
        <Flex direction={{ default: 'column' }} gap={{ default: 'gapNone' }}>
          <FlexItem
            style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}
          >
            <ComparisonRow
              label={t('Job runs this week')}
              help={t(
                'Total automation job runs this week compared to the previous week.'
              )}
              currentValue={weekComparison.runs.current}
              previousValue={weekComparison.runs.previous}
              previousLabel={t('Last week')}
              formatValue={(n) => n.toLocaleString()}
              showComparison
            />
          </FlexItem>
          <FlexItem
            style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}
          >
            <ComparisonRow
              label={t('Cost savings this week')}
              help={t(
                'Estimated cost savings from automation this week compared to the previous week.'
              )}
              currentValue={weekComparison.savings.current}
              previousValue={weekComparison.savings.previous}
              previousLabel={t('Last week')}
              formatValue={(n) => `$${n.toLocaleString()}`}
              showComparison
            />
          </FlexItem>
          <FlexItem>
            <ComparisonRow
              label={t('Hosts managed')}
              help={t(
                'Total managed hosts this week compared to the previous week.'
              )}
              currentValue={weekComparison.hosts.current}
              previousValue={weekComparison.hosts.previous}
              previousLabel={t('Last week')}
              formatValue={(n) => n.toLocaleString()}
              showComparison
            />
          </FlexItem>
        </Flex>
        )}
      </CardBody>
    </Card>
  );
}
