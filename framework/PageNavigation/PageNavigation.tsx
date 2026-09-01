import {
  Flex,
  FlexItem,
  Label,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  PageSidebar,
  PageSidebarBody,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useState, type CSSProperties } from 'react';
import { useMatch } from 'react-router-dom';
import { usePageNavBarClick, usePageNavSideBar } from './PageNavSidebar';
import { useBreakpoint } from '../components/useBreakPoint';
import { useGetPageUrl } from './useGetPageUrl';
import { PageNavigationItem } from './PageNavigationItem';

function buildNavPath(baseRoute: string, path: string): string {
  let navPath = `${baseRoute}/${path}`.replace(/\/+/g, '/');
  if (!navPath.startsWith('/')) {
    navPath = `/${navPath}`;
  }
  return navPath;
}

/** When a route has a default tab child (e.g. post-ga/dashboard), link to that tab directly. */
function getDefaultTabDestination(
  item: PageNavigationItem,
  getPageUrl: (id: string) => string
): string | undefined {
  if (!('children' in item) || !item.children?.length) {
    return undefined;
  }
  const defaultTab = item.children.find(
    (child) => 'id' in child && typeof child.id === 'string' && child.path === 'dashboard'
  );
  if (defaultTab && 'id' in defaultTab && typeof defaultTab.id === 'string') {
    const tabUrl = getPageUrl(defaultTab.id);
    if (tabUrl) {
      return tabUrl;
    }
  }
  return undefined;
}

/** Renders a sidebar navigation menu from an arroy of navigation items. */
export function PageNavigation(props: {
  navigation: PageNavigationItem[];
  basename?: string;
  contextSwitcher?: React.ReactNode;
}) {
  const { navigation: navigationItems } = props;
  const navBar = usePageNavSideBar();

  return (
    <PageSidebar isSidebarOpen={navBar.isOpen}>
      <PageSidebarBody>
        {props.contextSwitcher}
        <Nav data-cy="page-navigation" data-testid="page-navigation" className="side-nav">
          <NavList>
            <PageNavigationItems baseRoute={props.basename ?? ''} items={navigationItems} />
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );
}

function PageNavigationItems(props: { items: PageNavigationItem[]; baseRoute: string }) {
  return (
    <>
      {props.items
        .filter((item) => {
          if ('hidden' in item) {
            return item.hidden !== true;
          }
          return true;
        })
        .map((item, index) => (
          <PageNavigationItemComponent
            key={item.id ?? item.label ?? index}
            item={item}
            baseRoute={props.baseRoute}
          />
        ))}
    </>
  );
}

function PageNavigationItemComponent(props: { item: PageNavigationItem; baseRoute: string }) {
  const { item } = props;
  const isXl = useBreakpoint('xl');
  const navBar = usePageNavSideBar();
  const onClickNavItem = usePageNavBarClick();
  const getPageUrl = useGetPageUrl();
  const [isExpanded, setIsExpanded] = useState(
    () =>
      localStorage.getItem('default-nav-expanded') === 'true' ||
      localStorage.getItem((item.id ?? item.label) + '-expanded') === 'true'
  );
  const setExpanded = (expanded: boolean) => {
    setIsExpanded(expanded);
    localStorage.setItem((item.id ?? item.label) + '-expanded', expanded ? 'true' : 'false');
  };

  let id: string | undefined;
  if ('id' in props.item) {
    id = props.item.id;
  } else if ('children' in props.item) {
    const rootChild = props.item.children.find((child) => child.path === '');
    if (rootChild && 'id' in rootChild) {
      id = rootChild.id;
    }
  }
  if (!id) {
    id = props.item.label?.split(' ').join('-').toLowerCase();
  }

  const navPath = buildNavPath(props.baseRoute, item.path);
  const defaultTabDestination = getDefaultTabDestination(item, getPageUrl);
  const destination =
    defaultTabDestination ??
    ('id' in item && typeof item.id === 'string' && getPageUrl(item.id) ? getPageUrl(item.id) : navPath);

  // Default-tab parents (e.g. post-ga → dashboard) should stay active on sibling tabs (leaderboards).
  const activeMatchPath = defaultTabDestination ? navPath : destination;
  const isActive = !!useMatch(activeMatchPath + '/*');

  if (item.path === '/' && 'children' in item) {
    return <PageNavigationItems items={item.children} baseRoute={''} />;
  }

  const hasChildNavItems = 'children' in item && item.children?.find((child) => child.label);
  const subtitleStyle: CSSProperties = { fontSize: 'small', opacity: 0.5, textAlign: 'left' };

  if (!hasChildNavItems && 'label' in item) {
    if (item.href) {
      return (
        <NavItem
          id={id}
          href={item.href}
          isActive={isActive}
          onClick={() => window.open(item.href, '_blank')}
          target="_blank"
          data-cy={id}
          data-testid={id}
          style={{ display: 'flex', alignItems: 'stretch', flexDirection: 'column' }}
        >
          <Flex flexWrap={{ default: 'nowrap' }}>
            <FlexItem grow={{ default: 'grow' }}>{item.label}</FlexItem>
            <FlexItem>
              <span className="pf-v6-c-nav__toggle">
                <span className="pf-v6-c-nav__toggle-icon">
                  <ExternalLinkAltIcon />
                </span>
              </span>
            </FlexItem>
          </Flex>
          {item.subtitle && <div style={subtitleStyle}>{item.subtitle}</div>}
        </NavItem>
      );
    }

    return (
      <NavItem
        id={id}
        href={destination}
        isActive={isActive}
        onClick={(event) => {
          event.preventDefault();
          onClickNavItem(destination);
          if (!isXl) navBar.setState({ isOpen: !navBar.isOpen });
        }}
        data-cy={id}
        data-testid={id}
        style={{ display: 'flex', alignItems: 'stretch', flexDirection: 'column' }}
      >
        <Flex flexWrap={{ default: 'nowrap' }}>
          <FlexItem grow={{ default: 'grow' }}>{item.label}</FlexItem>
          {'badge' in item && item.badge && (
            <FlexItem>
              <Label isCompact variant="outline" color={item.badgeColor}>
                {item.badge}
              </Label>
            </FlexItem>
          )}
        </Flex>
        {item.subtitle && <div style={subtitleStyle}>{item.subtitle}</div>}
      </NavItem>
    );
  }

  if (!hasChildNavItems || item.label === undefined) {
    return null;
  }

  if (!item.label) {
    return <PageNavigationItems items={item.children} baseRoute={navPath} />;
  }

  return (
    <NavExpandable
      buttonProps={{ id }}
      isActive={isActive}
      title={
        (
          <div>
            <div style={{ textAlign: 'left' }}>{item.label}</div>
            {item.subtitle && <div style={subtitleStyle}>{item.subtitle}</div>}
          </div>
        ) as unknown as string
      }
      isExpanded={isExpanded}
      onExpand={(_e, expanded: boolean) => setExpanded(expanded)}
    >
      <PageNavigationItems items={item.children} baseRoute={navPath} />
    </NavExpandable>
  );
}
