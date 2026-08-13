import { Help } from '@ansible/ansible-ui-framework/components/Help';
import { Title } from '@patternfly/react-core';
import { ReactNode } from 'react';

export function DashboardSectionHeading({
  title,
  help,
  size = 'lg',
}: Readonly<{
  title: string;
  /** Omit when the definition is already shown as visible text (e.g. a description line). */
  help?: string | ReactNode;
  /**
   * 'lg' (default) matches the GA Dashboard card-title scale (h3 xl) — used by nested
   * Cost calculation KPIs (AAP-85859). Post-GA Highlights cards sit under a smaller,
   * experimental page title (see AutomationDashboardPostGA.tsx `titleHeadingLevel="h2"`),
   * so their card titles and section titles both drop one step to 'lg' / 'md' to keep the
   * same relative hierarchy without colliding.
   */
  size?: 'lg' | 'md';
}>) {
  return (
    <>
      <Title
        headingLevel="h4"
        size={size}
        style={{ display: 'inline-block', verticalAlign: '-0.15em', lineHeight: 1.2 }}
      >
        {title}
      </Title>
      {help ? <Help title={title} help={help} /> : null}
    </>
  );
}
