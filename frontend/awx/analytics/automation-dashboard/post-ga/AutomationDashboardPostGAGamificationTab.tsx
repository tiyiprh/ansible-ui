import { Scrollable } from '@ansible/ansible-ui-framework/components/Scrollable';
import { useTranslation } from 'react-i18next';
import { useRegisterPrototypeNotes } from '../../../../../platform/common/PrototypeNotesRegistry';
import { AutomationDashboardGamificationHighlights } from './AutomationDashboardGamificationHighlights';
import { PostGaGamificationPrototypeNote } from './PostGaPrototypeNotes';

export function AutomationDashboardPostGAGamificationTab() {
  const { t } = useTranslation();

  useRegisterPrototypeNotes({
    id: 'post-ga-gamification',
    title: t('Gamification (concepts)'),
    content: <PostGaGamificationPrototypeNote defaultOpen />,
  });

  return (
    <Scrollable marginLeft={20} marginRight={20} marginBottom={16} marginTop={16}>
      <AutomationDashboardGamificationHighlights />
    </Scrollable>
  );
}
