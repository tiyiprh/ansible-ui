import { PageHeader, PageLayout } from '@ansible/ansible-ui-framework';
import { PageRoutedTabs } from '@ansible/common-ui/PageRoutedTabs';
import { useTranslation } from 'react-i18next';
import { AwxRoute } from '../../main/AwxRoutes';
import { useAutomationDashboardCollectionStatus } from './common/useAutomationDashboardCollectionStatus';
import { LoadingState } from '@ansible/ansible-ui-framework/components/LoadingState';
import { Scrollable } from '@ansible/ansible-ui-framework/components/Scrollable';
import { GoalsPreviewControl } from './post-ga/GoalsPreviewControl';
import './post-ga/postGa.css';

export function AutomationDashboardPostGA() {
  const { t } = useTranslation();
  const description = t(
    'Discover the significant cost and time savings achieved by automating Ansible jobs with the Ansible Automation Platform. Explore how automation reduces manual effort, enhances efficiency, and optimizes IT operations across your organization.'
  );
  const { isLoading } = useAutomationDashboardCollectionStatus();

  return (
    <PageLayout>
      {!isLoading && (
        <PageHeader
          title={t('Automation Dashboard')}
          titleHelpTitle={t('Automation Dashboard')}
          titleHelp={description}
          titleHeadingLevel="h2"
          headerActions={<GoalsPreviewControl />}
        />
      )}

      {!isLoading && (
        <PageRoutedTabs
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
      )}

      {isLoading && (
        <Scrollable marginLeft={20} marginRight={20} marginBottom={16} marginTop={16}>
          <LoadingState />
        </Scrollable>
      )}
    </PageLayout>
  );
}
