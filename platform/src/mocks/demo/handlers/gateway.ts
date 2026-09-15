import { HttpResponse, http } from 'msw';

const API = '/api/gateway/v1';

const mockUser = {
  id: 1,
  username: 'demo-admin',
  first_name: 'Demo',
  last_name: 'Admin',
  email: 'demo@redhat.com',
  is_superuser: true,
  is_platform_auditor: false,
};

export const gatewayHandlers = [
  http.get(`${API}/ping/`, () => HttpResponse.json({ version: '2.5.0' })),
  http.get(`${API}/ui_auth/`, () =>
    HttpResponse.json({
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
    })
  ),
  http.get(`${API}/me/`, () =>
    HttpResponse.json({ count: 1, results: [mockUser], next: null, previous: null })
  ),
  http.post(`${API}/session/login/`, () => HttpResponse.json({ token: 'demo-token' })),
  http.get('/api/', () =>
    HttpResponse.json({ apis: { gateway: '/api/gateway', eda: '/api/eda' } })
  ),
  http.get(`${API}/organizations/`, () =>
    HttpResponse.json({
      count: 1,
      results: [{ id: 1, name: 'Default', description: '' }],
      next: null,
      previous: null,
    })
  ),
  http.get(`${API}/organizations/:id/`, () =>
    HttpResponse.json({ id: 1, name: 'Default', description: '' })
  ),
  http.get(`${API}/users/`, () =>
    HttpResponse.json({ count: 1, results: [mockUser], next: null, previous: null })
  ),
  http.get(`${API}/users/:id/`, () => HttpResponse.json(mockUser)),
  http.get(`${API}/app_urls/`, () => HttpResponse.json({ results: [] })),
  http.get(`${API}/feature_flags/`, () => HttpResponse.json({})),
  http.get(`${API}/session/`, () => HttpResponse.json({ expires_in_seconds: 3600 })),
  http.post(`${API}/session/`, () => HttpResponse.json({ expires_in_seconds: 3600 })),
];
