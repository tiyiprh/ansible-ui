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
  mode: 'all' | 'date' | 'days';
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
  const [mode, setMode] = useState<'all' | 'date' | 'days'>('all');
  const [date, setDate] = useState('');
  const [days, setDays] = useState(7);
  const [confirmed, setConfirmed] = useState(false);

  const isValid = confirmed && (mode === 'all' || (mode === 'days' ? days > 0 : date.length > 0));
  const activationNames = targets.map((target) => target.name);
  const scopeText =
    activationNames.length >= 5
      ? t('This deletes stored database logs for {{count}} selected activations.', {
          count: activationNames.length,
        })
      : activationNames.length === 1
        ? activationNames[0]
        : activationNames.length === 2
          ? `${activationNames[0]} ${t('and')} ${activationNames[1]}`
          : `${activationNames.slice(0, -1).join(', ')}, ${t('and')} ${activationNames[activationNames.length - 1]}`;

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen
      onClose={onClose}
      aria-label={t('Permanently delete logs')}
    >
      <ModalHeader
        title={t('Permanently delete logs')}
        titleIconVariant="warning"
        description={
          activationNames.length >= 5 ? (
            <>
              {scopeText}{' '}
              {t(
                'Rulebook activations will continue running, and system logs on activation workers remain unaffected.'
              )}
            </>
          ) : (
            <Trans
              i18nKey="This deletes stored database logs for <strong>{{scope}}</strong>. Rulebook activations will continue running, and system logs on activation workers remain unaffected."
              values={{ scope: scopeText }}
              components={{ strong: <strong /> }}
            />
          )
        }
      />
      <ModalBody>
        <Form>
          <FormGroup fieldId="clear-logs-period">
            <Stack hasGutter>
              <Radio
                id="delete-logs-all"
                name="delete-logs-period"
                label={t('Delete all logs')}
                isChecked={mode === 'all'}
                onChange={() => setMode('all')}
              />
              <Flex
                alignItems={{ default: 'alignItemsCenter' }}
                spaceItems={{ default: 'spaceItemsSm' }}
              >
                <Radio
                  id="delete-logs-older-than"
                  name="delete-logs-period"
                  label={t('Delete logs older than')}
                  isChecked={mode === 'date'}
                  onChange={() => setMode('date')}
                />
                <DatePicker
                  value={date}
                  onChange={(_event, value) => setDate(value)}
                  isDisabled={mode !== 'date'}
                  aria-label={t('Delete logs older than date')}
                  placeholder="YYYY-MM-DD"
                />
              </Flex>
              <Flex
                alignItems={{ default: 'alignItemsCenter' }}
                spaceItems={{ default: 'spaceItemsSm' }}
              >
                <Radio
                  id="delete-logs-keep-days"
                  name="delete-logs-period"
                  label={t('Delete logs older than')}
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
            label={t(
              'Yes, I confirm that I want to permanently delete these logs. This action cannot be undone.'
            )}
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
          {t('Delete logs')}
        </Button>
        <Button variant="link" onClick={onClose}>
          {t('Cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
