import { PostGaHelpPopover } from './PostGaHelpPopover';
import { Card, CardBody, CardHeader, Content, Title, Tooltip } from '@patternfly/react-core';
import {
  ArrowUpIcon,
  BoltIcon,
  CalendarWeekIcon,
  ChartLineIcon,
  CheckCircleIcon,
  CompassIcon,
  CrownIcon,
  RocketIcon,
  TrophyIcon,
} from '@patternfly/react-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import {
  MILESTONE_BADGES_EARNED_AT,
  MILESTONE_BADGES_EARNED_USER,
  ORG_BADGES_EARNED,
  ORG_BADGES_EARNED_AT,
  type MilestoneBadgeId,
  type OrgBadgeId,
} from './postGaMockData';

type BadgeConfig = {
  id: MilestoneBadgeId;
  label: string;
  rule: string;
  icon: React.ReactNode;
};

type OrgBadgeConfig = {
  id: OrgBadgeId;
  label: string;
  rule: string;
  icon: React.ReactNode;
};

function useMilestoneBadgeConfig(): BadgeConfig[] {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        id: 'ignition',
        label: t('Ignition'),
        rule: t('Ran your first successful job in the current 30-day window.'),
        icon: <BoltIcon />,
      },
      {
        id: 'weekWarrior',
        label: t('Week Warrior'),
        rule: t('Ran at least one successful job on 7 consecutive UTC calendar days.'),
        icon: <CalendarWeekIcon />,
      },
      {
        id: 'monthWarrior',
        label: t('Month Warrior'),
        rule: t('Ran at least one successful job on all 30 calendar days in the window.'),
        icon: <TrophyIcon />,
      },
      {
        id: 'explorer',
        label: t('Explorer'),
        rule: t('Ran jobs using 5 or more distinct templates in the window.'),
        icon: <CompassIcon />,
      },
      {
        id: 'centurion',
        label: t('Centurion'),
        rule: t('Ran 100 or more successful jobs in the window.'),
        icon: <ChartLineIcon />,
      },
      {
        id: 'reliable',
        label: t('Reliable'),
        rule: t('Ran 20 or more consecutive successful jobs with no failures in between.'),
        icon: <CheckCircleIcon />,
      },
      {
        id: 'accelerator',
        label: t('Accelerator'),
        rule: t('Ran more jobs in the second half of the 30-day window than the first half.'),
        icon: <RocketIcon />,
      },
    ],
    [t]
  );
}

function useOrgBadgeConfig(): OrgBadgeConfig[] {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        id: 'sustained' as OrgBadgeId,
        label: t('Sustained'),
        rule: t('14 or more consecutive org streak days in the current 30-day window.'),
        icon: <CalendarWeekIcon />,
      },
      {
        id: 'rising' as OrgBadgeId,
        label: t('Rising'),
        rule: t('More jobs in days 16–30 than days 1–15 of the window.'),
        icon: <ArrowUpIcon />,
      },
      {
        id: 'topTier' as OrgBadgeId,
        label: t('Top Tier'),
        rule: t('Org ranked #1, #2, or #3 at any sync point in the window.'),
        icon: <CrownIcon />,
      },
    ],
    [t]
  );
}

function sortEarnedFirst(
  badges: BadgeConfig[],
  earnedIds: readonly MilestoneBadgeId[]
): BadgeConfig[] {
  const earnedSet = new Set(earnedIds);
  return badges
    .map((badge, index) => ({ badge, index }))
    .sort((a, b) => {
      const aEarned = earnedSet.has(a.badge.id);
      const bEarned = earnedSet.has(b.badge.id);
      if (aEarned !== bEarned) return aEarned ? -1 : 1;
      return a.index - b.index;
    })
    .map(({ badge }) => badge);
}

function formatEarnedDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function badgeTooltipContent({
  label,
  rule,
  earnedAt,
  t,
}: Readonly<{
  label: string;
  rule: string;
  earnedAt?: string;
  t: (key: string, options?: Record<string, unknown>) => string;
}>) {
  return (
    <>
      <strong>{label}</strong>
      <br />
      {rule}
      {earnedAt ? (
        <>
          <br />
          {t('Earned {{date}}', { date: formatEarnedDate(earnedAt) })}
        </>
      ) : null}
    </>
  );
}

function MilestoneBadge({
  badge,
  earned,
  earnedAt,
}: Readonly<{
  badge: BadgeConfig;
  earned: boolean;
  earnedAt?: string;
}>) {
  const { t } = useTranslation();

  return (
    <Tooltip
      content={badgeTooltipContent({
        label: badge.label,
        rule: badge.rule,
        earnedAt: earned ? earnedAt : undefined,
        t,
      })}
      position="bottom"
    >
      <div
        className={
          earned
            ? 'achievement-badge achievement-badge--earned achievement-badge--milestone'
            : 'achievement-badge achievement-badge--locked achievement-badge--milestone'
        }
        aria-label={badge.label}
      >
        <span className="achievement-badge__stars" aria-hidden />
        <span className="achievement-badge__icon">{badge.icon}</span>
        <span className="achievement-badge__label">{badge.label}</span>
      </div>
    </Tooltip>
  );
}

