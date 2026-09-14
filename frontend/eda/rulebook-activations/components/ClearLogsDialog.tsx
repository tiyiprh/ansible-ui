import {
  Button,
  Checkbox,
  DatePicker,
  Flex,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  NumberInput,
  Radio,
  Stack,
} from '@patternfly/react-core';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export type ClearLogsTarget = Readonly<{
  id: number;
  name: string;
  scope: 'activation' | 'instance';
}>;

export type ClearLogsOptions = Readonly<{
  mode: 'date' | 'days';
  date: string;
  days: number;
}>;

interface ClearLogsDialogProps {
  targets: readonly ClearLogsTarget[];
  onClose: () => void;
  onConfirm: (options: ClearLogsOptions) => void;
}

export function ClearLogsDialog({ targets, onClose, onConfirm }: ClearLogsDialogProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'date' | 'days'>('days');
  const [date, setDate] = useState('');
  const [days, setDays] = useState(7);
  const [confirmed, setConfirmed] = useState(false);

  const isValid = confirmed && (mode === 'days' ? days > 0 : date.length > 0);
  const scopeText =
    targets.length === 1 ? targets[0].name : t('{{count}} activations', { count: targets.length });

  return (
    <Modal variant={ModalVariant.medium} isOpen onClose={onClose} aria-label={t('Clear logs')}>
      <ModalHeader
        title={t('Clear logs?')}
        description={
          <Trans
            i18nKey="Removes stored logs for <strong>{{scope}}</strong>. The activation keeps running. Container logs are not affected. Logs outside this window remain unchanged. This cannot be undone."
            values={{ scope: scopeText }}
            components={{ strong: <strong /> }}
          />
        }
      />
      <ModalBody>
        <Form>
          <FormGroup fieldId="clear-logs-period">
            <Stack hasGutter>
              <Flex
                alignItems={{ default: 'alignItemsCenter' }}
                spaceItems={{ default: 'spaceItemsSm' }}
              >
                <Radio
                  id="clear-logs-older-than"
                  name="clear-logs-period"
                  label={t('Older than')}
                  isChecked={mode === 'date'}
                  onChange={() => setMode('date')}
                />
                <DatePicker
                  value={date}
                  onChange={(_event, value) => setDate(value)}
                  isDisabled={mode !== 'date'}
                  aria-label={t('Clear logs older than')}
                  placeholder="YYYY-MM-DD"
                />
              </Flex>
              <Flex
                alignItems={{ default: 'alignItemsCenter' }}
                spaceItems={{ default: 'spaceItemsSm' }}
              >
                <Radio
                  id="clear-logs-keep-days"
                  name="clear-logs-period"
                  label={t('Keep last')}
                  isChecked={mode === 'days'}
                  onChange={() => setMode('days')}
                />
                <NumberInput
                  value={days}
                  min={1}
                  onMinus={() => setDays((value) => Math.max(1, value - 1))}
                  onPlus={() => setDays((value) => value + 1)}
                  onChange={(event) => setDays(Math.max(1, Number(event.currentTarget.value) || 1))}
                  isDisabled={mode !== 'days'}
                  inputAriaLabel={t('Days to keep')}
                />
                <span>{t('days')}</span>
              </Flex>
            </Stack>
          </FormGroup>
          <Checkbox
            id="clear-logs-confirm"
            label={t('I understand that clearing logs cannot be undone.')}
            isChecked={confirmed}
            onChange={(_event, checked) => setConfirmed(checked)}
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="danger"
          onClick={() => onConfirm({ mode, date, days })}
          isDisabled={!isValid}
        >
          {t('Clear logs')}
        </Button>
        <Button variant="link" onClick={onClose}>
          {t('Cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
