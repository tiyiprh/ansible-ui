import { PageLayout, PageTable } from '@ansible/ansible-ui-framework';
import {
  PageActionSelection,
  PageActionType,
} from '@ansible/ansible-ui-framework/PageActions/PageAction';
import { useGet } from '@ansible/common-ui/crud/useGet';
import { ButtonVariant } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { edaAPI } from '../../common/eda-utils';
import { useEdaView } from '../../common/useEventDrivenView';
import { EdaActivationInstance } from '../../interfaces/EdaActivationInstance';
import { EdaRulebookActivation } from '../../interfaces/EdaRulebookActivation';
import { useClearLogs } from '../hooks/useClearLogs';
import { useActivationHistoryColumns } from '../hooks/useActivationHistoryColumns';
import { useActivationHistoryFilters } from '../hooks/useActivationHistoryFilters';

export function RulebookActivationHistory() {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();

  const toolbarFilters = useActivationHistoryFilters();
  const { data: activation } = useGet<EdaRulebookActivation>(
    edaAPI`/activations/${params?.id || ''}/`
  );
  const clearLogs = useClearLogs();

  const tableColumns = useActivationHistoryColumns();
  const view = useEdaView<EdaActivationInstance>({
    url: edaAPI`/activations/${params?.id || ''}/instances/`,
    toolbarFilters,
    tableColumns,
  });
  const toolbarActions = useMemo(
    () =>
      activation
        ? [
            {
              type: PageActionType.Button,
              selection: PageActionSelection.None,
              label: t('Clear logs'),
              isPinned: true,
              variant: ButtonVariant.secondary,
              isDanger: true,
              onClick: () =>
                clearLogs([
                  {
                    id: activation.id,
                    name: activation.name,
                    scope: 'activation',
                  },
                ]),
            },
          ]
        : [],
    [activation, clearLogs, t]
  );
  return (
    <PageLayout>
      <PageTable
        tableColumns={tableColumns}
        toolbarFilters={toolbarFilters}
        toolbarActions={toolbarActions}
        errorStateTitle={t('Error loading history')}
        emptyStateTitle={t('No activation history')}
        emptyStateIcon={CubesIcon}
        emptyStateDescription={t('No history for this rulebook activation')}
        {...view}
        defaultSubtitle={t('Rulebook Activation History')}
      />
    </PageLayout>
  );
}
