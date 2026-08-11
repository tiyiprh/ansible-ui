import { ChatbotSideBar } from '@ansible/chatbot/ChatbotSideBar';
import { Page } from '@patternfly/react-core';
import { ReactNode, useLayoutEffect, useMemo } from 'react';
import { Route, RouteObject, Routes } from 'react-router-dom';
import { PageContentOutlet } from './PageContentOutlet';
import { PageNotFound } from '../PageEmptyStates/PageNotFound';
import { PageNavigation } from '../PageNavigation/PageNavigation';
import { PageNavigationItem } from '../PageNavigation/PageNavigationItem';
import { usePageNavigationRoutesContext } from '../PageNavigation/PageNavigationRoutesProvider';
import { PageNotificationsDrawer } from '../PageNotifications/PageNotificationsDrawer';
import { usePageNotifications } from '../PageNotifications/usePageNotifications';

export function PageApp(props: {
  /** Component for the masthead of the page. */
  masthead?: ReactNode;

  /** The navigation items for the page. */
  navigation: PageNavigationItem[];

  /**
   * The basename of the app for situations where you can't deploy to the root of the domain, but a sub directory.
   *
   * SEE: https://reactrouter.com/en/main/routers/create-browser-router#basename
   */
  basename?: string;

  banner?: ReactNode;

  contextSwitcher?: ReactNode;
}) {
  const { navigation, masthead } = props;
  const { notificationsDrawerOpen } = usePageNotifications();

  const navigationItems = useMemo(
    () => [
      {
        path: props.basename ?? '/',
        element: (
          <ChatbotSideBar>
            <Page
              masthead={masthead}
              sidebar={
                <PageNavigation
                  navigation={navigation}
                  basename={props.basename}
                  contextSwitcher={props.contextSwitcher}
                />
              }
              notificationDrawer={<PageNotificationsDrawer />}
              isNotificationDrawerExpanded={notificationsDrawerOpen}
              isContentFilled
            >
              {props.banner}
              <PageContentOutlet />
            </Page>
          </ChatbotSideBar>
        ),
        children: navigation.filter(({ href }) => !href),
      },
      { path: '*', element: <PageNotFound /> },
    ],
    [
      masthead,
      navigation,
      notificationsDrawerOpen,
      props.banner,
      props.basename,
      props.contextSwitcher,
    ]
  );
  const [_, setNavigation] = usePageNavigationRoutesContext();
  useLayoutEffect(() => {
    setNavigation(navigation);
  }, [navigation, setNavigation]);

  return <Routes>{navigationItems.map(NavigationRoute)}</Routes>;
}

function NavigationRoute(route: RouteObject) {
  return (
    <Route key={route.path} path={route.path} element={route.element}>
      {route.children?.map(NavigationRoute)}
    </Route>
  );
}
