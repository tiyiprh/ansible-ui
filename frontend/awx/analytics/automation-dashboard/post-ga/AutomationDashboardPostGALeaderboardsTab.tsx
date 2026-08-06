import { Scrollable } from '@ansible/ansible-ui-framework/components/Scrollable';
import { AutomationDashboardLeaderboards } from './AutomationDashboardLeaderboards';
import { PostGaLeaderboardsPrototypeNote } from './PostGaPrototypeNotes';

export function AutomationDashboardPostGALeaderboardsTab() {
  return (
    <Scrollable marginLeft={20} marginRight={20} marginBottom={16} marginTop={16}>
      <PostGaLeaderboardsPrototypeNote />
      <AutomationDashboardLeaderboards />
    </Scrollable>
  );
}
