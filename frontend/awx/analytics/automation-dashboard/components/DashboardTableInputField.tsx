import {
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  NumberInput,
} from '@patternfly/react-core';
import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { DashboardTableInputFieldProps } from '../types';
import { Help } from '@ansible/ansible-ui-framework';
import { useTranslation } from 'react-i18next';
import debounce from 'debounce';

export function DashboardTableInputField(props: DashboardTableInputFieldProps) {
  const {
    id,
    min,
    max,
    label,
    labelHelp,
    fullWidth,
    type,
    readOnly,
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
    // Cancel any previously scheduled save by replacing it with undefined.
    // If the debounce fires with undefined, onChange is not called (see setValueDebounced above).
    // A new valid save is rescheduled at the bottom if validation passes.
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

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <FormGroup
        fieldId={id}
        label={label}
        labelHelp={labelHelp ? <Help title={label} help={labelHelp} /> : undefined}
        style={{ gridColumn: fullWidth ? 'span 24' : undefined }}
        aria-invalid={error ? 'true' : 'false'}
      >
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
          inputAriaLabel={label}
          inputProps={{
            id,
            'data-testid': id,
            autoComplete: 'off',
            'aria-describedby': id ? `${id}-form-group` : undefined,
          }}
        />
        {(error || errorMsg) && (
          <FormHelperText>
            <HelperText>
              <HelperTextItem variant={'error'}>{error ?? errorMsg}</HelperTextItem>
            </HelperText>
          </FormHelperText>
        )}
      </FormGroup>
    </Form>
  );
}
