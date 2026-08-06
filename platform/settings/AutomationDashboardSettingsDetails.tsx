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
import { ButtonVariant, Form, Grid, GridItem, PageSection } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  hasConfiguredGoals,
  loadGoals,
} from '../../frontend/awx/analytics/automation-dashboard/post-ga/dashboardSettingsUtils';
import { loadMaturityLevels } from '../../frontend/awx/analytics/automation-dashboard/post-ga/maturityUtils';
import { AutomationDashboardSettingsPrototypeNote } from '../../frontend/awx/analytics/automation-dashboard/post-ga/PostGaPrototypeNotes';

const readOnlyValueStyle = { opacity: 0.8 } as const;

export function AutomationDashboardSettingsDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goals = loadGoals();
  const levels = loadMaturityLevels();

  const description = t(
    'Configure settings for the Automation Dashboard. These settings apply to automation goals and adoption level names and descriptions.'
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
        title={t('Automation Dashboard Settings')}
        titleHelpTitle={t('Automation Dashboard Settings')}
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
          <AutomationDashboardSettingsPrototypeNote />
          <Form style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <PageFormGrid>
              <PageFormSection title={t('Automation goals')}>
                <PageFormGroup
                  fieldId="quarterly-run-target"
                  label={t('Quarterly run target')}
                  labelHelpTitle={t('Quarterly run target')}
                  labelHelp={t('Enterprise-wide target for automation job runs this quarter.')}
                >
                  <span style={readOnlyValueStyle}>
                    {hasConfiguredGoals() && goals ? goals.quarterlyRunTarget.toLocaleString() : '—'}
                  </span>
                </PageFormGroup>
                <PageFormGroup
                  fieldId="monthly-savings-target"
                  label={t('Monthly savings target')}
                  labelHelpTitle={t('Monthly savings target')}
                  labelHelp={t('Target monthly cost savings from automation.')}
                >
                  <span style={readOnlyValueStyle}>
                    {hasConfiguredGoals() && goals
                      ? `$${goals.monthlySavingsTarget.toLocaleString()}`
                      : '—'}
                  </span>
                </PageFormGroup>
              </PageFormSection>
              <PageFormSection title={t('Adoption levels')} singleColumn>
                <Grid hasGutter>
                  {levels.map((level, index) => (
                    <Fragment key={`${level.name}-${index}`}>
                      <GridItem sm={12} md={6} lg={6} xl={6} xl2={4}>
                        <PageFormGroup
                          fieldId={`adoption-level-${index}-name`}
                          label={t('Level {{n}} name', { n: index + 1 })}
                        >
                          <span style={readOnlyValueStyle}>{level.name}</span>
                        </PageFormGroup>
                      </GridItem>
                      <GridItem sm={12} md={6} lg={6} xl={6} xl2={8}>
                        <PageFormGroup
                          fieldId={`adoption-level-${index}-description`}
                          label={t('Description')}
                        >
                          <span style={readOnlyValueStyle}>{level.description}</span>
                        </PageFormGroup>
                      </GridItem>
                    </Fragment>
                  ))}
                </Grid>
              </PageFormSection>
            </PageFormGrid>
          </Form>
        </PageSection>
      </Scrollable>
    </PageLayout>
  );
}
