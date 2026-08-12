import { Scrollable } from '@ansible/ansible-ui-framework/components/Scrollable';
import { useTranslation } from 'react-i18next';
import { useRegisterPrototypeNotes } from '../../../../../platform/common/PrototypeNotesRegistry';
import { AutomationDashboardLeaderboards } from './AutomationDashboardLeaderboards';
import { PostGaHighlightsPrototypeNote } from './PostGaPrototypeNotes';

export function AutomationDashboardPostGALeaderboardsTab() {
  const { t } = useTranslation();

  useRegisterPrototypeNotes({
    id: 'post-ga-leaderboards',
    title: t('Leaderboards'),
    content: <PostGaHighlightsPrototypeNote defaultOpen />,
  });

  return (
    <Scrollable marginLeft={20} marginRight={20} marginBottom={16} marginTop={16}>
      <AutomationDashboardLeaderboards />
    </Scrollable>
  );
}
