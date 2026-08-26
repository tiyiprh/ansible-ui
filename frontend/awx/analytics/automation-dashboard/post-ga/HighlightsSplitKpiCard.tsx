import { Divider, Flex, FlexItem, Icon, Title } from '@patternfly/react-core';
import type { ReactNode } from 'react';
import { PostGaHelpPopover } from './PostGaHelpPopover';

export function HighlightsSplitKpiCard({
  dimensionLabel,
  dimensionIcon,
  metricLabel,
  helpTitle,
  help,
  value,
  caption,
}: Readonly<{
  dimensionLabel: string;
  dimensionIcon: ReactNode;
  metricLabel: string;
  helpTitle: string;
  help: string;
  value: ReactNode;
  caption?: ReactNode;
}>) {
  return (
    <Flex className="post-ga-highlights-split-kpi" alignItems={{ default: 'alignItemsStretch' }}>
      <FlexItem className="post-ga-highlights-split-kpi__dimension">
        <Flex
          direction={{ default: 'column' }}
          alignItems={{ default: 'alignItemsCenter' }}
          gap={{ default: 'gapSm' }}
        >
          <Icon size="xl" status="custom" className="post-ga-accent-icon">
            {dimensionIcon}
          </Icon>
          <Title headingLevel="h4" size="md" style={{ fontWeight: 700, margin: 0, textAlign: 'center' }}>
            {dimensionLabel}
          </Title>
        </Flex>
      </FlexItem>
      <Divider orientation={{ default: 'vertical' }} inset={{ default: 'insetMd' }} />
      <FlexItem className="post-ga-highlights-split-kpi__metric">
        <Flex
          direction={{ default: 'column' }}
          alignItems={{ default: 'alignItemsFlexStart' }}
          gap={{ default: 'gapSm' }}
          className="post-ga-highlights-split-kpi__metric-content"
        >
          <div className="post-ga-highlights-split-kpi__label-row">
            <Title
              headingLevel="h4"
              size="md"
              style={{ display: 'inline-block', verticalAlign: '-0.15em', lineHeight: 1.2, margin: 0 }}
            >
              {metricLabel}
            </Title>
            <PostGaHelpPopover title={helpTitle} help={help} />
          </div>
          {value}
          {caption}
        </Flex>
      </FlexItem>
    </Flex>
  );
}
