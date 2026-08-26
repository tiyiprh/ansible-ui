import { PostGaHelpPopover } from './PostGaHelpPopover';
import {
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  EmptyStateBody,
  Title,
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { PageLoadingTable } from '../../../../../framework/PageTable/PageLoadingTable';

export function LeaderboardPanelCard({
  id,
  title,
  help,
  children,
  isEmpty,
  emptyTitle,
  emptyBody,
  loading,
  fitContent = false,
  height = 320,
  style,
  actions,
}: Readonly<{
  id: string;
  title: string;
  help: string;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
  loading?: boolean;
  /** When true, card grows to fit table content (e.g. top 10 + you row) without scrolling. */
  fitContent?: boolean;
  height?: number;
  /** Additional styles merged onto the card (e.g. marginBottom when stacked between sections). */
  style?: React.CSSProperties;
  /** Optional content rendered right-aligned in the card header (e.g. rank summary). */
  actions?: React.ReactNode;
}>) {
  return (
    <Card
      id={id}
      data-testid={id}
      style={{
        height: fitContent ? 'auto' : height,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        flexShrink: 0,
        ...style,
      }}
    >
      <CardHeader actions={actions ? { actions: <>{actions}</>, hasNoOffset: true } : undefined}>
        <div style={{ whiteSpace: 'nowrap' }}>
          <Title
            headingLevel="h3"
            size="lg"
            style={{ display: 'inline-block', verticalAlign: '-0.15em', lineHeight: 1.2 }}
          >
            {title}
          </Title>
          <PostGaHelpPopover title={title} help={help} />
        </div>
      </CardHeader>
      <CardBody
        style={{
          flex: fitContent ? '0 0 auto' : 1,
          minHeight: 0,
          overflow: fitContent ? 'visible' : 'auto',
          padding: isEmpty || loading ? undefined : 0,
        }}
      >
        {loading ? (
          <PageLoadingTable rows={5} />
        ) : isEmpty ? (
          <EmptyState variant="sm" headingLevel="h4" titleText={emptyTitle} icon={CubesIcon}>
            <EmptyStateBody>{emptyBody}</EmptyStateBody>
          </EmptyState>
        ) : (
          children
        )}
      </CardBody>
    </Card>
  );
}