function MilestoneBadgeGrid({
  badges,
  earnedIds,
  earnedAtById,
}: Readonly<{
  badges: BadgeConfig[];
  earnedIds: readonly MilestoneBadgeId[];
  earnedAtById: Partial<Record<MilestoneBadgeId, string>>;
}>) {
  const earnedSet = useMemo(() => new Set(earnedIds), [earnedIds]);
  const sortedBadges = useMemo(() => sortEarnedFirst(badges, earnedIds), [badges, earnedIds]);

  return (
    <div className="achievement-badges-grid--milestone">
      {sortedBadges.map((badge) => (
        <MilestoneBadge
          key={badge.id}
          badge={badge}
          earned={earnedSet.has(badge.id)}
          earnedAt={earnedAtById[badge.id]}
        />
      ))}
    </div>
  );
}

function OrgBadgeGrid({
  badges,
  earnedIds,
  earnedAtById,
}: Readonly<{
  badges: OrgBadgeConfig[];
  earnedIds: readonly OrgBadgeId[];
  earnedAtById: Partial<Record<OrgBadgeId, string>>;
}>) {
  const { t } = useTranslation();
  const earnedSet = useMemo(() => new Set(earnedIds), [earnedIds]);

  return (
    <div className="achievement-badges-grid--milestone">
      {badges.map((badge) => {
        const earned = earnedSet.has(badge.id);
        return (
          <Tooltip
            key={badge.id}
            content={badgeTooltipContent({
              label: badge.label,
              rule: badge.rule,
              earnedAt: earned ? earnedAtById[badge.id] : undefined,
              t,
            })}
            position="bottom"
          >
            <div
              className={
                earned
                  ? 'achievement-badge achievement-badge--earned achievement-badge--milestone'
                  : 'achievement-badge achievement-badge--locked achievement-badge--milestone'
              }
              aria-label={badge.label}
            >
              <span className="achievement-badge__stars" aria-hidden />
              <span className="achievement-badge__icon">{badge.icon}</span>
              <span className="achievement-badge__label">{badge.label}</span>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}

function BadgeShelf({
  title,
  help,
  earnedIds,
  badges,
  earnedAtById,
}: Readonly<{
  title: string;
  help: string;
  earnedIds: readonly MilestoneBadgeId[];
  badges: BadgeConfig[];
  earnedAtById: Partial<Record<MilestoneBadgeId, string>>;
}>) {
  return (
    <div>
      <DashboardSectionHeading title={title} help={help} />
      <MilestoneBadgeGrid badges={badges} earnedIds={earnedIds} earnedAtById={earnedAtById} />
    </div>
  );
}

export function MilestoneBadgesCard() {
  const { t } = useTranslation();
  const badges = useMilestoneBadgeConfig();
  const orgBadges = useOrgBadgeConfig();

  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <CardHeader>
        <div>
          <div style={{ whiteSpace: 'nowrap' }}>
            <Title
              headingLevel="h3"
              size="xl"
              style={{ display: 'inline-block', verticalAlign: '-0.15em', lineHeight: 1.2 }}
            >
              {t('30-day achievements')}
            </Title>
            <PostGaHelpPopover
              title={t('30-day achievements')}
              help={t(
                'Recognitions earned during the period. Achievements reset when the window rolls — re-earn them each period. Earned achievements appear first.'
              )}
            />
          </div>
          <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
            {t('Achievements reset when the period rolls.')}
          </Content>
        </div>
      </CardHeader>
      <CardBody
        style={{
          padding: 'var(--pf-t--global--spacer--md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pf-t--global--spacer--md)',
        }}
      >
        <BadgeShelf
          title={t('Your achievements')}
          help={t('Achievements you earned.')}
          earnedIds={MILESTONE_BADGES_EARNED_USER}
          badges={badges}
          earnedAtById={MILESTONE_BADGES_EARNED_AT}
        />
        <div>
          <DashboardSectionHeading
            title={t("Your org's achievements")}
            help={t(
              'Achievements any of the organizations you belong to earned. Visible to all members of your org.'
            )}
          />
          <OrgBadgeGrid
            badges={orgBadges}
            earnedIds={ORG_BADGES_EARNED}
            earnedAtById={ORG_BADGES_EARNED_AT}
          />
        </div>
      </CardBody>
    </Card>
  );
}
