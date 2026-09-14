import { edaAPI } from '@ansible/eda-ui/common/eda-utils';

export const mockEdaActivations = [
  {
    id: 1,
    name: 'Unbounded Log Growth Watcher',
    description:
      'Monitors bursty events and launches cleanup automation when log growth exceeds the threshold.',
    is_enabled: true,
    status: 'running',
    status_message: 'Processing event backlog from webhook source',
    rulebook_name: 'unbounded-log-growth.yml',
    restart_policy: 'on-failure',
    restart_count: 2,
    rules_count: 4,
    rules_fired_count: 128,
    created_at: '2026-09-10T13:15:00Z',
    modified_at: '2026-09-14T12:40:00Z',
    restarted_at: '2026-09-14T12:05:00Z',
    edited_at: '2026-09-14T11:50:00Z',
    awx_token_id: null,
    log_level: 'info',
    k8s_service_name: 'eda-unbounded-log-growth',
    event_streams: null,
    source_mappings: '',
    skip_audit_events: false,
    organization: { id: 1, name: 'Default' },
    project: {
      id: 11,
      name: 'EDA Prototype Project',
      url: edaAPI`/projects/11/`,
      description: 'Prototype content for EDA-only navigation flows.',
      update_revision_on_launch: false,
    },
    rulebook: { id: 101, name: 'unbounded-log-growth.yml', url: edaAPI`/rulebooks/101/` },
    decision_environment: {
      id: 21,
      name: 'EDA Decision Environment',
      url: edaAPI`/decision-environments/21/`,
      description: '',
      image_url: 'quay.io/ansible/eda-decision-environment:latest',
    },
    extra_var: null,
    instances: [],
    eda_credentials: [],
    git_hash: 'log1234',
    current_job_id: 4001,
    project_id: 11,
    restart_on_project_update: false,
    enable_persistence: true,
    rule_engine_credential_id: null,
    rule_engine_credential: null,
    created_by: { username: 'demo-admin' },
    modified_by: { username: 'demo-admin' },
    edited_by: { username: 'demo-admin' },
  },
  {
    id: 2,
    name: 'Activation History Pressure Test',
    description:
      'Replays high-volume activation history to exercise pagination and troubleshooting views.',
    is_enabled: false,
    status: 'stopped',
    status_message: 'Disabled after repeated oversized log bursts',
    rulebook_name: 'history-pressure-test.yml',
    restart_policy: 'never',
    restart_count: 1,
    rules_count: 2,
    rules_fired_count: 37,
    created_at: '2026-09-09T08:30:00Z',
    modified_at: '2026-09-14T10:10:00Z',
    restarted_at: '2026-09-13T18:00:00Z',
    edited_at: '2026-09-14T09:45:00Z',
    awx_token_id: null,
    log_level: 'debug',
    k8s_service_name: 'eda-history-pressure-test',
    event_streams: null,
    source_mappings: '',
    skip_audit_events: false,
    organization: { id: 1, name: 'Default' },
    project: {
      id: 11,
      name: 'EDA Prototype Project',
      url: edaAPI`/projects/11/`,
      description: 'Prototype content for EDA-only navigation flows.',
      update_revision_on_launch: false,
    },
    rulebook: { id: 102, name: 'history-pressure-test.yml', url: edaAPI`/rulebooks/102/` },
    decision_environment: {
      id: 21,
      name: 'EDA Decision Environment',
      url: edaAPI`/decision-environments/21/`,
      description: '',
      image_url: 'quay.io/ansible/eda-decision-environment:latest',
    },
    extra_var: null,
    instances: [],
    eda_credentials: [],
    git_hash: 'hist5678',
    current_job_id: null,
    project_id: 11,
    restart_on_project_update: false,
    enable_persistence: true,
    rule_engine_credential_id: null,
    rule_engine_credential: null,
    created_by: { username: 'demo-admin' },
    modified_by: { username: 'demo-admin' },
    edited_by: { username: 'demo-admin' },
  },
];

export const mockEdaActivationInstancesByActivationId: Record<
  number,
  {
    id: number;
    name: string;
    status: string;
    status_message: string | null;
    activation_id: number;
    organization_id: number;
    started_at: string;
    ended_at: string | null;
    queue_name: string;
    git_hash: string;
  }[]
> = {
  1: [
    {
      id: 103,
      name: 'Unbounded Log Growth Watcher-3',
      status: 'running',
      status_message: null,
      activation_id: 1,
      organization_id: 1,
      started_at: '2026-09-14T12:05:00Z',
      ended_at: null,
      queue_name: 'default',
      git_hash: 'log1234',
    },
    {
      id: 102,
      name: 'Unbounded Log Growth Watcher-2',
      status: 'completed',
      status_message: null,
      activation_id: 1,
      organization_id: 1,
      started_at: '2026-09-14T10:55:00Z',
      ended_at: '2026-09-14T11:03:12Z',
      queue_name: 'default',
      git_hash: 'log1234',
    },
    {
      id: 101,
      name: 'Unbounded Log Growth Watcher-1',
      status: 'failed',
      status_message: 'Queue backlog exceeded threshold',
      activation_id: 1,
      organization_id: 1,
      started_at: '2026-09-14T09:20:00Z',
      ended_at: '2026-09-14T09:24:41Z',
      queue_name: 'default',
      git_hash: 'log1234',
    },
  ],
  2: [
    {
      id: 202,
      name: 'Activation History Pressure Test-2',
      status: 'completed',
      status_message: null,
      activation_id: 2,
      organization_id: 1,
      started_at: '2026-09-13T18:00:00Z',
      ended_at: '2026-09-13T18:04:30Z',
      queue_name: 'history',
      git_hash: 'hist5678',
    },
    {
      id: 201,
      name: 'Activation History Pressure Test-1',
      status: 'failed',
      status_message: 'Log archive step timed out',
      activation_id: 2,
      organization_id: 1,
      started_at: '2026-09-13T16:12:00Z',
      ended_at: '2026-09-13T16:15:10Z',
      queue_name: 'history',
      git_hash: 'hist5678',
    },
  ],
};

