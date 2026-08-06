import { useManageItems } from '@ansible/ansible-ui-framework/components/useManagedItems';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { INITIAL_MANAGE_VIEW_PANELS, LEADERBOARD_PANEL_IDS } from './postGaMockData';

type LeaderboardPanel = { id: string; name: string };

export function useManagedLeaderboardPanels() {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        header: t('Leaderboard panels'),
        cell: (item: LeaderboardPanel) => item.name,
      },
    ],
    [t]
  );

  const resources: LeaderboardPanel[] = useMemo(
    () =>
      INITIAL_MANAGE_VIEW_PANELS.map((panel) => ({
        id: panel.id,
        name: t(panel.label),
      })),
    [t]
  );

  const { openManageItems: openManageLeaderboards, managedItems: managedPanels } =
    useManageItems<LeaderboardPanel>({
      id: 'post-ga-leaderboards',
      title: t('Manage view'),
      description: t(
        'Hide or show the panels you want to see on the leaderboards page by selecting or unselecting, respectively. The panels are ordered from top to bottom on the list. Use the draggable icon :: to re-order your view.'
      ),
      items: resources,
      keyFn: (item) => item.id,
      columns,
      hideColumnHeaders: true,
    });

  const visiblePanels = useMemo(
    () =>
      managedPanels.filter((panel) =>
        (LEADERBOARD_PANEL_IDS as readonly string[]).includes(panel.id)
      ),
    [managedPanels]
  );

  return {
    openManageLeaderboards,
    visiblePanels,
  };
}
