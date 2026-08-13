import { Scrollable } from '@ansible/ansible-ui-framework/components/Scrollable';
import { useTranslation } from 'react-i18next';
import { useRegisterPrototypeNotes } from '../../../../../platform/common/PrototypeNotesRegistry';
import { AutomationDashboardHighlights } from './AutomationDashboardHighlights';
import { PostGaHighlightsPrototypeNote } from './PostGaPrototypeNotes';

export function AutomationDashboardPostGAHighlightsTab() {
  const { t } = useTranslation();

  useRegisterPrototypeNotes({
    id: 'post-ga-highlights',
    title: t('Highlights'),
    content: <PostGaHighlightsPrototypeNote defaultOpen />,
  });

  return (
    <Scrollable marginLeft={20} marginRight={20} marginBottom={16} marginTop={16}>
      <AutomationDashboardHighlights />
    </Scrollable>
  );
}
