import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  MenuToggle,
  PageSection,
  Popover,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { CSSProperties, Fragment, ReactNode, useMemo, useState, useSyncExternalStore } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PageFramework.css';
import { usePageBreadcrumbs } from './PageTabs/PageBreadcrumbs';
import { useBreakpoint } from './components/useBreakPoint';
import { useFrameworkTranslations } from './useFrameworkTranslations';
import { usePageTitle } from './PageTitle/PageTitle';

export interface ICatalogBreadcrumb {
  id?: string;
  label?: string | null;
  to?: string;
  target?: string;
  component?: React.ElementType;
  isLoading?: boolean;
}

function BreadcrumbLink(props: { breadcrumb: ICatalogBreadcrumb }) {
  const navigate = useNavigate();
  const { breadcrumb } = props;
  if (!breadcrumb.to) return <>{breadcrumb.label}</>;
  return (
    <a
      href={breadcrumb.to}
      data-cy={breadcrumb.label ?? undefined}
      data-testid={breadcrumb.label ?? undefined}
      onClick={(e) => {
        e.preventDefault();
        void navigate(breadcrumb.to!);
      }}
    >
      {breadcrumb.label}
    </a>
  );
}

const mq = typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)') : null;

function Breadcrumbs(props: { breadcrumbs?: ICatalogBreadcrumb[]; style?: CSSProperties }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMd = useSyncExternalStore(
    (cb) => { mq?.addEventListener('change', cb); return () => mq?.removeEventListener('change', cb); },
    () => mq?.matches ?? true,
    () => true
  );

  if (!props.breadcrumbs) return <Fragment />;
  const { breadcrumbs } = props;

  if (breadcrumbs.length >= 4 && !isMd) {
    const first = breadcrumbs[0];
    const middle = breadcrumbs.slice(1, -1);
    const last = breadcrumbs[breadcrumbs.length - 1];
    return (
      <Breadcrumb style={props.style}>
        <BreadcrumbItem id={first.id} isActive={first.to === undefined}>
          <BreadcrumbLink breadcrumb={first} />
        </BreadcrumbItem>
        <BreadcrumbItem isDropdown>
          <Dropdown
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                size="sm"
                badge={<Badge isRead screenReaderText="additional breadcrumb items">{middle.length}</Badge>}
                onClick={() => setIsDropdownOpen((o) => !o)}
                isExpanded={isDropdownOpen}
                variant="plainText"
              />
            )}
            isOpen={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
          >
            <DropdownList>
              {middle.map((item, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    if (item.to) void navigate(item.to);
                  }}
                >
                  {item.label}
                </DropdownItem>
              ))}
            </DropdownList>
          </Dropdown>
        </BreadcrumbItem>
        <BreadcrumbItem id={last.id} isActive={last.to === undefined}>
          <BreadcrumbLink breadcrumb={last} />
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb style={props.style}>
      {breadcrumbs.map((breadcrumb, index) => {
        if (!breadcrumb.label) return <Fragment key={index}></Fragment>;
        return (
          <BreadcrumbItem
            data-cy={breadcrumb.label}
            data-testid={breadcrumb.label}
            id={breadcrumb.id}
            key={index}
            component={breadcrumb.component}
            isActive={breadcrumb.to === undefined}
          >
            <BreadcrumbLink breadcrumb={breadcrumb} />
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}

export interface PageHeaderProps {
  navigation?: ReactNode;
  breadcrumbs?: ICatalogBreadcrumb[];
  title?: string | null;
  titleHelpTitle?: string;
  titleHelp?: string | string[];
  titleDocLink?: string;
  titleHeadingLevel?: 'h1' | 'h2' | 'h3';
  /** Pass path segment(s) where the tab breadcrumb leaf should be hidden (e.g. ['details'] hides it only on the /details tab) */
  hideTabBreadcrumb?: boolean | string[];
  description?: null | string | string[];
  controls?: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
}

/**
 * PageHeader enables the responsive layout of the header.
 *
 * @param {Breadcrumb[]} breadcrumbs - The breadcrumbs for the page.
 * @param {string} title - The title of the page.
 * @param {string} titleHelpTitle - The title of help popover.
 * @param {ReactNode} titleHelp - The content for the help popover.
 * @param {string} description - The description of the page.
 * @param {ReactNode} controls - Support for extra page controls.
 * @param {ReactNode} headerActions - The actions for the page.
 * @param {ReactNode} footer - Extra components to render at the bottom of the header.
 *
 * @example
 * <PageLayout>
 *   <PageHeader
 *     breadcrumbs={[{ label: 'Home', to: '/home' }, { label: 'Page title' }]}
 *     title='Page title'
 *     description='Page description'
 *     headerActions={<TypedActions actions={actions} />}
 *   />
 *   ...
 * </PageLayout>
 */
export function PageHeader(props: PageHeaderProps) {
  const { title, description, controls, headerActions, footer } = props;
  const titleHeadingLevel = props.titleHeadingLevel ?? 'h1';
  const titleSize = titleHeadingLevel === 'h2' ? 'xl' : titleHeadingLevel === 'h3' ? 'lg' : '2xl';
  const isLg = useBreakpoint('lg');
  const isXl = useBreakpoint('xl');
  const isMdOrLarger = useBreakpoint('md');
  const [translations] = useFrameworkTranslations();

  const { tabBreadcrumb } = usePageBreadcrumbs();
  const location = useLocation();
  const currentPathSegment = location.pathname.split('/').filter(Boolean).pop() ?? '';
  const hideTabBreadcrumb =
    props.hideTabBreadcrumb === true ||
    (Array.isArray(props.hideTabBreadcrumb) && props.hideTabBreadcrumb.includes(currentPathSegment));
  usePageTitle(title);

  const pageBreadcrumbs = useMemo(() => {
    const pageBreadcrumbs = [];
    if (props.breadcrumbs) {
      pageBreadcrumbs.push(...props.breadcrumbs);
      if (tabBreadcrumb && !hideTabBreadcrumb) pageBreadcrumbs.push(tabBreadcrumb);
    }

    return pageBreadcrumbs;
  }, [props.breadcrumbs, tabBreadcrumb]);

  return (
    <PageSection hasBodyWrapper={false} style={{ paddingBlock: isXl ? 16 : 8, paddingInline: 24 }}>
      <Stack hasGutter>
        <Flex flexWrap={{ default: 'nowrap' }} alignItems={{ default: 'alignItemsStretch' }}>
          <FlexItem grow={{ default: 'grow' }}>
            {pageBreadcrumbs.length > 0 && (
              <Breadcrumbs
                breadcrumbs={pageBreadcrumbs?.length ? pageBreadcrumbs : undefined}
                style={{ paddingBottom: isXl ? 8 : 4 }}
              />
            )}
            {title ? (
              props.titleHelp ? (
                <Title data-testid="page-title" data-cy="page-title" headingLevel="h1" size={titleSize}>
                  {title}
                  <Popover
                    headerContent={props.titleHelpTitle ?? props.title}
                    bodyContent={
                      <Stack hasGutter>
                        {typeof props.titleHelp === 'string' ? (
                          <StackItem>{props.titleHelp}</StackItem>
                        ) : (
                          props.titleHelp.map((help, index) => (
                            <StackItem key={index}>{help}</StackItem>
                          ))
                        )}
                        {props.titleDocLink && (
                          <StackItem>
                            <Button
                              icon={<ExternalLinkAltIcon />}
                              variant="link"
                              onClick={() => window.open(props.titleDocLink, '_blank')}
                              isInline
                              iconPosition="end"
                            >
                              {translations.documentation}
                            </Button>
                          </StackItem>
                        )}
                      </Stack>
                    }
                    position="bottom-start"
                  >
                    <Button
                      icon={<OutlinedQuestionCircleIcon />}
                      variant="link"
                      style={{
                        padding: 0,
                        marginTop: 1,
                        marginLeft: 8,
                        verticalAlign: 'top',
                      }}
                    ></Button>
                  </Popover>
                </Title>
              ) : (
                <Title data-cy="page-title" data-testid="page-title" headingLevel="h1" size={titleSize}>
                  {title}
                </Title>
              )
            ) : null}
            {isMdOrLarger && description && (
              <div
                data-cy="app-description"
                data-testid="app-description"
                style={{ paddingTop: isXl ? 4 : 2, opacity: 0.8 }}
              >
                {description}
              </div>
            )}
          </FlexItem>
          {title && (headerActions || controls) && (
            <Flex
              data-cy="manage-view"
              data-testid="manage-view"
              direction={{ default: 'column' }}
              spaceItems={{ default: 'spaceItemsSm', xl: 'spaceItemsMd' }}
              justifyContent={{ default: 'justifyContentFlexStart' }}
            >
              {controls && <FlexItem grow={{ default: 'grow' }}>{controls}</FlexItem>}
              {headerActions && <FlexItem>{headerActions}</FlexItem>}
            </Flex>
          )}
        </Flex>
        {footer}
      </Stack>
    </PageSection>
  );
}
