import { Tooltip } from '@patternfly/react-core';
import {
  TrophyIcon,
  ArrowUpIcon,
  StarIcon,
} from '@patternfly/react-icons';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { useMemo, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getGoalsPreviewMode,
  isDemoMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';
import {
  HIGHLIGHTS,
  ORGANIZATIONS_TOTAL,
  QUARTERLY_GOAL,
  STREAK_HEAT_STRIP_DAYS,
  topOrganizations,
} from './postGaMockData';

function FlameIconSmall() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C5.8 3.2 3 5.6 3 9a5 5 0 0 0 10 0c0-3.4-2.8-5.8-5-9ZM6.5 12a2 2 0 0 1-1-1.7c0-1.3 1-2.3 2.5-3.8.8.8 2.5 2.5 2.5 3.8A2 2 0 0 1 8.5 12Z" />
    </svg>
  );
}

type BadgeTier = 'locked' | 'bronze' | 'silver' | 'gold';

const TIER_CONFIG: Record<BadgeTier, { stars: number; borderStyle: string; opacity: number }> = {
  locked: { stars: 0, borderStyle: '2px dashed var(--pf-t--global--border--color--default)', opacity: 0.5 },
  bronze: { stars: 1, borderStyle: '2px solid', opacity: 1 },
  silver: { stars: 2, borderStyle: '2px solid', opacity: 1 },
  gold: { stars: 3, borderStyle: '3px solid', opacity: 1 },
};

const TIER_COLORS: Record<Exclude<BadgeTier, 'locked'>, string> = {
  bronze: '#cd7f32',
  silver: '#a0a0a0',
  gold: '#c9b037',
};

type BadgeDef = {
  id: string;
  label: string;
  icon: React.ReactNode;
  tier: BadgeTier;
  description: string;
  nextTierHint: string;
  color: string;
};

function computeTier(value: number, thresholds: [number, number, number]): BadgeTier {
  if (value >= thresholds[2]) return 'gold';
  if (value >= thresholds[1]) return 'silver';
  if (value >= thresholds[0]) return 'bronze';
  return 'locked';
}

function tierColor(tier: BadgeTier, baseColor: string): string {
  if (tier === 'locked') return baseColor;
  return TIER_COLORS[tier];
}

function tierLabel(tier: BadgeTier): string {
  if (tier === 'locked') return 'Locked';
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

function nextThresholdLabel(
  tier: BadgeTier,
  labels: { bronze: string; silver: string; gold: string }
): string {
  if (tier === 'locked') return labels.bronze;
  if (tier === 'bronze') return labels.silver;
  return labels.gold;
}

function buildRunsBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  totalRuns: number
): BadgeDef {
  const tier = computeTier(totalRuns, [10000, 50000, 100000]);
  const thresholdLabels = { bronze: '10K', silver: '50K', gold: '100K' };

  let description: string;
  if (tier === 'gold') {
    description = t('Max tier! 100,000+ total automation runs.');
  } else {
    description = t('{{tier}} tier — {{current}} runs toward {{next}} goal.', {
      tier: tierLabel(tier),
      current: totalRuns.toLocaleString(),
      next: nextThresholdLabel(tier, thresholdLabels),
    });
  }

  let nextTierHint: string;
  if (tier === 'gold') {
    nextTierHint = t('Max tier achieved!');
  } else if (tier === 'silver') {
    nextTierHint = t('Reach 100,000 runs for Gold ({{current}} / 100,000).', { current: totalRuns.toLocaleString() });
  } else if (tier === 'bronze') {
    nextTierHint = t('Reach 50,000 runs for Silver ({{current}} / 50,000).', { current: totalRuns.toLocaleString() });
  } else {
    nextTierHint = t('Reach 10,000 total automation runs ({{current}} / 10,000).', { current: totalRuns.toLocaleString() });
  }

  return {
    id: '10k-club',
    label: t('10K Club'),
    icon: <TrophyIcon />,
    tier,
    description,
    nextTierHint,
    color: tierColor(tier, '#c9b037'),
  };
}

function buildStreakBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  streakLen: number
): BadgeDef {
  const tier = computeTier(streakLen, [7, 14, 30]);
  const thresholdLabels = { bronze: '7', silver: '14', gold: '30' };

  let description: string;
  if (tier === 'gold') {
    description = t('Max tier! 30+ day success streak.');
  } else {
    description = t('{{tier}} tier — {{count}}-day streak toward {{next}}-day goal.', {
      tier: tierLabel(tier),
      count: streakLen,
      next: nextThresholdLabel(tier, thresholdLabels),
    });
  }

  let nextTierHint: string;
  if (tier === 'gold') {
    nextTierHint = t('Max tier achieved!');
  } else if (tier === 'silver') {
    nextTierHint = t('Reach a 30-day streak for Gold (current: {{count}} days).', { count: streakLen });
  } else if (tier === 'bronze') {
    nextTierHint = t('Reach a 14-day streak for Silver (current: {{count}} days).', { count: streakLen });
  } else {
    nextTierHint = t('Maintain a 7-day success streak (current: {{count}} days).', { count: streakLen });
  }

  return {
    id: 'streak-master',
    label: t('Streak Master'),
    icon: <FlameIconSmall />,
    tier,
    description,
    nextTierHint,
    color: tierColor(tier, '#e65100'),
  };
}

function buildRisingStarBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  yourRank: number,
  isRisingStar: boolean
): BadgeDef {
  let tier: BadgeTier = 'locked';
  if (isRisingStar && yourRank <= 1) tier = 'gold';
  else if (isRisingStar && yourRank <= 3) tier = 'silver';
  else if (isRisingStar) tier = 'bronze';

  let description: string;
  if (tier === 'gold') {
    description = t('Max tier! #1 and trending up.');
  } else if (tier !== 'locked') {
    description = t('{{tier}} tier — trending up, ranked #{{rank}}.', {
      tier: tierLabel(tier),
      rank: yourRank,
    });
  } else {
    description = t('Your organization needs an upward trend in the leaderboard.');
  }

  let nextTierHint: string;
  if (tier === 'gold') {
    nextTierHint = t('Max tier achieved!');
  } else if (tier === 'silver') {
    nextTierHint = t('Reach #1 while trending up for Gold.');
  } else if (tier === 'bronze') {
    nextTierHint = t('Reach top 3 while trending up for Silver.');
  } else {
    nextTierHint = t('Your organization needs an upward trend to unlock.');
  }

  return {
    id: 'rising-star',
    label: t('Rising Star'),
    icon: <ArrowUpIcon />,
    tier,
    description,
    nextTierHint,
    color: tierColor(tier, '#1b5e20'),
  };
}

function buildFleetBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  orgPct: number
): BadgeDef {
  const tier = computeTier(orgPct, [50, 80, 100]);

  let description: string;
  if (tier === 'gold') {
    description = t('Max tier! 100% of organizations are actively automating.');
  } else {
    description = t('{{tier}} tier — {{pct}}% of organizations active.', {
      tier: tierLabel(tier),
      pct: orgPct,
    });
  }

  let nextTierHint: string;
  if (tier === 'gold') {
    nextTierHint = t('Max tier achieved!');
  } else if (tier === 'silver') {
    nextTierHint = t('Get 100% of organizations active for Gold ({{pct}}% currently).', { pct: orgPct });
  } else if (tier === 'bronze') {
    nextTierHint = t('Get 80% of organizations active for Silver ({{pct}}% currently).', { pct: orgPct });
  } else {
    nextTierHint = t('Get 50% of organizations actively automating ({{pct}}% currently).', { pct: orgPct });
  }

  return {
    id: 'full-fleet',
    label: t('Full Fleet'),
    icon: <CubesIcon />,
    tier,
    description,
    nextTierHint,
    color: tierColor(tier, '#0d47a1'),
  };
}

