import { HttpResponse, http } from 'msw';
import { mockGatewayServices, mockMe, mockUIAuth } from '../fixtures/gateway';

const GW = '/api/gateway/v1';

export const gatewayHandlers = [
  http.get(`${GW}/ping/`, () => HttpResponse.json({ version: '2.5.0' })),
  http.get(`${GW}/ui_auth/`, () => HttpResponse.json(mockUIAuth)),
  http.get(`${GW}/me/`, () =>
    HttpResponse.json({ count: 1, results: [mockMe] })
  ),
  http.post(`${GW}/session/login/`, () =>
    HttpResponse.json({ token: 'demo-session-token' })
  ),
  http.get(`${GW}/session/`, () =>
    HttpResponse.json({ token: 'demo-session-token', expires_in_seconds: 3600 })
  ),
  http.get('/api/', () => HttpResponse.json(mockGatewayServices)),
  http.get('/api', () => HttpResponse.json(mockGatewayServices)),

  // Organizations
  http.get(`${GW}/organizations/`, () =>
    HttpResponse.json({ count: 1, results: [{ id: 1, name: 'Default' }] })
  ),
  http.get(`${GW}/organizations/:id/`, ({ params }) =>
    HttpResponse.json({ id: Number(params.id), name: 'Default' })
  ),

  // Users
  http.get(`${GW}/users/`, () =>
    HttpResponse.json({ count: 1, results: [mockMe] })
  ),
  http.get(`${GW}/users/:id/`, () => HttpResponse.json(mockMe)),

  // Teams
  http.get(`${GW}/teams/`, () =>
    HttpResponse.json({ count: 0, results: [] })
  ),

  // Role definitions / assignments
  http.get(`${GW}/role_definitions/`, () =>
    HttpResponse.json({ count: 0, results: [] })
  ),
  http.get(`${GW}/role_user_assignments/`, () =>
    HttpResponse.json({ count: 0, results: [] })
  ),
  http.get(`${GW}/role_team_assignments/`, () =>
    HttpResponse.json({ count: 0, results: [] })
  ),

  // Feature flags
  http.get(`${GW}/feature_flags/`, () => HttpResponse.json({})),

  // Auth tokens / authenticators
  http.get(`${GW}/auth_tokens/`, () =>
    HttpResponse.json({ count: 0, results: [] })
  ),
  http.get(`${GW}/authenticators/`, () =>
    HttpResponse.json({ count: 0, results: [] })
  ),

  // OAuth2 applications
  http.get(`${GW}/oauth2_applications/`, () =>
    HttpResponse.json({ count: 0, results: [] })
  ),

  // Settings
  http.get(`${GW}/settings/all/`, () => HttpResponse.json({})),
  http.get(`${GW}/settings/feature_flags/`, () => HttpResponse.json({})),
  http.get(`${GW}/app_urls/`, () => HttpResponse.json({ count: 0, results: [] })),
];
