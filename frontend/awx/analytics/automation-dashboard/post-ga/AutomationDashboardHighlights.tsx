import {
  Alert,
  AlertActionCloseButton,
  EmptyState,
  EmptyStateBody,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { AutomationDimensionsCard } from './AutomationDimensionsCard';
import { AutomationStreakCard } from './AutomationStreakCard';
import { HighlightsAtAGlanceKpiCards } from './HighlightsAtAGlanceCard';
import {
  getGoalsPreviewMode,
  subscribeDashboardSettings,
} from './dashboardSettingsUtils';
import { HighlightsLeaderboardPanel } from './HighlightsLeaderboardPanel';
import { HighlightsPageIntro } from './HighlightsPageIntro';
import { MilestoneBadgesCard } from './MilestoneBadgesCard';
import './postGa.css';

/**
 * ANSTRAT-1976 Highlights tab — section order matches Gamification Rules §1–§5.
 */
export function AutomationDashboardHighlights() {
  const { t } = useTranslation();
  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );
  const [alertDismissed, setAlertDismissed] = useState(false);

  if (previewMode === 'day0') {
    return (
      <div className="post-ga-highlights-tab">
        <EmptyState
          headingLevel="h4"
          icon={CubesIcon}
          titleText={t('No leaderboard data yet')}
          variant="lg"
        >
          <EmptyStateBody>
            {t(
              'Leaderboard data will appear here once job runs have been recorded. Check back after your first automation run.'
            )}
          </EmptyStateBody>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="post-ga-highlights-tab">
      {previewMode === 'achievementUnlocked' && !alertDismissed ? (
        <Alert
          variant="success"
          isInline
          title={t('Congratulations! You unlocked the Centurion achievement — ran 100 or more successful jobs in the current 30-day window.')}
          actionClose={<AlertActionCloseButton onClose={() => setAlertDismissed(true)} />}
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <HighlightsPageIntro />
      <HighlightsAtAGlanceKpiCards />
      <AutomationStreakCard />
      <AutomationDimensionsCard />
      <Grid hasGutter style={{ marginBottom: 24 }}>
        <GridItem md={6}>
          <HighlightsLeaderboardPanel />
        </GridItem>
        <GridItem md={6}>
          <MilestoneBadgesCard />
        </GridItem>
      </Grid>
    </div>
  );
}

/** @deprecated Use AutomationDashboardHighlights */
export const AutomationDashboardGamificationHighlights = AutomationDashboardHighlights;
