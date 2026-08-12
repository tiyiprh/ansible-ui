import { Flex, FlexItem, Label, Tooltip } from '@patternfly/react-core';
import { FireIcon } from '@patternfly/react-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { MetricLabel } from './DashboardMetricText';
import { computeStreakLength } from './postGaHighlightsFilterUtils';
import { STREAK_HEAT_STRIP_DAYS, STREAK_PERIOD_DAYS } from './postGaMockData';

export function SuccessStreakStrip() {
  const { t } = useTranslation();

  const currentStreak = useMemo(
    () => computeStreakLength(STREAK_HEAT_STRIP_DAYS),
    []
  );

  return (
    <div className="post-ga-at-a-glance-streak">
      <Flex
        alignItems={{ default: 'alignItemsCenter' }}
        gap={{ default: 'gapSm' }}
        flexWrap={{ default: 'wrap' }}
      >
        <FlexItem>
          <DashboardSectionHeading
            title={t('Success streak')}
            help={t(
              'Shows whether you had at least one successful job run each day over the last 30 days. Green means at least one successful job run that day. Gray means no successful job runs.'
            )}
          />
        </FlexItem>
        {currentStreak > 0 && (
          <FlexItem>
            <Label color="orange" isCompact icon={<FireIcon />}>
              {t('{{count}}-day streak', { count: currentStreak })}
            </Label>
          </FlexItem>
        )}
      </Flex>
      <MetricLabel>{t('Last {{days}} days', { days: STREAK_PERIOD_DAYS })}</MetricLabel>
      <Flex
        gap={{ default: 'gapXs' }}
        flexWrap={{ default: 'wrap' }}
        className="post-ga-at-a-glance-streak-cells"
      >
        {STREAK_HEAT_STRIP_DAYS.map((day) => (
          <Tooltip
            key={day.dateStr}
            content={
              <>
                <strong>{day.dateStr}</strong>
                <br />
                {day.success
                  ? t('{{count}} successful job run(s)', { count: day.runs })
                  : t('No successful job runs')}
              </>
            }
            position="top"
          >
            <div
              className={
                day.success
                  ? 'streak-heat-cell streak-heat-cell--success'
                  : 'streak-heat-cell streak-heat-cell--empty'
              }
              aria-label={
                day.success
                  ? `${day.dateStr}: ${day.runs} job runs`
                  : `${day.dateStr}: No job runs`
              }
            />
          </Tooltip>
        ))}
      </Flex>
    </div>
  );
}