const mockLogsById: Record<number, { id: number; log: string; activation_instance: number }[]> = {
  103: [
    {
      id: 10301,
      log: '2026-09-14 12:05:00,012 INFO  Starting rulebook activation',
      activation_instance: 103,
    },
    {
      id: 10302,
      log: '2026-09-14 12:05:00,340 INFO  Connected to event source: webhook_burst_monitor',
      activation_instance: 103,
    },
    {
      id: 10303,
      log: '2026-09-14 12:05:01,100 INFO  Rulebook loaded: unbounded-log-growth.yml (4 rules)',
      activation_instance: 103,
    },
    {
      id: 10304,
      log: '2026-09-14 12:05:10,420 INFO  Event received: logs.buffer_pressure',
      activation_instance: 103,
    },
    {
      id: 10305,
      log: '2026-09-14 12:05:10,901 INFO  Action: run_job_template (Trim Activation Logs)',
      activation_instance: 103,
    },
    {
      id: 10306,
      log: '2026-09-14 12:05:11,180 INFO  Job launched successfully (job_id=4001)',
      activation_instance: 103,
    },
  ],
  102: [
    {
      id: 10201,
      log: '2026-09-14 10:55:00,010 INFO  Starting rulebook activation',
      activation_instance: 102,
    },
    {
      id: 10202,
      log: '2026-09-14 10:55:00,288 INFO  Connected to event source: webhook_burst_monitor',
      activation_instance: 102,
    },
    {
      id: 10203,
      log: '2026-09-14 10:55:32,115 INFO  Event received: logs.buffer_pressure',
      activation_instance: 102,
    },
    {
      id: 10204,
      log: '2026-09-14 10:55:32,778 INFO  Action: notify_slack (EDA prototype room)',
      activation_instance: 102,
    },
    {
      id: 10205,
      log: '2026-09-14 11:03:12,000 INFO  Activation completed successfully',
      activation_instance: 102,
    },
  ],
  101: [
    {
      id: 10101,
      log: '2026-09-14 09:20:00,005 INFO  Starting rulebook activation',
      activation_instance: 101,
    },
    {
      id: 10102,
      log: '2026-09-14 09:20:00,150 INFO  Connected to event source: webhook_burst_monitor',
      activation_instance: 101,
    },
    {
      id: 10103,
      log: '2026-09-14 09:20:14,151 WARN  Queue backlog exceeded the safety threshold',
      activation_instance: 101,
    },
    {
      id: 10104,
      log: '2026-09-14 09:24:41,000 ERROR Failed to drain log backlog before timeout',
      activation_instance: 101,
    },
  ],
  202: [
    {
      id: 20201,
      log: '2026-09-13 18:00:00,009 INFO  Starting rulebook activation',
      activation_instance: 202,
    },
    {
      id: 20202,
      log: '2026-09-13 18:00:00,191 INFO  Replaying historical activation entries',
      activation_instance: 202,
    },
    {
      id: 20203,
      log: '2026-09-13 18:04:30,000 INFO  Archived 500 mock history entries successfully',
      activation_instance: 202,
    },
  ],
  201: [
    {
      id: 20101,
      log: '2026-09-13 16:12:00,004 INFO  Starting rulebook activation',
      activation_instance: 201,
    },
    {
      id: 20102,
      log: '2026-09-13 16:12:18,612 INFO  Building mock history payload',
      activation_instance: 201,
    },
    {
      id: 20103,
      log: '2026-09-13 16:15:10,000 ERROR Log archive step timed out after 180 seconds',
      activation_instance: 201,
    },
  ],
};

function getLogTimestamp(logLine: string) {
  const timestamp = logLine.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}/)?.[0];
  if (!timestamp) {
    return undefined;
  }

  return Math.floor(Date.parse(timestamp.replace(' ', 'T').replace(',', '.') + 'Z') / 1000);
}

export const mockEdaActivationInstances = Object.values(
  mockEdaActivationInstancesByActivationId
).flat();

export const mockEdaActivation = mockEdaActivations[0];

export function getMockActivationById(activationId: number) {
  return mockEdaActivations.find((activation) => activation.id === activationId);
}

export function getMockActivationInstances(activationId: number) {
  return mockEdaActivationInstancesByActivationId[activationId] ?? [];
}

export function getMockActivationInstance(instanceId: number) {
  return mockEdaActivationInstances.find((instance) => instance.id === instanceId);
}

export function getMockLogs(instanceId: number) {
  return (mockLogsById[instanceId] ?? []).map((log) => ({
    ...log,
    log_timestamp: getLogTimestamp(log.log),
  }));
}
