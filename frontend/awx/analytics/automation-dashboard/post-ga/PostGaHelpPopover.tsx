import { Icon, Popover, Stack, StackItem } from '@patternfly/react-core';
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import { ReactNode } from 'react';

function renderBodyContent(help: string | string[] | ReactNode) {
  if (Array.isArray(help)) {
    return (
      <Stack hasGutter>
        {help.map((item) => (
          <StackItem key={typeof item === 'string' ? item : String(item)}>{item}</StackItem>
        ))}
      </Stack>
    );
  }
  return help;
}

/** PatternFly default help popover — gray question-circle icon, click to open. */
export function PostGaHelpPopover({
  title,
  help,
}: Readonly<{
  title?: string;
  help?: string | string[] | ReactNode;
}>) {
  if (!help) {
    return null;
  }

  return (
    <Popover headerContent={title} bodyContent={renderBodyContent(help)} triggerAction="click">
      <button type="button" aria-label={title} className="post-ga-help-popover-trigger">
        <Icon size="sm" status="custom" className="post-ga-help-popover-trigger__icon">
          <OutlinedQuestionCircleIcon />
        </Icon>
      </button>
    </Popover>
  );
}
