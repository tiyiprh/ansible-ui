import {
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  NumberInput,
  TextInput,
} from '@patternfly/react-core';
import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { DashboardTableInputFieldProps } from '../types';
import { Help } from '@ansible/ansible-ui-framework';
import { useTranslation } from 'react-i18next';
import debounce from 'debounce';
import { DisabledControlTooltip } from './DisabledControlTooltip';

export function DashboardTableInputField(props: Readonly<DashboardTableInputFieldProps>) {
  const {
    id,
    min,
    max,
    label,
    labelHelp,
    fullWidth,
    type,
    inputVariant = 'textInput',
    readOnly,
    readOnlyReason,
    reserveErrorSpace,
    error: errorMsg,
    onChange,
  } = props;
  const { t } = useTranslation();
  const [value, setValue] = useState<string | number | undefined>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(props.value);
    setError(null);
  }, [props.value]);

  const setValueDebounced = useMemo(
    () =>
      debounce((newValue: number | undefined) => {
        if (newValue !== undefined) {
          onChange(newValue);
        }
      }, 600),
    [onChange]
  );

  useEffect(() => () => setValueDebounced.clear(), [setValueDebounced]);

  const onChangeHandler = (newValue: string) => {
    setValueDebounced(undefined);
    setError(null);
    setValue(newValue);
    const numberValue = Number(newValue);
    if (newValue === '' || Number.isNaN(numberValue)) {
      setError(t('Please enter a valid number.'));
      return;
    }
    if (type === 'integer' && !Number.isInteger(numberValue)) {
      setError(t('Please enter a valid integer.'));
      return;
    }
    if (max !== undefined && numberValue > max) {
      setError(t('Value must be less than or equal to {{max}}.', { max }));
      return;
    }
    if (min !== undefined && numberValue < min) {
      setError(t('Value must be greater than or equal to {{min}}.', { min }));
      return;
    }
    setValueDebounced(numberValue);
  };

  const numberInputValue: number | '' =
    value === '' || value === undefined ? '' : Number(value);

  const handlePlus = (_event: MouseEvent, _name?: string) => {
    if (readOnly === true) {
      return;
    }
    const current = Number(value);
    if (Number.isNaN(current)) {
      return;
    }
    const next = max !== undefined ? Math.min(current + 1, max) : current + 1;
    onChangeHandler(String(next));
  };

  const handleMinus = (_event: MouseEvent, _name?: string) => {
    if (readOnly === true) {
      return;
    }
    const current = Number(value);
    if (Number.isNaN(current)) {
      return;
    }
    const next = min !== undefined ? Math.max(current - 1, min) : current - 1;
    onChangeHandler(String(next));
  };

  const inputControl =
    inputVariant === 'numberInput' ? (
      <NumberInput
        value={numberInputValue}
        min={min}
        max={max}
        isDisabled={readOnly === true}
        validated={error || errorMsg ? 'error' : 'default'}
        onChange={(event) => {
          onChangeHandler((event.target as HTMLInputElement).value);
        }}
        onPlus={handlePlus}
        onMinus={handleMinus}
        inputName={id}
        inputAriaLabel={label ?? id}
        inputProps={{
          id,
          'data-testid': id,
          autoComplete: 'off',
          'aria-describedby': id ? `${id}-form-group` : undefined,
        }}
      />
    ) : (
      <TextInput
        id={id}
        data-testid={id}
        type="number"
        value={value === undefined ? '' : String(value)}
        min={min}
        max={max}
        isDisabled={readOnly === true}
        validated={error || errorMsg ? 'error' : 'default'}
        autoComplete="off"
        aria-describedby={id ? `${id}-form-group` : undefined}
        aria-label={label ?? id}
        onChange={(_event, textValue) => {
          onChangeHandler(textValue);
        }}
      />
    );

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <FormGroup
        fieldId={id}
        label={label}
        labelHelp={labelHelp ? <Help title={label} help={labelHelp} /> : undefined}
        style={{ gridColumn: fullWidth ? 'span 24' : undefined }}
        aria-invalid={error ? 'true' : 'false'}
      >
        <DisabledControlTooltip
          isDisabled={readOnly === true}
          content={readOnlyReason}
        >
          {inputControl}
        </DisabledControlTooltip>
        {(error || errorMsg || reserveErrorSpace) && (
          <FormHelperText>
            {error || errorMsg ? (
              <HelperText>
                <HelperTextItem variant={'error'}>{error ?? errorMsg}</HelperTextItem>
              </HelperText>
            ) : (
              <HelperText aria-hidden="true">
                <HelperTextItem>&nbsp;</HelperTextItem>
              </HelperText>
            )}
          </FormHelperText>
        )}
      </FormGroup>
    </Form>
  );
}
