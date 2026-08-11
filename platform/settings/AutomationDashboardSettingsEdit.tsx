import { PageFormTextInput, PageHeader, PageLayout } from '@ansible/ansible-ui-framework';
import { PageFormSection } from '@ansible/ansible-ui-framework/PageForm/Utils/PageFormSection';
import {
  Button,
  Content,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
} from '@patternfly/react-core';
import { PlusCircleIcon, TrashIcon } from '@patternfly/react-icons';
import { useEffect } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  clearGoals,
  loadGoals,
  saveGoals,
} from '../../frontend/awx/analytics/automation-dashboard/post-ga/dashboardSettingsUtils';
import {
  DEFAULT_LEVELS,
  loadMaturityLevels,
  MaturityLevel,
  saveMaturityLevels,
} from '../../frontend/awx/analytics/automation-dashboard/post-ga/maturityUtils';
import '../../frontend/awx/analytics/automation-dashboard/post-ga/postGa.css';
import { AutomationDashboardSettingsPrototypeNote } from '../../frontend/awx/analytics/automation-dashboard/post-ga/PostGaPrototypeNotes';
import { PlatformPageForm } from '../common/PlatformPageForm';

type AutomationDashboardSettingsForm = {
  quarterlyRunTarget: number | '';
  monthlySavingsTarget: number | '';
  adoptionLevels: MaturityLevel[];
};

function AdoptionLevelsInputs() {
  const { t } = useTranslation();
  const { control } = useFormContext<AutomationDashboardSettingsForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'adoptionLevels',
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ name: '', description: '' });
    }
  }, [append, fields.length]);

  return (
    <PageFormSection title={t('Adoption levels')} singleColumn>
      <Content
        component="p"
        style={{
          marginBottom: 'var(--pf-t--global--spacer--md)',
          gridColumn: '1 / -1',
        }}
      >
        {t(
          'Define the maturity levels used to score automation adoption on the Highlights tab. The default five levels follow a common industry maturity model; you can customize names and descriptions.'
        )}
      </Content>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="post-ga-adoption-level-row"
          style={{
            gridTemplateColumns: '30% 1fr auto',
            alignItems: 'end',
          }}
        >
          <Controller
            name={`adoptionLevels.${index}.name`}
            control={control}
            rules={{ required: t('Name is required') }}
            render={({ field: inputField, fieldState: { error } }) => (
              <FormGroup
                label={t('Level {{n}} name', { n: index + 1 })}
                fieldId={`adoption-level-${index}-name`}
                isRequired
              >
                <TextInput
                  {...inputField}
                  id={`adoption-level-${index}-name`}
                  placeholder={t('Enter name')}
                />
                {error ? (
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem variant="error">{error.message}</HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                ) : null}
              </FormGroup>
            )}
          />
          <Controller
            name={`adoptionLevels.${index}.description`}
            control={control}
            render={({ field: inputField }) => (
              <FormGroup label={t('Description')} fieldId={`adoption-level-${index}-description`}>
                <TextInput
                  {...inputField}
                  id={`adoption-level-${index}-description`}
                  placeholder={t('Enter description')}
                />
              </FormGroup>
            )}
          />
          <div style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
            <Button
              icon={<PlusCircleIcon />}
              type="button"
              variant="plain"
              aria-label={t('Add row')}
              onClick={() => append({ name: '', description: '' })}
            />
            <Button
              icon={<TrashIcon />}
              type="button"
              variant="plain"
              aria-label={t('Delete row')}
              isDisabled={fields.length <= 5}
              onClick={() => remove(index)}
            />
          </div>
        </div>
      ))}
    </PageFormSection>
  );
}

export function AutomationDashboardSettingsEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const savedGoals = loadGoals();

  const defaultValue: AutomationDashboardSettingsForm = {
    quarterlyRunTarget: savedGoals?.quarterlyRunTarget ?? '',
    monthlySavingsTarget: savedGoals?.monthlySavingsTarget ?? '',
    adoptionLevels: loadMaturityLevels().map((level) => ({ ...level })),
  };

  const handleSubmit = async (values: AutomationDashboardSettingsForm) => {
    saveGoals({
      quarterlyRunTarget: Number(values.quarterlyRunTarget),
      monthlySavingsTarget: Number(values.monthlySavingsTarget),
    });
    saveMaturityLevels(
      values.adoptionLevels.filter((level) => level.name.trim().length > 0)
    );
    void navigate('..');
  };

  return (
    <PageLayout>
      <PageHeader
        title={t('Dashboard')}
        titleHelpTitle={t('Dashboard')}
        titleHelp={t(
          'Configure automation goals and adoption levels for your Automation Dashboard.'
        )}
        titleHeadingLevel="h2"
      />
      <PlatformPageForm<AutomationDashboardSettingsForm>
        defaultValue={defaultValue}
        submitText={t('Save')}
        onSubmit={handleSubmit}
        onCancel={() => void navigate('..')}
        additionalActions={
          <Button
            variant="secondary"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              clearGoals();
              saveMaturityLevels(DEFAULT_LEVELS.map((level) => ({ ...level })));
              void navigate('..', { replace: true });
            }}
          >
            {t('Reset to defaults')}
          </Button>
        }
      >
        <div style={{ gridColumn: '1 / -1' }}>
          <AutomationDashboardSettingsPrototypeNote />
        </div>
        <PageFormSection title={t('Automation goals')}>
          <Content
            component="p"
            style={{
              marginBottom: 'var(--pf-t--global--spacer--md)',
              gridColumn: '1 / -1',
            }}
          >
            {t(
              'Set organization-specific targets for job run volume and cost savings. These values appear on the Highlights tab once configured. Many teams base targets on prior-quarter volume or savings from the Cost calculation section.'
            )}
          </Content>
          <PageFormTextInput<AutomationDashboardSettingsForm>
            name="quarterlyRunTarget"
            type="number"
            label={t('Quarterly run target')}
            labelHelp={t(
              'Enter your organization’s target job runs for the current quarter. Many teams start from prior-quarter volume or a 10–20% growth target.'
            )}
            placeholder={t('Enter target')}
            isRequired
            min={1}
          />
          <PageFormTextInput<AutomationDashboardSettingsForm>
            name="monthlySavingsTarget"
            type="number"
            label={t('Monthly savings target')}
            labelHelp={t(
              'Enter your target monthly savings in USD. Base this on your labor rate and automation volume from the Cost calculation section.'
            )}
            placeholder={t('Enter target')}
            isRequired
            min={1}
          />
        </PageFormSection>
        <AdoptionLevelsInputs />
      </PlatformPageForm>
    </PageLayout>
  );
}
