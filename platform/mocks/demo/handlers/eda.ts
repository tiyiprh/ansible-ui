import { HttpResponse, http } from 'msw';

const API = '/api/eda/v1';

const emptyList = { count: 0, results: [], next: null, previous: null };

export const edaHandlers = [
  http.get(`${API}/users/me/`, () =>
    HttpResponse.json({
      id: 1,
      username: 'demo-admin',
      first_name: 'Demo',
      last_name: 'Admin',
      is_superuser: true,
    })
  ),
  http.get(`${API}/config/`, () => HttpResponse.json({ version: '2.5.0' })),
  http.get(`${API}/activations/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/projects/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/event-streams/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/rulebooks/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/decision-environments/`, () => HttpResponse.json(emptyList)),
];
