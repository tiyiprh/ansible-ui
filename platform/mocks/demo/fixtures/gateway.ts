export const mockMe = {
  id: 1,
  username: 'demo-admin',
  first_name: 'Demo',
  last_name: 'Admin',
  email: 'demo@redhat.com',
  is_superuser: true,
  is_platform_auditor: false,
  managed: false,
  last_login: '2026-06-04T00:00:00Z',
  created: '2026-01-01T00:00:00Z',
  modified: '2026-06-04T00:00:00Z',
};

export const mockOrganization = {
  id: 1,
  name: 'Default',
  description: 'Default organization',
  created: '2026-01-01T00:00:00Z',
  modified: '2026-01-01T00:00:00Z',
};

// Include controller so the AWX/Analytics section is visible in the nav
export const mockGatewayServices = {
  apis: {
    gateway: '/api/gateway',
    controller: '/api/controller',
    eda: '/api/eda',
  },
};

export const mockUIAuth = {
  show_login_form: true,
  passwords: [],
  ssos: [],
  login_redirect_override: '',
  custom_login_info: '',
  custom_logo: '',
  managed_cloud_install: false,
  legacy_automation_hub_sso_url: '',
  legacy_controller_sso_url: '',
  legacy_auth_enabled: false,
};
