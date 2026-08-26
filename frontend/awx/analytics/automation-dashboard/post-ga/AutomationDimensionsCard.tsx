import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FlexItem,
  Icon,
  Label,
  SimpleList,
  SimpleListItem,
  Title,
} from '@patternfly/react-core';
import {
  CalendarAltIcon,
  ChartBarIcon,
  CrownIcon,
  CubesIcon,

} from '@patternfly/react-icons';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PostGaHelpPopover } from './PostGaHelpPopover';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { MetricLabel, MetricValue } from './DashboardMetricText';
import { LEADERBOARD_RANK_CROWN_CLASS, LeaderboardRankCell } from './LeaderboardRankCell';
import {
  HIGHLIGHTS_DIMENSIONS,
  HIGHLIGHTS_DIMENSION_LEADERBOARDS,
  type HighlightsDimensionLeaderboardRow,
} from './postGaMockData';

function abbreviateName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.map((p) => p[0].toUpperCase()).join('');
}

type DimensionKey = keyof typeof HIGHLIGHTS_DIMENSIONS;

/**
 * Highlights accent — theme-aware via --pf-t--global--icon--color--subtle.
 * Used for dimension row icons and leaderboard bar fills.
 */
const DIMENSION_ACCENT_COLOR = 'var(--post-ga-accent-color)';
const DIMENSION_BAR_COLOR = DIMENSION_ACCENT_COLOR;
const DIMENSION_BAR_MAX_WIDTH = 180;

type DimensionMeta = {
  key: DimensionKey;
  title: string;
  /** Short, always-visible definition shown under the tile title. */
  description: string;
  icon: ReactNode;
  /** e.g. "job runs" — used in the ranked-list help text. */
  valueLabel: string;
};

