import { Tooltip } from '@patternfly/react-core';
import {
  ArrowUpIcon,
  CheckCircleIcon,
  ClusterIcon,
  FireIcon,
  ShareAltIcon,
  SyncAltIcon,
  TrophyIcon,
} from '@patternfly/react-icons';
import StarIcon from '@patternfly/react-icons/dist/esm/icons/star-icon';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { useMemo, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getGoalsPreviewMode,
  isDemoMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';
import { usePostGaHighlightsFilters } from './PostGaHighlightsFilterContext';
import {
  computeStreakLength,
  getScaledHighlights,
  getStreakDaysForFilter,
  scaleByHighlightsFilters,
} from './postGaHighlightsFilterUtils';
import {
  ACHIEVEMENT_METRICS,
  ORGANIZATIONS_TOTAL,
  QUARTERLY_GOAL,
  topOrganizations,
} from './postGaMockData';

type BadgeTier = 'locked' | 'bronze' | 'silver' | 'gold';

const TIER_CONFIG: Record<BadgeTier, { stars: number; opacity: number }> = {
  locked: { stars: 0, opacity: 1 },
  bronze: { stars: 1, opacity: 1 },
  silver: { stars: 2, opacity: 1 },
  gold: { stars: 3, opacity: 1 },
};

const TIER_DOT_CLASS: Record<Exclude<BadgeTier, 'locked'>, string> = {
  gold: 'post-ga-tier--gold',
  silver: 'post-ga-tier--silver',
  bronze: 'post-ga-tier--bronze',
};

const TIER_SORT_RANK: Record<BadgeTier, number> = {
  gold: 3,
  silver: 2,
  bronze: 1,
  locked: 0,
};

type TierRequirements = {
  bronze: string;
  silver: string;
  gold: string;
};

type BadgeDef = {
  id: string;
  label: string;
  icon: React.ReactNode;
  tier: BadgeTier;
  description: string;
  tierRequirements: TierRequirements;
  nextTierHint: string;
};

function buildTierRequirements(tiers: TierRequirements): TierRequirements {
  return tiers;
}

function computeTier(value: number, thresholds: [number, number, number]): BadgeTier {
  if (value >= thresholds[2]) return 'gold';
  if (value >= thresholds[1]) return 'silver';
  if (value >= thresholds[0]) return 'bronze';
  return 'locked';
}

function computeTierMax(value: number, maxThresholds: [number, number, number]): BadgeTier {
  if (value <= maxThresholds[2]) return 'gold';
  if (value <= maxThresholds[1]) return 'silver';
  if (value <= maxThresholds[0]) return 'bronze';
  return 'locked';
}

function sortBadgesEarnedFirst(badges: BadgeDef[]): BadgeDef[] {
  return badges
    .map((badge, index) => ({ badge, index }))
    .sort((a, b) => {
      const aEarned = a.badge.tier !== 'locked';
      const bEarned = b.badge.tier !== 'locked';
      if (aEarned !== bEarned) return aEarned ? -1 : 1;
      if (aEarned && bEarned) {
        const tierDiff = TIER_SORT_RANK[b.badge.tier] - TIER_SORT_RANK[a.badge.tier];
        if (tierDiff !== 0) return tierDiff;
      }
      return a.index - b.index;
    })
    .map(({ badge }) => badge);
}

function buildRecoveryBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  currentRate: number,
  previousRate: number
): BadgeDef {
  const priorWeekWasBad = previousRate < 90;
  const improved = currentRate > previousRate;
  const tier = priorWeekWasBad && improved ? computeTier(currentRate, [90, 95, 98]) : 'locked';

  const description = t(
    'Week-over-week improvement in platform job success rate after a sub-90% week.'
  );

  const tierRequirements = buildTierRequirements({
    bronze: t('Recover to at least 90% success rate'),
    silver: t('Recover to at least 95% success rate'),
    gold: t('Recover to at least 98% success rate'),
  });

  const statusLine = priorWeekWasBad
    ? t('Currently: {{current}}% success rate (was {{previous}}% last week)', {
        current: currentRate,
        previous: previousRate,
      })
    : t('Currently: {{current}}% success rate — no recovery needed this week', {
        current: currentRate,
      });

  return {
    id: 'failure-recovery',
    label: t('Recovery'),
    icon: <SyncAltIcon />,
    tier,
    description,
    tierRequirements,
    nextTierHint: statusLine,
  };
}

function buildCleanWeekBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  consecutiveDays: number
): BadgeDef {
  const tier = computeTier(consecutiveDays, [3, 7, 14]);

  const description = t('Consecutive days with no failed or errored jobs platform-wide.');

  const tierRequirements = buildTierRequirements({
    bronze: t('3 consecutive clean days'),
    silver: t('7 consecutive clean days'),
    gold: t('14+ consecutive clean days'),
  });

  const statusLine = t('Currently: {{count}} consecutive clean days', { count: consecutiveDays });

  return {
    id: 'clean-week',
    label: t('Clean week'),
    icon: <CheckCircleIcon />,
    tier,
    description,
    tierRequirements,
    nextTierHint: statusLine,
  };
}

function buildRunsBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  totalRuns: number
): BadgeDef {
  const tier = computeTier(totalRuns, [10000, 50000, 100000]);

  const description = t('Tracks total automation job runs across your platform.');

  const tierRequirements = buildTierRequirements({
    bronze: t('10,000 total job runs'),
    silver: t('50,000 total job runs'),
    gold: t('100,000+ total job runs'),
  });

  const statusLine = t('Currently: {{count}} total job runs', {
    count: totalRuns.toLocaleString(),
  });

  return {
    id: '10k-club',
    label: t('10K Runs'),
    icon: <TrophyIcon />,
    tier,
    description,
    tierRequirements,
    nextTierHint: statusLine,
  };
}

function buildStreakBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  streakLen: number
): BadgeDef {
  const tier = computeTier(streakLen, [7, 14, 30]);

  const description = t('Consecutive days with at least one successful job run.');

  const tierRequirements = buildTierRequirements({
    bronze: t('7 consecutive days'),
    silver: t('14 consecutive days'),
    gold: t('30+ consecutive days'),
  });

  const statusLine = t('Currently: {{count}}-day streak', { count: streakLen });

  return {
    id: 'streak-master',
    label: t('Daily Streak'),
    icon: <FireIcon />,
    tier,
    description,
    tierRequirements,
    nextTierHint: statusLine,
  };
}

function buildRisingStarBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  trendingCount: number,
  totalOrgs: number
): BadgeDef {
  const trendingPct = totalOrgs > 0 ? Math.round((trendingCount / totalOrgs) * 100) : 0;
  const tier = computeTier(trendingPct, [25, 50, 75]);

  const description = t(
    'Share of organizations on your platform with week-over-week job run growth.'
  );

  const tierRequirements = buildTierRequirements({
    bronze: t('At least 25% of orgs trending up'),
    silver: t('At least 50% of orgs trending up'),
    gold: t('At least 75% of orgs trending up'),
  });

  const statusLine = t('Currently: {{count}} of {{total}} organizations trending up ({{pct}}%)', {
    count: trendingCount,
    total: totalOrgs,
    pct: trendingPct,
  });

  return {
    id: 'rising-star',
    label: t('Trending Up'),
    icon: <ArrowUpIcon />,
    tier,
    description,
    tierRequirements,
    nextTierHint: statusLine,
  };
}

function buildFleetBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  orgPct: number
): BadgeDef {
  const tier = computeTier(orgPct, [50, 80, 100]);

  const description = t('Percentage of organizations with at least one automation run.');

  const tierRequirements = buildTierRequirements({
    bronze: t('50% of orgs active'),
    silver: t('80% of orgs active'),
    gold: t('100% of orgs active'),
  });

  const statusLine = t('Currently: {{pct}}% of organizations active', { pct: orgPct });

  return {
    id: 'full-fleet',
    label: t('Org Adoption'),
    icon: <CubesIcon />,
    tier,
    description,
    tierRequirements,
    nextTierHint: statusLine,
  };
}

function buildBalancedPlatformBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  largestOrgSharePct: number,
  largestOrgName: string
): BadgeDef {
  const tier = computeTierMax(largestOrgSharePct, [50, 35, 25]);

  const description = t(
    'No single organization accounts for too large a share of platform job runs.'
  );

  const tierRequirements = buildTierRequirements({
    bronze: t('Largest org ≤50% of runs'),
    silver: t('Largest org ≤35% of runs'),
    gold: t('Largest org ≤25% of runs'),
  });

  const statusLine = t('Currently: {{org}} — {{pct}}% of runs', {
    org: largestOrgName,
    pct: largestOrgSharePct,
  });

  return {
    id: 'balanced-platform',
    label: t('Run distribution'),
    icon: <ShareAltIcon />,
    tier,
    description,
    tierRequirements,
    nextTierHint: statusLine,
  };
}

function buildEvenLoadBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  maxInstanceSharePct: number,
  busiestInstanceName: string
): BadgeDef {
  const tier = computeTierMax(maxInstanceSharePct, [60, 45, 30]);

  const description = t('Job runs are spread across controller instances without heavy concentration.');

  const tierRequirements = buildTierRequirements({
    bronze: t('Busiest instance ≤60% of runs'),
    silver: t('Busiest instance ≤45% of runs'),
    gold: t('Busiest instance ≤30% of runs'),
  });

  const statusLine = t('Currently: {{instance}} — {{pct}}% of runs', {
    instance: busiestInstanceName,
    pct: maxInstanceSharePct,
  });

  return {
    id: 'even-load',
    label: t('Execution balance'),
    icon: <ClusterIcon />,
    tier,
    description,
    tierRequirements,
    nextTierHint: statusLine,
  };
}

