/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PageTable, usePageNavigate } from '../../../../../framework';
import { DetailInfo } from '../../../../../framework/components/DetailInfo';
import { AwxRoute } from '../../../AwxRoutes';
import { Team } from '../../../interfaces/Team';
import { useAwxView } from '../../../useAwxView';
import { useTeamsColumns } from '../../teams/hooks/useTeamsColumns';
import { useTeamsFilters } from '../../teams/hooks/useTeamsFilters';

export function OrganizationTeams() {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();
  const pageHistory = usePageNavigate();
  const toolbarFilters = useTeamsFilters();
  const tableColumns = useTeamsColumns({ hideDescription: true, includeOrganizationRole: true });
  const view = useAwxView<Team>({
    url: `/api/v2/organizations/${params.id}/teams/`,
    toolbarFilters,
    tableColumns,
    disableQueryString: true,
  });
  return (
    <>
      <DetailInfo
        title={t(
          'Adding a team to an organization adds it as a member only. Permissions can be granted using teams and user roles.'
        )}
      />
      <PageTable<Team>
        id="awx-teams-table"
        toolbarFilters={toolbarFilters}
        tableColumns={tableColumns}
        errorStateTitle={t('Error loading teams')}
        emptyStateTitle={t('No teams yet')}
        emptyStateDescription={t('To get started, create a team.')}
        emptyStateButtonText={t('Create team')}
        emptyStateButtonClick={() => pageHistory(AwxRoute.CreateTeam)}
        {...view}
      />
    </>
  );
}
