import { HttpResponse, http } from 'msw';
import {
  getMockActivationById,
  getMockActivationInstance,
  getMockActivationInstances,
  getMockLogs,
  mockEdaActivations,
} from '../fixtures/edaActivations';

const API = process.env.EDA_API_PREFIX ?? `/${['api', 'eda', 'v1'].join('/')}`;

const activationListOptions = {
  name: 'Activation List',
  description: 'Demo activation list options',
  actions: {
    GET: {},
    POST: {},
  },
};

const activationDetailOptions = {
  name: 'Activation Detail',
  description: 'Demo activation detail options',
  actions: {
    GET: {},
    PATCH: {},
    DELETE: {},
  },
};

export const edaHandlers = [
  http.get(`${API}/config/`, () => HttpResponse.json({ version: '1.0.0', deployment_type: 'aap' })),

  http.get(`${API}/users/me/`, () =>
    HttpResponse.json({
      id: 1,
      username: 'demo-admin',
      first_name: 'Demo',
      last_name: 'Admin',
      email: 'demo@redhat.com',
      is_superuser: true,
    })
  ),

  http.get(`${API}/users/`, () =>
    HttpResponse.json({ count: 0, results: [], next: null, previous: null })
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

  // Activations list (Before page)
  http.get(`${API}/activations/`, () =>
    HttpResponse.json({
      count: mockEdaActivations.length,
      results: mockEdaActivations,
      next: null,
      previous: null,
    })
  ),
  http.options(`${API}/activations/`, () => HttpResponse.json(activationListOptions)),

  // Activation detail
  http.get(`${API}/activations/:id/`, ({ params }) => {
    const activation = getMockActivationById(Number(params.id));
    return activation
      ? HttpResponse.json(activation)
      : HttpResponse.json({ detail: 'Not found' }, { status: 404 });
  }),
  http.options(`${API}/activations/:id/`, () => HttpResponse.json(activationDetailOptions)),

  http.post(`${API}/activations/:id/clear-logs/`, () => HttpResponse.json({ status: 'cleared' })),

  // Activation history (instances)
  http.get(`${API}/activations/:id/instances/`, ({ params }) =>
    HttpResponse.json({
      count: getMockActivationInstances(Number(params.id)).length,
      results: getMockActivationInstances(Number(params.id)),
      next: null,
      previous: null,
    })
  ),

  // Activation instance detail — needed when clicking a row in the History tab
  http.get(`${API}/activation-instances/:instanceId/`, ({ params }) => {
    const instance = getMockActivationInstance(Number(params.instanceId));
    return instance
      ? HttpResponse.json(instance)
      : HttpResponse.json({ detail: 'Not found' }, { status: 404 });
  }),

  http.post(`${API}/activation-instances/:instanceId/clear-logs/`, () =>
    HttpResponse.json({ status: 'cleared' })
  ),

  // Activation instance logs — shown in the Details tab of an activation instance
  http.get(`${API}/activation-instances/:instanceId/logs/`, ({ params }) => {
    const instance = getMockActivationInstance(Number(params.instanceId));
    const logs = instance ? getMockLogs(instance.id) : [];
    return HttpResponse.json({ count: logs.length, results: logs, next: null, previous: null });
  }),

  // Stub out other EDA endpoints to avoid unhandled request noise
  http.get(`${API}/projects/`, () =>
    HttpResponse.json({ count: 0, results: [], next: null, previous: null })
  ),
  http.get(`${API}/decision-environments/`, () =>
    HttpResponse.json({ count: 0, results: [], next: null, previous: null })
  ),
  http.get(`${API}/eda-credentials/`, () =>
    HttpResponse.json({ count: 0, results: [], next: null, previous: null })
  ),
  http.get(`${API}/credential-types/`, () =>
    HttpResponse.json({ count: 0, results: [], next: null, previous: null })
  ),
  http.get(`${API}/rule-audits/`, () =>
    HttpResponse.json({ count: 0, results: [], next: null, previous: null })
  ),
  http.get(`${API}/role_definitions/`, () =>
    HttpResponse.json({ count: 0, results: [], next: null, previous: null })
  ),
  http.get(`${API}/role_user_assignments/`, () =>
    HttpResponse.json({ count: 0, results: [], next: null, previous: null })
  ),
  http.get(`${API}/role_team_assignments/`, () =>
    HttpResponse.json({ count: 0, results: [], next: null, previous: null })
  ),
];
