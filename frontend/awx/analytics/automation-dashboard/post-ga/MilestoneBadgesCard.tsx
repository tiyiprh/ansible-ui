import { Help } from '@ansible/ansible-ui-framework/components/Help';
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
  MILESTONE_BADGES_EARNED_USER,
  ORG_BADGES_EARNED,
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

function MilestoneBadge({
  badge,
  earned,
}: Readonly<{
  badge: BadgeConfig;
  earned: boolean;
}>) {
  const tooltipContent = (
    <>
      <strong>{badge.label}</strong>
      <br />
      {badge.rule}
    </>
  );

  return (
    <Tooltip content={tooltipContent} position="bottom">
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
}: Readonly<{
  badges: BadgeConfig[];
  earnedIds: readonly MilestoneBadgeId[];
}>) {
  const earnedSet = useMemo(() => new Set(earnedIds), [earnedIds]);
  const sortedBadges = useMemo(() => sortEarnedFirst(badges, earnedIds), [badges, earnedIds]);

  return (
    <div className="achievement-badges-grid--milestone">
      {sortedBadges.map((badge) => (
        <MilestoneBadge key={badge.id} badge={badge} earned={earnedSet.has(badge.id)} />
      ))}
    </div>
  );
}

function OrgBadgeGrid({
  badges,
  earnedIds,
}: Readonly<{
  badges: OrgBadgeConfig[];
  earnedIds: readonly OrgBadgeId[];
}>) {
  const earnedSet = useMemo(() => new Set(earnedIds), [earnedIds]);

  return (
    <div className="achievement-badges-grid--milestone">
      {badges.map((badge) => {
        const earned = earnedSet.has(badge.id);
        const tooltipContent = (
          <>
            <strong>{badge.label}</strong>
            <br />
            {badge.rule}
          </>
        );
        return (
          <Tooltip key={badge.id} content={tooltipContent} position="bottom">
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
}: Readonly<{
  title: string;
  help: string;
  earnedIds: readonly MilestoneBadgeId[];
  badges: BadgeConfig[];
}>) {
  return (
    <div>
      <DashboardSectionHeading title={title} help={help} />
      <MilestoneBadgeGrid badges={badges} earnedIds={earnedIds} />
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
            <Help
              title={t('30-day achievements')}
              help={t(
                'Recognitions earned in the current 30-day window. Achievements reset when the window rolls — re-earn them each period. Earned achievements appear first.'
              )}
            />
          </div>
          <Content component="small" style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
            {t('These achievements reset every 30 days.')}
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
          help={t('Achievements you earned in the current 30-day window.')}
          earnedIds={MILESTONE_BADGES_EARNED_USER}
          badges={badges}
        />
        <div>
          <DashboardSectionHeading
            title={t("Your org's achievements")}
            help={t(
              'Achievements your organization earned in the current 30-day window. Visible to all members of your org.'
            )}
          />
          <OrgBadgeGrid badges={orgBadges} earnedIds={ORG_BADGES_EARNED} />
        </div>
      </CardBody>
    </Card>
  );
}
