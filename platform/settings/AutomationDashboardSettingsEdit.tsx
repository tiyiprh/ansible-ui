import { PageFormTextInput, PageHeader, PageLayout } from '@ansible/ansible-ui-framework';
import { PageFormSection } from '@ansible/ansible-ui-framework/PageForm/Utils/PageFormSection';
import {
  Button,
  Content,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useRegisterPrototypeNotes } from '../common/PrototypeNotesRegistry';
import {
  clearGoals,
  loadGoals,
  saveGoals,
} from '../../frontend/awx/analytics/automation-dashboard/post-ga/dashboardSettingsUtils';
import { AutomationDashboardSettingsPrototypeNote } from '../../frontend/awx/analytics/automation-dashboard/post-ga/PostGaPrototypeNotes';
import { PlatformPageForm } from '../common/PlatformPageForm';

type AutomationDashboardSettingsForm = {
  quarterlyRunTarget: number | '';
  monthlySavingsTarget: number | '';
};

export function AutomationDashboardSettingsEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const savedGoals = loadGoals();

  useRegisterPrototypeNotes({
    id: 'automation-dashboard-settings',
    title: t('Dashboard settings'),
    content: <AutomationDashboardSettingsPrototypeNote defaultOpen />,
  });

  const defaultValue: AutomationDashboardSettingsForm = {
    quarterlyRunTarget: savedGoals?.quarterlyRunTarget ?? '',
    monthlySavingsTarget: savedGoals?.monthlySavingsTarget ?? '',
  };

  const handleSubmit = async (values: AutomationDashboardSettingsForm) => {
    saveGoals({
      quarterlyRunTarget: Number(values.quarterlyRunTarget),
      monthlySavingsTarget: Number(values.monthlySavingsTarget),
    });
    void navigate('..');
  };

  return (
    <PageLayout>
      <PageHeader
        title={t('Dashboard')}
        titleHelpTitle={t('Dashboard')}
        titleHelp={t(
          'Configure automation goals for your Automation Dashboard.'
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
              void navigate('..', { replace: true });
            }}
          >
            {t('Reset to defaults')}
          </Button>
        }
      >
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
      </PlatformPageForm>
    </PageLayout>
  );
}
