import { PageHeader, PageLayout } from '@ansible/ansible-ui-framework';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAutomationDashboardCollectionStatus } from './common/useAutomationDashboardCollectionStatus';
import { PostGADashboardFilterProvider } from './post-ga/PostGADashboardFilterContext';
import { PostGAPageRoutedTabs } from './post-ga/PostGAPageRoutedTabs';
import { AutomationDashboardPostGAHighlightsTab } from './post-ga/AutomationDashboardPostGAHighlightsTab';
import {
  getGoalsPreviewMode,
  subscribeDashboardSettings,
} from './post-ga/dashboardSettingsUtils';
import { AwxRoute } from '../../main/AwxRoutes';
import './post-ga/postGa.css';

const POST_GA_BASE_PATH = '/analytics/automation-dashboard/post-ga';

export function AutomationDashboardPostGA() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const description = t(
    'View automation performance, goals, and cost savings for your organization.'
  );
  const { isLoading } = useAutomationDashboardCollectionStatus();
  const previewMode = useSyncExternalStore(
    subscribeDashboardSettings,
    getGoalsPreviewMode,
    getGoalsPreviewMode
  );

  if (!pathname.includes(POST_GA_BASE_PATH)) {
    return null;
  }

  if (previewMode === 'normalUser') {
    return (
      <PostGADashboardFilterProvider>
        <PageLayout>
          {!isLoading && (
            <PageHeader
              title={t('Automation Dashboard')}
              titleHelpTitle={t('Automation Dashboard')}
              titleHelp={description}
              titleHeadingLevel="h2"
            />
          )}
          <AutomationDashboardPostGAHighlightsTab />
        </PageLayout>
      </PostGADashboardFilterProvider>
    );
  }

  return (
    <PostGADashboardFilterProvider>
      <PageLayout>
        {!isLoading && (
          <PageHeader
            title={t('Automation Dashboard')}
            titleHelpTitle={t('Automation Dashboard')}
            titleHelp={description}
            titleHeadingLevel="h2"
          />
        )}

        <PostGAPageRoutedTabs
          tabs={[
            {
              label: t('Dashboard'),
              page: AwxRoute.AutomationDashboardPostGADashboard,
              dataCy: 'post-ga-dashboard-tab',
            },
            {
              label: t('Leaderboards'),
              page: AwxRoute.AutomationDashboardPostGALeaderboards,
              dataCy: 'post-ga-leaderboards-tab',
            },
          ]}
        />
      </PageLayout>
    </PostGADashboardFilterProvider>
  );
}
