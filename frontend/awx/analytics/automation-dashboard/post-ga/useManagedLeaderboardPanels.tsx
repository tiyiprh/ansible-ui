import { useManageItems } from '@ansible/ansible-ui-framework/components/useManagedItems';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { INITIAL_MANAGE_VIEW_PANELS, LEADERBOARD_PANEL_IDS } from './postGaMockData';

type LeaderboardPanel = { id: string; name: string };

export function useManagedLeaderboardPanels(manageItemsId = 'post-ga-highlights') {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        header: t('Ranking panels'),
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
      id: manageItemsId,
      title: t('Manage view'),
      description: t(
        'Hide or show the ranking panels you want on the Highlights tab. Goals and Automation at a glance stay pinned at the top. Use the draggable icon to re-order panels.'
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
