import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ITableColumn } from '../../../../../framework';
import { RouteObj } from '../../../../common/Routes';
import {
  useCreatedColumn,
  useDescriptionColumn,
  useIdColumn,
  useModifiedColumn,
  useNameColumn,
  useOrganizationNameColumn,
} from '../../../../common/columns';
import { Team } from '../../../interfaces/Team';

export function useTeamsColumns(options?: {
  disableLinks?: boolean;
  disableSort?: boolean;
  hideDescription?: boolean;
  includeOrganizationRole?: boolean;
}) {
  const { t } = useTranslation();
  const history = useNavigate();
  const nameColumnClick = useCallback(
    (team: Team) => {
      void history(RouteObj.TeamDetails.replace(':id', team.id.toString()));
    },
    [history]
  );
  const idColumn = useIdColumn();
  const nameColumn = useNameColumn({ header: t('Team'), ...options, onClick: nameColumnClick });
  const descriptionColumn = useDescriptionColumn();

  const organizationColumn = useOrganizationNameColumn(options);
  const organizationRoleColumn = useMemo<ITableColumn<Team>>(
    () => ({
      header: t('Organization role'),
      type: 'text',
      value: (team) => team.summary_fields?.object_roles?.member_role?.name,
    }),
    [t]
  );
  const createdColumn = useCreatedColumn(options);
  const modifiedColumn = useModifiedColumn(options);
  const tableColumns = useMemo<ITableColumn<Team>[]>(
    () =>
      [
        idColumn,
        nameColumn,
        organizationColumn,
        options?.includeOrganizationRole ? organizationRoleColumn : undefined,
        options?.hideDescription ? undefined : descriptionColumn,
        createdColumn,
        modifiedColumn,
      ].filter(Boolean) as ITableColumn<Team>[],
    [
      createdColumn,
      descriptionColumn,
      idColumn,
      modifiedColumn,
      nameColumn,
      options?.hideDescription,
      options?.includeOrganizationRole,
      organizationColumn,
      organizationRoleColumn,
    ]
  );
  return tableColumns;
}
