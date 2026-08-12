import {
  IPageAction,
  PageActionSelection,
  PageActionType,
  PageActions,
  PageHeader,
  PageLayout,
  Scrollable,
} from '@ansible/ansible-ui-framework';
import { PageFormGroup } from '@ansible/ansible-ui-framework/PageForm/Inputs/PageFormGroup';
import { PageFormGrid } from '@ansible/ansible-ui-framework/PageForm/PageForm';
import { PageFormSection } from '@ansible/ansible-ui-framework/PageForm/Utils/PageFormSection';
import { ButtonVariant, Form, PageSection } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useRegisterPrototypeNotes } from '../common/PrototypeNotesRegistry';
import {
  hasConfiguredGoals,
  loadGoals,
} from '../../frontend/awx/analytics/automation-dashboard/post-ga/dashboardSettingsUtils';
import { AutomationDashboardSettingsPrototypeNote } from '../../frontend/awx/analytics/automation-dashboard/post-ga/PostGaPrototypeNotes';

const readOnlyValueStyle = { opacity: 0.8 } as const;

export function AutomationDashboardSettingsDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goals = loadGoals();

  useRegisterPrototypeNotes({
    id: 'automation-dashboard-settings',
    title: t('Dashboard settings'),
    content: <AutomationDashboardSettingsPrototypeNote defaultOpen />,
  });

  const description = t(
    'Configure automation goals for your Automation Dashboard. These values appear on the Highlights tab.'
  );

  const actions = useMemo<IPageAction<object>[]>(
    () => [
      {
        type: PageActionType.Button,
        selection: PageActionSelection.None,
        variant: ButtonVariant.primary,
        icon: PencilAltIcon,
        label: t('Edit'),
        onClick: () => void navigate('./edit'),
        isPinned: true,
      },
    ],
    [navigate, t]
  );

  return (
    <PageLayout>
      <PageHeader
        title={t('Dashboard')}
        titleHelpTitle={t('Dashboard')}
        titleHelp={description}
        titleHeadingLevel="h2"
        headerActions={<PageActions actions={actions} position="right" />}
      />
      <Scrollable marginLeft={24}>
        <PageSection
          isFilled
          isWidthLimited
          padding={{ default: 'padding' }}
          style={{ paddingBottom: 'var(--pf-t--global--spacer--xl)' }}
        >
          <Form style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <PageFormGrid>
              <PageFormSection title={t('Automation goals')}>
                <PageFormGroup
                  fieldId="quarterly-run-target"
                  label={t('Quarterly run target')}
                  labelHelpTitle={t('Quarterly run target')}
                  labelHelp={t('Target number of automation job runs for your organization this quarter.')}
                >
                  <span style={readOnlyValueStyle}>
                    {hasConfiguredGoals() && goals ? goals.quarterlyRunTarget.toLocaleString() : '—'}
                  </span>
                </PageFormGroup>
                <PageFormGroup
                  fieldId="monthly-savings-target"
                  label={t('Monthly savings target')}
                  labelHelpTitle={t('Monthly savings target')}
                  labelHelp={t('Target monthly cost savings from automation in USD.')}
                >
                  <span style={readOnlyValueStyle}>
                    {hasConfiguredGoals() && goals
                      ? `$${goals.monthlySavingsTarget.toLocaleString()}`
                      : '—'}
                  </span>
                </PageFormGroup>
              </PageFormSection>
            </PageFormGrid>
          </Form>
        </PageSection>
      </Scrollable>
    </PageLayout>
  );
}
