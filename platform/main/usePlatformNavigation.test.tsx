/* eslint-disable i18next/no-literal-string */
import { renderHook } from '@testing-library/react';
import { AwxRoute } from '@ansible/awx-ui/main/AwxRoutes';
import { PageNavigationItem } from '@ansible/ansible-ui-framework';
import { EdaRoute } from '@ansible/eda-ui/main/EdaRoutes';
import { HubRoute } from '@ansible/hub-ui/main/HubRoutes';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { PlatformRoute } from './PlatformRoutes';
import { usePlatformNavigation } from './usePlatformNavigation';

const {
  mockUseGet,
  mockUseAwxActiveUser,
  mockUseAwxNavigation,
  mockUseEdaNavigation,
  mockUseHubNavigation,
  mockUseHasAwxService,
  mockUseHasEdaService,
  mockUseHasHubService,
  mockUseIsManagedCloudInstall,
  mockUsePlatformActiveUser,
  mockUsePersonaView,
  mockUseRuntimeFeatureFlagsEnabled,
  mockUseUIFlag,
  mockUseNavigate,
  mockUseGetPlatformApplicationsRoutes,
  mockUseGetPlatformAuthenticatorsRoutes,
  mockUseGetPlatformOrganizationsRoutes,
  mockUseGetPlatformResourceRoutes,
  mockUseGetPlatformRolesRoutes,
  mockUseGetPlatformTeamsRoutes,
  mockUseGetPlatformUsersRoutes,
  mockUseAutomationDashboardCollectionStatus,
} = vi.hoisted(() => ({
  mockUseGet: vi.fn(),
  mockUseAwxActiveUser: vi.fn(),
  mockUseAwxNavigation: vi.fn(),
  mockUseEdaNavigation: vi.fn(),
  mockUseHubNavigation: vi.fn(),
  mockUseHasAwxService: vi.fn(),
  mockUseHasEdaService: vi.fn(),
  mockUseHasHubService: vi.fn(),
  mockUseIsManagedCloudInstall: vi.fn(),
  mockUsePlatformActiveUser: vi.fn(),
  mockUsePersonaView: vi.fn(),
  mockUseRuntimeFeatureFlagsEnabled: vi.fn(),
  mockUseUIFlag: vi.fn(),
  mockUseNavigate: vi.fn(),
  mockUseGetPlatformApplicationsRoutes: vi.fn(),
  mockUseGetPlatformAuthenticatorsRoutes: vi.fn(),
  mockUseGetPlatformOrganizationsRoutes: vi.fn(),
  mockUseGetPlatformResourceRoutes: vi.fn(),
  mockUseGetPlatformRolesRoutes: vi.fn(),
  mockUseGetPlatformTeamsRoutes: vi.fn(),
  mockUseGetPlatformUsersRoutes: vi.fn(),
  mockUseAutomationDashboardCollectionStatus: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (value: string) => value }),
}));

vi.mock('@ansible/common-ui/crud/useGet', () => ({
  useGet: mockUseGet,
}));

vi.mock('@ansible/awx-ui/common/useAwxActiveUser', () => ({
  useAwxActiveUser: mockUseAwxActiveUser,
}));

vi.mock('@ansible/awx-ui/main/useAwxNavigation', () => ({
  useAwxNavigation: mockUseAwxNavigation,
}));

vi.mock('@ansible/eda-ui/main/useEdaNavigation', () => ({
  useEdaNavigation: mockUseEdaNavigation,
}));

vi.mock('@ansible/hub-ui/main/useHubNavigation', () => ({
  useHubNavigation: mockUseHubNavigation,
}));

vi.mock('./GatewayServices', () => ({
  useHasAwxService: mockUseHasAwxService,
  useHasEdaService: mockUseHasEdaService,
  useHasHubService: mockUseHasHubService,
}));

vi.mock('./GatewayUIAuth', () => ({
  useIsManagedCloudInstall: mockUseIsManagedCloudInstall,
  useIsManagedCloudInstallInternal: vi.fn(() => false),
}));

vi.mock('./PlatformActiveUserProvider', () => ({
  usePlatformActiveUser: mockUsePlatformActiveUser,
}));

vi.mock('./persona-view/usePersonaView', () => ({
  usePersonaView: mockUsePersonaView,
}));

