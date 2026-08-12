import { useGetPageUrl } from '@ansible/ansible-ui-framework';
import { usePageBreadcrumbs } from '@ansible/ansible-ui-framework/PageTabs/PageBreadcrumbs';
import { PageSection, Tab, TabProps, Tabs, Tooltip } from '@patternfly/react-core';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AutomationDashboardPostGADashboardTab } from './AutomationDashboardPostGADashboardTab';
import { AutomationDashboardPostGAGamificationTab } from './AutomationDashboardPostGAGamificationTab';
import { AutomationDashboardPostGALeaderboardsTab } from './AutomationDashboardPostGALeaderboardsTab';
import { AwxRoute } from '../../../main/AwxRoutes';

const POST_GA_BASE_PATH = '/analytics/automation-dashboard/post-ga';

const POST_GA_TAB_SEGMENTS: Record<string, string> = {
  [AwxRoute.AutomationDashboardPostGADashboard]: 'dashboard',
  [AwxRoute.AutomationDashboardPostGALeaderboards]: 'highlights',
  [AwxRoute.AutomationDashboardPostGAGamification]: 'gamification',
};

function resolveActivePage(pathname: string): string {
  if (!pathname.includes(POST_GA_BASE_PATH)) {
    return AwxRoute.AutomationDashboardPostGADashboard;
  }
  if (pathname.includes('/gamification')) {
    return AwxRoute.AutomationDashboardPostGAGamification;
  }
  if (pathname.includes('/leaderboards') || pathname.includes('/highlights')) {
    return AwxRoute.AutomationDashboardPostGALeaderboards;
  }
  return AwxRoute.AutomationDashboardPostGADashboard;
}

function PostGATabContent({ activePage }: Readonly<{ activePage: string }>) {
  switch (activePage) {
    case AwxRoute.AutomationDashboardPostGAGamification:
      return <AutomationDashboardPostGAGamificationTab key="gamification" />;
    case AwxRoute.AutomationDashboardPostGALeaderboards:
      return <AutomationDashboardPostGALeaderboardsTab key="leaderboards" />;
    case AwxRoute.AutomationDashboardPostGADashboard:
      return <AutomationDashboardPostGADashboardTab key="dashboard" />;
    default:
      return <AutomationDashboardPostGADashboardTab key="dashboard" />;
  }
}

/**
 * Post-GA tab shell — active tab follows the URL; tab clicks navigate via page route ids.
 */
export function PostGAPageRoutedTabs(props: Readonly<{
  tabs: { label: string; page: string; dataCy?: string; tooltip?: string }[];
}>) {
  const navigate = useNavigate();
  const getPageUrl = useGetPageUrl();
  const location = useLocation();
  const { setTabBreadcrumb } = usePageBreadcrumbs();

  const activePage = useMemo(() => resolveActivePage(location.pathname), [location.pathname]);

  const navigateToTab = useCallback(
    (pageId: string) => {
      const url = getPageUrl(pageId);
      if (url) {
        void navigate(url);
        return;
      }
      const segment = POST_GA_TAB_SEGMENTS[pageId];
      if (segment) {
        void navigate(`${POST_GA_BASE_PATH}/${segment}`);
      }
    },
    [getPageUrl, navigate]
  );

  const activeTab = useMemo(
    () =>
      props.tabs.find((tab) => tab.page === activePage) ??
      props.tabs.find((tab) => {
        const tabUrl = getPageUrl(tab.page);
        return (
          tabUrl &&
          (location.pathname === tabUrl || location.pathname.endsWith(tabUrl))
        );
      }),
    [activePage, getPageUrl, location.pathname, props.tabs]
  );

  useEffect(() => {
    if (activeTab) {
      setTabBreadcrumb({ label: activeTab.label });
      return () => setTabBreadcrumb(undefined);
    }
    setTabBreadcrumb(undefined);
  }, [activeTab, setTabBreadcrumb]);

  const onSelect = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    eventKey: number | string
  ) => {
    event.preventDefault();
    navigateToTab(eventKey.toString());
  };

  const tabs = props.tabs.map((tab) => (
    <Tab
      key={tab.page}
      eventKey={tab.page}
      title={tab.label}
      tooltip={tab.tooltip ? <Tooltip content={tab.tooltip} /> : undefined}
      data-cy={tab.dataCy}
      data-testid={tab.dataCy}
    />
  )) as unknown as TabsChild;

  return (
    <>
      <PageSection style={{ padding: 0 }}>
        <Tabs
          onSelect={onSelect}
          inset={{ default: 'insetSm' }}
          activeKey={activePage}
        >
          {tabs}
        </Tabs>
      </PageSection>
      <PostGATabContent activePage={activePage} />
    </>
  );
}

type TabElement = React.ReactElement<TabProps, React.JSXElementConstructor<TabProps>>;
type TabsChild = TabElement | boolean | null | undefined;