function buildAutomatorBadge(
  t: (s: string, opts?: Record<string, unknown>) => string,
  yourRank: number
): BadgeDef {
  let tier: BadgeTier = 'locked';
  if (yourRank <= 1) tier = 'gold';
  else if (yourRank <= 3) tier = 'silver';
  else if (yourRank <= 5) tier = 'bronze';

  let description: string;
  if (tier === 'gold') {
    description = t('Max tier! Your organization holds the #1 position.');
  } else if (tier !== 'locked') {
    description = t('{{tier}} tier — currently ranked #{{rank}}.', {
      tier: tierLabel(tier),
      rank: yourRank,
    });
  } else {
    description = t('Reach top 5 in the leaderboard to unlock.');
  }

  let nextTierHint: string;
  if (tier === 'gold') {
    nextTierHint = t('Max tier achieved!');
  } else if (tier === 'silver') {
    nextTierHint = t('Reach #1 for Gold (currently #{{rank}}).', { rank: yourRank });
  } else if (tier === 'bronze') {
    nextTierHint = t('Reach top 3 for Silver (currently #{{rank}}).', { rank: yourRank });
  } else {
    nextTierHint = t('Reach top 5 in the organization leaderboard (currently #{{rank}}).', { rank: yourRank });
  }

  return {
    id: 'top-automator',
    label: t('Top Automator'),
    icon: <StarIcon />,
    tier,
    description,
    nextTierHint,
    color: tierColor(tier, '#6a1b9a'),
  };
}

function computeBadges(t: (s: string, opts?: Record<string, unknown>) => string): BadgeDef[] {
  const totalRuns = QUARTERLY_GOAL.current;

  let streakLen = 0;
  for (let i = STREAK_HEAT_STRIP_DAYS.length - 1; i >= 0; i--) {
    if (!STREAK_HEAT_STRIP_DAYS[i].success) break;
    streakLen++;
  }

  const yourOrg = topOrganizations.find((o) => o.isYourOrg);
  const yourRank = yourOrg
    ? topOrganizations.indexOf(yourOrg) + 1
    : topOrganizations.length + 1;
  const isRisingStar = yourOrg?.trend === 'up';

  const orgPct =
    ORGANIZATIONS_TOTAL > 0
      ? Math.round((HIGHLIGHTS.organizationsActive / ORGANIZATIONS_TOTAL) * 100)
      : 0;

  return [
    buildRunsBadge(t, totalRuns),
    buildStreakBadge(t, streakLen),
    buildRisingStarBadge(t, yourRank, isRisingStar),
    buildFleetBadge(t, orgPct),
    buildAutomatorBadge(t, yourRank),
  ];
}

function TierStars({ count }: Readonly<{ count: number }>) {
  if (count === 0) return null;
  return (
    <span style={{ fontSize: 8, letterSpacing: 1, lineHeight: 1, display: 'block', marginTop: 2 }}>
      {'★'.repeat(count)}
    </span>
  );
}

function Badge({ badge }: Readonly<{ badge: BadgeDef }>) {
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
      {badge.tier !== 'gold' && (
        <>
          <br />
          <em>{badge.nextTierHint}</em>
        </>
      )}
    </>
  );

  return (
    <Tooltip content={tooltipContent} position="bottom">
      <div
        className={`achievement-badge ${isEarned ? 'achievement-badge--earned' : 'achievement-badge--locked'}`}
        style={{
          '--badge-color': badge.color,
          border: config.borderStyle,
          borderColor: isEarned ? badge.color : undefined,
          opacity: config.opacity,
        } as React.CSSProperties}
        aria-label={badge.label}
      >
        <span className="achievement-badge__icon">{badge.icon}</span>
        <TierStars count={config.stars} />
        <span className="achievement-badge__label">{badge.label}</span>
      </div>
    </Tooltip>
  );
}

export function AchievementBadges() {
  const { t } = useTranslation();
  const badges = useMemo(() => computeBadges(t), [t]);

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
    <div className="achievement-badges-grid">
      {badges.map((badge) => (
        <Badge key={badge.id} badge={badge} />
      ))}
    </div>
  );
}