vi.mock('../settings/runtime-feature-flags/useRuntimeFeatureFlagsEnabled', () => ({
  useRuntimeFeatureFlagsEnabled: mockUseRuntimeFeatureFlagsEnabled,
}));

vi.mock('../settings/ui-flags/useUIFlag', () => ({
  useUIFlag: mockUseUIFlag,
  UIFlag: { PersonaViewSwitcher: 'PersonaViewSwitcher' },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: mockUseNavigate,
  };
});

vi.mock('../routes/useGetPlatformApplicationsRoutes', () => ({
  useGetPlatformApplicationsRoutes: mockUseGetPlatformApplicationsRoutes,
}));

vi.mock('../routes/useGetPlatformAuthenticatorsRoutes', () => ({
  useGetPlatformAuthenticatorsRoutes: mockUseGetPlatformAuthenticatorsRoutes,
}));

vi.mock('../routes/useGetPlatformOrganizationsRoutes', () => ({
  useGetPlatformOrganizationsRoutes: mockUseGetPlatformOrganizationsRoutes,
}));

vi.mock('../routes/useGetPlatformResourceRoutes', () => ({
  useGetPlatformResourceRoutes: mockUseGetPlatformResourceRoutes,
}));

vi.mock('../routes/useGetPlatformRolesRoutes', () => ({
  useGetPlatformRolesRoutes: mockUseGetPlatformRolesRoutes,
}));

vi.mock('../routes/useGetPlatformTeamsRoutes', () => ({
  useGetPlatformTeamsRoutes: mockUseGetPlatformTeamsRoutes,
}));

vi.mock('../routes/useGetPlatformUsersRoutes', () => ({
  useGetPlatformUsersRoutes: mockUseGetPlatformUsersRoutes,
}));

vi.mock(
  '../../frontend/awx/analytics/automation-dashboard/common/useAutomationDashboardCollectionStatus',
  () => ({
    useAutomationDashboardCollectionStatus: mockUseAutomationDashboardCollectionStatus,
  })
);

function buildAwxNav(): PageNavigationItem[] {
  return [
    {
      id: AwxRoute.Infrastructure,
      label: 'Infrastructure',
      path: 'infrastructure',
      children: [],
    },
    { id: AwxRoute.Credentials, label: 'Credentials', path: 'credentials', element: <></> },
    {
      id: AwxRoute.CredentialTypes,
      label: 'Credential Types',
      path: 'credential-types',
      element: <></>,
    },
    { id: AwxRoute.Overview, label: 'Overview', path: 'overview', element: <></> },
    { id: AwxRoute.Access, label: 'Access', path: 'access', element: <></> },
    { id: AwxRoute.Settings, label: 'Settings', path: 'settings', element: <></> },
    {
      id: AwxRoute.Analytics,
      label: 'Analytics',
      path: 'analytics',
      children: [
        {
          id: AwxRoute.AutomationDashboard,
          label: 'Automation Dashboard',
          path: 'automation-dashboard',
          element: <></>,
        },
      ],
    },
  ];
}

function buildEdaNav(): PageNavigationItem[] {
  return [
    { id: EdaRoute.Overview, label: 'Overview', path: 'overview', element: <></> },
    {
      id: EdaRoute.RulebookActivations,
      label: 'Rulebook Activations',
      path: 'rulebook-activations',
      element: <></>,
    },
    { id: EdaRoute.Credentials, label: 'Credentials', path: 'credentials', element: <></> },
    {
      id: EdaRoute.CredentialTypes,
      label: 'Credential Types',
      path: 'credential-types',
      element: <></>,
    },
    { id: EdaRoute.Users, label: 'Users', path: 'users', element: <></> },
    { id: EdaRoute.Access, label: 'Access', path: 'access', element: <></> },
    { id: EdaRoute.Settings, label: 'Settings', path: 'settings', element: <></> },
    { path: '', element: <></> },
  ];
}

function buildHubNav(): PageNavigationItem[] {
  return [
    { id: HubRoute.Overview, label: 'Overview', path: 'overview', element: <></> },
    {
      id: HubRoute.RemoteRegistries,
      label: 'Remote registries',
      path: 'administration/remote-registries',
      element: <></>,
    },
    { id: HubRoute.Access, label: 'Access', path: 'access', element: <></> },
    { id: HubRoute.Settings, label: 'Settings', path: 'settings', element: <></> },
    { id: HubRoute.Users, label: 'Users', path: 'users', element: <></> },
    { id: HubRoute.Teams, label: 'Teams', path: 'teams', element: <></> },
    { id: HubRoute.Organizations, label: 'Organizations', path: 'organizations', element: <></> },
  ];
}

