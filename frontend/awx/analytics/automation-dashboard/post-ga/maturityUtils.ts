export const STORAGE_KEY = 'automation-dashboard-adoption-levels';

export type MaturityLevel = { name: string; description: string };

export const DEFAULT_LEVELS: MaturityLevel[] = [
  { name: 'Ad hoc', description: 'Automation is informal and inconsistent across the organization.' },
  { name: 'Repeatable', description: 'Some processes are repeated with basic consistency.' },
  {
    name: 'Defined',
    description:
      'Processes are documented, standardized, and consistently applied across teams.',
  },
  {
    name: 'Managed',
    description:
      'Automation is measured, monitored, and improved with clear ownership.',
  },
  {
    name: 'Optimizing',
    description:
      'Continuous improvement is embedded; automation is strategic and scalable.',
  },
];

export function loadMaturityLevels(): MaturityLevel[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as MaturityLevel[];
    }
  } catch {
    // fall through — use defaults on any parse error
  }
  return DEFAULT_LEVELS.map((level) => ({ ...level }));
}

export function saveMaturityLevels(levels: MaturityLevel[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(levels));
  window.dispatchEvent(new Event('automation-dashboard-settings-changed'));
}
