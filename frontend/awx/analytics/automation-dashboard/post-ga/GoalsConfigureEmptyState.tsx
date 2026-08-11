import { useGetPageUrl } from '@ansible/ansible-ui-framework';
import { EmptyStateCustom } from '@ansible/ansible-ui-framework/components/EmptyStateCustom';
import { Button } from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PlatformRoute } from '../../../../../platform/main/PlatformRoutes';

type GoalsConfigureEmptyStateProps = Readonly<{
  title: string;
  description: string;
}>;

export function GoalsConfigureEmptyState({ title, description }: GoalsConfigureEmptyStateProps) {
  const { t } = useTranslation();
  const getPageUrl = useGetPageUrl();
  const settingsEditUrl = `${getPageUrl(PlatformRoute.AutomationDashboardSettings)}/edit`;

  return (
    <EmptyStateCustom
      variant="sm"
      icon={CubesIcon}
      title={title}
      description={description}
      style={{ paddingBlock: 'var(--pf-t--global--spacer--lg)' }}
      button={
        <Link to={settingsEditUrl}>
          <Button variant="primary">{t('Configure goals')}</Button>
        </Link>
      }
    />
  );
}