function DimensionBarListRow({
  row,
  rank,
  maxValue,
}: Readonly<{ row: HighlightsDimensionLeaderboardRow; rank: number; maxValue: number }>) {
  const { t } = useTranslation();
  const widthPct = maxValue > 0 ? Math.max(4, Math.round((row.value / maxValue) * 100)) : 0;

  return (
    <Flex
      alignItems={{ default: 'alignItemsCenter' }}
      gap={{ default: 'gapMd' }}
      style={{ marginBottom: 10 }}
    >
      <FlexItem style={{ width: 56, flexShrink: 0 }}>
        <LeaderboardRankCell position={rank} />
      </FlexItem>
      <FlexItem style={{ width: 150, flexShrink: 0 }}>
        <span style={rank <= 3 ? { fontWeight: 700 } : undefined}>
          {row.isCurrentUser ? row.name : abbreviateName(row.name)}
        </span>
        {row.isCurrentUser ? (
          <Label isCompact color="purple" style={{ marginLeft: 8 }}>
            {t('You')}
          </Label>
        ) : null}
      </FlexItem>
      <FlexItem grow={{ default: 'grow' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 6,
            maxWidth: DIMENSION_BAR_MAX_WIDTH,
            borderRadius: 3,
            backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
          }}
        >
          <div
            style={{
              width: `${widthPct}%`,
              height: '100%',
              borderRadius: 3,
              backgroundColor: DIMENSION_BAR_COLOR,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </FlexItem>
      <FlexItem style={{ width: 64, flexShrink: 0, textAlign: 'right' }}>
        <span>{row.value.toLocaleString()}</span>
      </FlexItem>
    </Flex>
  );
}

function DimensionBarList({ meta }: Readonly<{ meta: DimensionMeta }>) {
  const rows = HIGHLIGHTS_DIMENSION_LEADERBOARDS[meta.key];
  const maxValue = rows[0]?.value ?? 0;

  return (
    <div>
      {rows.map((row, index) => (
        <DimensionBarListRow key={row.id} row={row} rank={index + 1} maxValue={maxValue} />
      ))}
    </div>
  );
}

function DimensionRow({
  meta,
  isSelected,
  onSelect,
}: Readonly<{ meta: DimensionMeta; isSelected: boolean; onSelect: () => void }>) {
  const { t } = useTranslation();
  const { score, rank, totalRanked } = HIGHLIGHTS_DIMENSIONS[meta.key];

  return (
    <SimpleListItem className="post-ga-dimension-row" isActive={isSelected} onClick={onSelect}>
      <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
        <FlexItem>
          {/* Icon's color comes from the wrapped SVG's own `color` (fill="currentColor"),
              not a style on <Icon> itself — PF's Icon content color is driven by an
              internal CSS variable that a plain inline style on the wrapper won't override. */}
          <Icon size="lg">{meta.icon}</Icon>
        </FlexItem>
        <FlexItem flex={{ default: 'flex_1' }}>
          <Title headingLevel="h4" size="lg" style={{ lineHeight: 1.3 }}>
            {meta.title}
          </Title>
          <MetricLabel>{meta.description}</MetricLabel>
        </FlexItem>
        <FlexItem style={{ textAlign: 'right' }}>
          <MetricValue>
            {rank <= 3 ? (
              <CrownIcon
                className={LEADERBOARD_RANK_CROWN_CLASS[rank as 1 | 2 | 3]}
                style={{ marginRight: 6, verticalAlign: '-0.05em' }}
              />
            ) : null}
            {score.toLocaleString()}
          </MetricValue>
          <MetricLabel>{t('Rank {{rank}} of {{total}}', { rank, total: totalRanked })}</MetricLabel>
        </FlexItem>
      </Flex>
    </SimpleListItem>
  );
}

export function AutomationDimensionsCard() {
  const { t } = useTranslation();
  const [selectedDimension, setSelectedDimension] = useState<DimensionKey>('volume');

  const dimensions: DimensionMeta[] = [
    {
      key: 'volume',
      title: t('Volume'),
      description: t('Total number of successful job runs you triggered'),
      icon: <ChartBarIcon style={{ color: DIMENSION_ACCENT_COLOR }} />,
      valueLabel: t('job runs'),
    },
    {
      key: 'breadth',
      title: t('Breadth'),
      description: t('Number of distinct job templates you executed'),
      icon: <CubesIcon style={{ color: DIMENSION_ACCENT_COLOR }} />,
      valueLabel: t('distinct templates'),
    },
    {
      key: 'consistency',
      title: t('Consistency'),
      description: t('Number of days with at least one successful job run'),
      icon: <CalendarAltIcon style={{ color: DIMENSION_ACCENT_COLOR }} />,
      valueLabel: t('active days'),
    },
  ];

  const selectedMeta = dimensions.find((dimension) => dimension.key === selectedDimension);

  return (
    <Card style={{ marginBottom: 24, flexShrink: 0 }}>
      <CardHeader>
        <div>
          <div style={{ whiteSpace: 'nowrap' }}>
            <Title
              headingLevel="h3"
              size="xl"
              style={{ display: 'inline-block', verticalAlign: '-0.15em', lineHeight: 1.2 }}
            >
              {t('Automation dimensions')}
            </Title>
            <PostGaHelpPopover
              title={t('Automation dimensions')}
              help={t(
                'Three scores that capture different aspects of your automation activity. Rank is among all users on this platform. Ties are broken alphabetically.'
              )}
            />
          </div>
          <MetricLabel>
            {t('Click a dimension to update the leaderboard.')}
          </MetricLabel>
        </div>
      </CardHeader>
      <CardBody>
        <Flex alignItems={{ default: 'alignItemsStretch' }}>
          <FlexItem flex={{ default: 'flex_1' }}>
            <SimpleList
              isControlled={false}
              aria-label={t('Automation dimensions')}
              className="post-ga-dimension-list"
            >
              {dimensions.map((dimension) => (
                <DimensionRow
                  key={dimension.key}
                  meta={dimension}
                  isSelected={dimension.key === selectedDimension}
                  onSelect={() => setSelectedDimension(dimension.key)}
                />
              ))}
            </SimpleList>
          </FlexItem>
          <Divider orientation={{ default: 'vertical' }} inset={{ default: 'insetMd' }} />
          <FlexItem flex={{ default: 'flex_1' }}>
            <div style={{ marginBottom: 12 }}>
              <DashboardSectionHeading
                title={t('Top 10 — {{dimension}}', { dimension: selectedMeta?.title })}
                help={t(
                  'Top 10 users ranked by {{label}}. You are shown in the list if you are in the top 10. Ties are broken alphabetically.',
                  { label: selectedMeta?.valueLabel }
                )}
              />
              <MetricLabel>{selectedMeta?.description}</MetricLabel>
            </div>
            {selectedMeta ? <DimensionBarList meta={selectedMeta} /> : null}
          </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
}