function computeBadges(
  t: (s: string, opts?: Record<string, unknown>) => string,
  organizationFilterIds: readonly string[],
  periodScale: number,
  orgFilterScale: number
): BadgeDef[] {
  const totalRuns = scaleByHighlightsFilters(QUARTERLY_GOAL.current, periodScale, orgFilterScale);
  const streakLen = computeStreakLength(getStreakDaysForFilter(organizationFilterIds));

  const trendingCount = topOrganizations.filter((org) => org.trend === 'up').length;
  const organizationsTotal =
    organizationFilterIds.length > 0 ? organizationFilterIds.length : ORGANIZATIONS_TOTAL;

  const highlights = getScaledHighlights(organizationFilterIds, periodScale);
  const orgPct =
    highlights.organizationsTotal > 0
      ? Math.round((highlights.organizationsActive / highlights.organizationsTotal) * 100)
      : 0;

  return sortBadgesEarnedFirst([
    buildRecoveryBadge(
      t,
      ACHIEVEMENT_METRICS.recoverySuccessRateCurrent,
      ACHIEVEMENT_METRICS.recoverySuccessRatePrevious
    ),
    buildCleanWeekBadge(t, ACHIEVEMENT_METRICS.cleanWeekConsecutiveDays),
    buildRisingStarBadge(t, trendingCount, organizationsTotal),
    buildBalancedPlatformBadge(
      t,
      ACHIEVEMENT_METRICS.largestOrgSharePct,
      ACHIEVEMENT_METRICS.largestOrgName
    ),
    buildEvenLoadBadge(
      t,
      ACHIEVEMENT_METRICS.maxInstanceSharePct,
      ACHIEVEMENT_METRICS.busiestInstanceName
    ),
    buildFleetBadge(t, orgPct),
    buildRunsBadge(t, totalRuns),
    buildStreakBadge(t, streakLen),
  ]);
}

function TierStars({ count }: Readonly<{ count: number }>) {
  if (count === 0) {
    return <span className="achievement-badge__stars" aria-hidden />;
  }

  return (
    <span className="achievement-badge__stars" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <StarIcon key={index} />
      ))}
    </span>
  );
}

function TierRequirementLine({
  tier,
  label,
  requirement,
}: Readonly<{
  tier: Exclude<BadgeTier, 'locked'>;
  label: string;
  requirement: string;
}>) {
  return (
    <div className="achievement-badge-tier-line">
      <span
        className={`achievement-badge-tier-dot ${TIER_DOT_CLASS[tier]}`}
        aria-hidden="true"
      />
      <span>
        {label}: {requirement}
      </span>
    </div>
  );
}

function Badge({ badge }: Readonly<{ badge: BadgeDef }>) {
  const { t } = useTranslation();
  const isEarned = badge.tier !== 'locked';
  const config = TIER_CONFIG[badge.tier];

  const tooltipContent = (
    <>
      <strong>{badge.label}</strong>
      {isEarned && (
        <>
          {' '}
          <span style={{ textTransform: 'capitalize' }}>({badge.tier})</span>
        </>
      )}
      <br />
      {badge.description}
      <br />
      <br />
      <div className="achievement-badge-tier-list">
        <TierRequirementLine tier="gold" label={t('Gold')} requirement={badge.tierRequirements.gold} />
        <TierRequirementLine tier="silver" label={t('Silver')} requirement={badge.tierRequirements.silver} />
        <TierRequirementLine tier="bronze" label={t('Bronze')} requirement={badge.tierRequirements.bronze} />
      </div>
      <br />
      <em>{badge.nextTierHint}</em>
    </>
  );

  const tierClass =
    isEarned && badge.tier !== 'locked' ? `achievement-badge--tier-${badge.tier}` : '';

  return (
    <Tooltip content={tooltipContent} position="bottom">
      <div
        className={`achievement-badge ${isEarned ? 'achievement-badge--earned' : 'achievement-badge--locked'} ${tierClass}`.trim()}
        style={{ opacity: config.opacity }}
        aria-label={badge.label}
      >
        <TierStars count={config.stars} />
        <span className="achievement-badge__icon">{badge.icon}</span>
        <span className="achievement-badge__label">{badge.label}</span>
      </div>
    </Tooltip>
  );
}

export function AchievementBadges() {
  const { t } = useTranslation();
  const { organizationFilterIds, periodScale, orgFilterScale } = usePostGaHighlightsFilters();
  const badges = useMemo(
    () => computeBadges(t, organizationFilterIds, periodScale, orgFilterScale),
    [t, organizationFilterIds, periodScale, orgFilterScale]
  );

  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );
  const isDay0 = isDemoMode() && previewMode === 'day0';

  if (isDay0) {
    return (
      <span style={{ color: 'var(--pf-t--global--text--color--subtle)', fontStyle: 'italic', fontSize: 'var(--pf-t--global--font--size--sm)' }}>
        {t('Badges unlock as you reach automation milestones.')}
      </span>
    );
  }

  return (
    <div className="achievement-badges-grid--4col">
      {badges.map((badge) => (
        <Badge key={badge.id} badge={badge} />
      ))}
    </div>
  );
}
