import { Help } from '@ansible/ansible-ui-framework/components/Help';
import { Title } from '@patternfly/react-core';
import { ReactNode } from 'react';

export function DashboardSectionHeading({
  title,
  help,
}: Readonly<{
  title: string;
  help: string | ReactNode;
}>) {
  return (
    <>
      <Title
        headingLevel="h4"
        size="lg"
        style={{ display: 'inline-block', verticalAlign: '-0.15em', lineHeight: 1.2 }}
      >
        {title}
      </Title>
      <Help title={title} help={help} />
    </>
  );
}
