import { Tooltip } from '@patternfly/react-core';
import { ReactNode } from 'react';

export function DisabledControlTooltip(
  props: Readonly<{
    isDisabled: boolean;
    content: string | undefined;
    children: ReactNode;
    display?: 'block' | 'inline-block';
  }>
) {
  const { isDisabled, content, children, display = 'block' } = props;

  if (!isDisabled || !content) {
    return children;
  }

  return (
    <Tooltip content={content}>
      <span style={{ display, cursor: 'not-allowed' }}>{children}</span>
    </Tooltip>
  );
}
