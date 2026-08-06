import { HttpResponse, http } from 'msw';

const API = '/api/controller/v2';

const emptyList = { count: 0, results: [], next: null, previous: null };

export const awxHandlers = [
  http.get(`${API}/ping/`, () =>
    HttpResponse.json({ version: '4.6.0', ha: false, active_node: 'demo' })
  ),

  // Valid license_info bypasses the subscription wizard
  http.get(`${API}/config/`, () =>
    HttpResponse.json({
      version: '4.6.0',
      eula: '',
      license_info: {
        license_type: 'enterprise',
        valid_key: true,
        license_date: 9999999999,
        subscription_name: 'Demo Subscription',
        product_name: 'Red Hat Ansible Automation Platform',
        trial: false,
        instance_count: 10000,
        automated_instances: 0,
        free_instances: 10000,
        compliant: true,
      },
    })
  ),

  http.get(`${API}/subscriptions/`, () => HttpResponse.json(emptyList)),

  http.get(`${API}/me/`, () =>
    HttpResponse.json({
      count: 1,
      results: [
        {
          id: 1,
          username: 'demo-admin',
          first_name: 'Demo',
          last_name: 'Admin',
          email: 'demo@redhat.com',
          is_superuser: true,
          is_system_auditor: false,
        },
      ],
    })
  ),

  http.get(`${API}/dashboard/`, () =>
    HttpResponse.json({
      inventories: { url: '/api/controller/v2/inventories/', total: 1, not_synced: 0 },
      inventory_sources: {
        url: '/api/controller/v2/inventory_sources/',
        total: 0,
        not_synced: 0,
        failed: 0,
      },
      scm_url: '/api/controller/v2/projects/',
      projects: { url: '/api/controller/v2/projects/', total: 1, failed: 0 },
      jobs: {
        url: '/api/controller/v2/unified_jobs/',
        total: 0,
        failed: 0,
      },
      counts: {
        inventories: 1,
        inventory_sources: 0,
        projects: 1,
        templates: 2,
        credentials: 1,
        job_templates: 2,
        users: 1,
        hosts: 3,
        running_jobs: 0,
        failed_jobs: 0,
        organizations: 1,
      },
    })
  ),

  // Stubs to prevent 404 noise
  http.get(`${API}/organizations/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/projects/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/inventories/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/credentials/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/credential_types/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/execution_environments/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/instance_groups/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/job_templates/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/workflow_job_templates/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/unified_job_templates/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/unified_jobs/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/jobs/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/settings/`, () => HttpResponse.json(emptyList)),
  http.get(`${API}/settings/all/`, () => HttpResponse.json({})),
];