describe('usePlatformNavigation demo mode', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_DEMO_MODE', 'true');
    mockUseGet.mockReturnValue({ data: undefined });
    mockUseAwxActiveUser.mockReturnValue({ activeAwxUser: { is_superuser: true } });
    mockUseAwxNavigation.mockImplementation(() => buildAwxNav());
    mockUseEdaNavigation.mockImplementation(() => buildEdaNav());
    mockUseHubNavigation.mockImplementation(() => buildHubNav());
    mockUseHasAwxService.mockReturnValue(true);
    mockUseHasEdaService.mockReturnValue(true);
    mockUseHasHubService.mockReturnValue(true);
    mockUseIsManagedCloudInstall.mockReturnValue(false);
    mockUsePlatformActiveUser.mockReturnValue({
      activePlatformUser: { is_superuser: true, is_platform_auditor: false },
    });
    mockUsePersonaView.mockReturnValue({ activePersonaViewId: 'administration' });
    mockUseRuntimeFeatureFlagsEnabled.mockReturnValue({ isEnabled: false });
    mockUseUIFlag.mockReturnValue({ enabled: false });
    mockUseNavigate.mockReturnValue(vi.fn());
    mockUseGetPlatformApplicationsRoutes.mockReturnValue([
      {
        id: PlatformRoute.Applications,
        label: 'Applications',
        path: 'applications',
        children: [],
      },
    ]);
    mockUseGetPlatformAuthenticatorsRoutes.mockReturnValue({
      id: PlatformRoute.Authenticators,
      label: 'Authenticators',
      path: 'authenticators',
      children: [],
    });
    mockUseGetPlatformOrganizationsRoutes.mockReturnValue({
      id: PlatformRoute.Organizations,
      label: 'Organizations',
      path: 'organizations',
      children: [],
    });
    mockUseGetPlatformResourceRoutes.mockReturnValue({
      id: PlatformRoute.PlatformResources,
      label: 'Resources',
      path: 'resources',
      children: [],
    });
    mockUseGetPlatformRolesRoutes.mockReturnValue([]);
    mockUseGetPlatformTeamsRoutes.mockReturnValue({
      id: PlatformRoute.Teams,
      label: 'Teams',
      path: 'teams',
      children: [],
    });
    mockUseGetPlatformUsersRoutes.mockReturnValue({
      id: PlatformRoute.Users,
      label: 'Users',
      path: 'users',
      children: [],
    });
    mockUseAutomationDashboardCollectionStatus.mockReturnValue({
      collectionStatus: { enabled: false, next_run: null, initial_collection_status: null },
      isLoading: false,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  test('should keep only the EDA section visible and route root to rulebook activations', () => {
    const { result } = renderHook(() => usePlatformNavigation());

    const overview = result.current.find((item) => item.id === PlatformRoute.Overview);
    const awx = result.current.find((item) => item.id === PlatformRoute.AWX);
    const eda = result.current.find((item) => item.id === PlatformRoute.EDA);
    const hub = result.current.find((item) => item.id === PlatformRoute.HUB);
    const access = result.current.find((item) => item.id === PlatformRoute.Access);
    const quickStarts = result.current.find((item) => item.id === PlatformRoute.QuickStarts);
    const settings = result.current.find((item) => item.id === AwxRoute.Settings);
    const root = result.current.find((item) => item.id === PlatformRoute.Root) as {
      element: { props: { to: string } };
    };
    const edaRoot = (eda as { children?: PageNavigationItem[] } | undefined)?.children?.find(
      (item) => item.path === '' && !item.id
    ) as { element: { props: { to: string } } } | undefined;

    expect(overview?.hidden).toBe(true);
    expect(awx?.hidden).toBe(true);
    expect(eda?.hidden).toBe(false);
    expect(hub?.hidden).toBe(true);
    expect(access?.hidden).toBe(true);
    expect(quickStarts?.hidden).toBe(true);
    expect(settings?.hidden).toBe(true);
    expect(root.element.props.to).toBe('decisions/rulebook-activations');
    expect(edaRoot?.element.props.to).toBe('./rulebook-activations');
  });
});
