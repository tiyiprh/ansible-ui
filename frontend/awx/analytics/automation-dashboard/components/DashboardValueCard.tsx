import { PageDashboardCard } from '@ansible/ansible-ui-framework';
import { Content, Flex, FlexItem } from '@patternfly/react-core';
import { DashboardValueCardProps } from '../types';
import { Link } from 'react-router-dom';
import { EmptyStateError } from '../../../../../framework/components/EmptyStateError';
import { currencyFormatter } from '../../utilities/currencyFormatter';
import { DEFAULT_NUMBER_LOCALE } from '../constants/common';
import { DashboardSectionHeading } from '../post-ga/DashboardSectionHeading';

export function DashboardValueCard(props: DashboardValueCardProps) {
  const {
    id,
    title,
    help,
    value,
    linkText,
    to,
    valueSuffix,
    error,
    errorStateTitle,
    formatAsCurrency,
    width,
    titleVariant = 'card',
  } = props;

  const contentValue =
    typeof value === 'number' ? (
      <span
        style={{
          fontSize: width === 'xs' ? 'x-large' : 'xx-large',
          fontWeight: '400',
          lineHeight: 1,
          marginTop: 'auto',
        }}
      >
        {formatAsCurrency ? currencyFormatter(value) : value.toLocaleString(DEFAULT_NUMBER_LOCALE)}
        {valueSuffix ? ` ${valueSuffix}` : ''}
      </span>
    ) : (
      <span style={{ fontSize: 'large', fontWeight: '400', lineHeight: 1, marginTop: 'auto' }}>
        {value}
        {valueSuffix ? ` ${valueSuffix}` : ''}
      </span>
    );

  const bodyContent = (
    <Flex
      style={{ height: '100%' }}
      spaceItems={{ default: 'spaceItemsLg' }}
      alignItems={{ default: 'alignItemsFlexStart' }}
      justifyContent={{ default: 'justifyContentFlexStart' }}
      direction={{ default: 'column' }}
    >
      {titleVariant === 'section' && help && (
        <FlexItem>
          <DashboardSectionHeading title={title} help={help} />
        </FlexItem>
      )}
      {linkText && to && (
        <FlexItem>
          <Content data-cy="card-link-text" data-testid="card-link-text" component="small">
            <Link to={to}>{linkText}</Link>
          </Content>
        </FlexItem>
      )}

      {contentValue}
    </Flex>
  );

  return (
    <PageDashboardCard
      id={id}
      title={titleVariant === 'card' ? title : undefined}
      helpTitle={titleVariant === 'card' && help ? title : undefined}
      help={titleVariant === 'card' ? help : undefined}
      width={width ?? 'md'}
    >
      {error ? (
        <EmptyStateError titleProp={errorStateTitle} message={error.message} />
      ) : (
        bodyContent
      )}
    </PageDashboardCard>
  );
}
