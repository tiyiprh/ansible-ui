import { usePageDialog } from '@ansible/ansible-ui-framework';
import { postRequest } from '@ansible/common-ui/crud/Data';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { edaAPI } from '../../common/eda-utils';
import { useEdaBulkActionDialog } from '../../common/useEdaBulkActionDialog';
import { ClearLogsDialog, ClearLogsOptions, ClearLogsTarget } from '../components/ClearLogsDialog';

export function useClearLogs() {
  const { t } = useTranslation();
  const [, setDialog] = usePageDialog();
  const progressDialog = useEdaBulkActionDialog<ClearLogsTarget>();
  const actionColumns = useMemo(
    () => [{ header: t('Name'), cell: (target: ClearLogsTarget) => target.name }],
    [t]
  );

  const startClearLogs = useCallback(
    (targets: readonly ClearLogsTarget[], options: ClearLogsOptions) => {
      setDialog(undefined);
      progressDialog({
        title: t('Clearing logs'),
        description: t(
          'Removing stored logs. Activations continue running, and container logs are not affected.'
        ),
        processingText: t('Clearing logs...'),
        isDanger: true,
        items: [...targets],
        keyFn: (target) => `${target.scope}-${target.id}`,
        actionColumns,
        actionFn: (target, signal) =>
          postRequest(
            target.scope === 'activation'
              ? edaAPI`/activations/${target.id.toString()}/clear-logs/`
              : edaAPI`/activation-instances/${target.id.toString()}/clear-logs/`,
            options.mode === 'date' ? { older_than: options.date } : { keep_days: options.days },
            signal
          ),
      });
    },
    [actionColumns, progressDialog, setDialog, t]
  );

  return useCallback(
    (targets: readonly ClearLogsTarget[]) => {
      setDialog(
        <ClearLogsDialog
          targets={targets}
          onClose={() => setDialog(undefined)}
          onConfirm={(options) => startClearLogs(targets, options)}
        />
      );
    },
    [setDialog, startClearLogs]
  );
}
