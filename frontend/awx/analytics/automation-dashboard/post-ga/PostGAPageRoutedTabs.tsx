import { useGetPageUrl } from '@ansible/ansible-ui-framework';
import { usePageBreadcrumbs } from '@ansible/ansible-ui-framework/PageTabs/PageBreadcrumbs';
import { PageSection, Tab, TabProps, Tabs } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AutomationDashboardPostGADashboardTab } from './AutomationDashboardPostGADashboardTab';
import { AutomationDashboardPostGALeaderboardsTab } from './AutomationDashboardPostGALeaderboardsTab';
import { AwxRoute } from '../../../main/AwxRoutes';

const POST_GA_BASE_PATH = '/analytics/automation-dashboard/post-ga';

function resolveActivePage(pathname: string): string | null {
  if (!pathname.includes(POST_GA_BASE_PATH)) {
    return null;
  }
  if (pathname.includes('/highlights') || pathname.includes('/leaderboards')) {
    return AwxRoute.AutomationDashboardPostGALeaderboards;
  }
  return AwxRoute.AutomationDashboardPostGADashboard;
}

/**
 * Post-GA tab shell — keeps a local active tab in sync with the URL, and updates
 * both immediately on tab click so content swaps even if router location lags.
 */
export function PostGAPageRoutedTabs(props: Readonly<{
  tabs: { label: string; page: string; dataCy?: string }[];
}>) {
  const navigate = useNavigate();
  const getPageUrl = useGetPageUrl();
  const location = useLocation();
  const { setTabBreadcrumb } = usePageBreadcrumbs();
  const [activePage, setActivePage] = useState<string | null>(() =>
    resolveActivePage(location.pathname)
  );

  useEffect(() => {
    setActivePage(resolveActivePage(location.pathname));
  }, [location.pathname]);

  const activeTab =
    activePage === null
      ? undefined
      : (props.tabs.find((tab) => tab.page === activePage) ??
        props.tabs.find(
          (tab) =>
            getPageUrl(tab.page) === location.pathname ||
            location.pathname.endsWith(getPageUrl(tab.page))
        ));

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
    const pageId = eventKey.toString();
    setActivePage(pageId);
    const url = getPageUrl(pageId);
    if (url) {
      void navigate(url);
    }
  };

  if (!activePage) {
    return null;
  }

  const tabs = props.tabs.map((tab) => (
    <Tab
      key={tab.page}
      eventKey={tab.page}
      title={tab.label}
      data-cy={tab.dataCy}
      data-testid={tab.dataCy}
    />
  )) as unknown as TabsChild;

  const isHighlights = activePage === AwxRoute.AutomationDashboardPostGALeaderboards;

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
      {isHighlights ? (
        <AutomationDashboardPostGALeaderboardsTab key="highlights" />
      ) : (
        <AutomationDashboardPostGADashboardTab key="dashboard" />
      )}
    </>
  );
}

type TabElement = React.ReactElement<TabProps, React.JSXElementConstructor<TabProps>>;
type TabsChild = TabElement | boolean | null | undefined;
