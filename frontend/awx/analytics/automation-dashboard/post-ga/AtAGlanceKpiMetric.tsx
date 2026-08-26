import { Flex, Icon } from '@patternfly/react-core';
import type { ReactNode } from 'react';
import { DashboardSectionHeading } from './DashboardSectionHeading';
import { MetricLabel, MetricValue } from './DashboardMetricText';

type KpiIconStatus = 'info' | 'success' | 'warning' | 'danger' | 'custom';

export function AtAGlanceKpiMetric({
  label,
  help,
  description,
  value,
  valueElement,
  icon,
  iconStatus,
  caption,
  labelWrap,
}: Readonly<{
  label?: string;
  /** Omit when `description` already shows the definition as visible text. */
  help?: string;
  /** Visible one-line definition shown under the label, as an alternative to a hover-only help popover. */
  description?: string;
  value?: string;
  /** Custom element to render instead of the default MetricValue. Use for linked text or smaller values. */
  valueElement?: ReactNode;
  icon: ReactNode;
  iconStatus: KpiIconStatus;
  /** Optional small caption rendered under the value, still centered with the rest of the tile. */
  caption?: ReactNode;
  /** Allow the label row to wrap (e.g. long inline template names). */
  labelWrap?: boolean;
}>) {
  return (
    <Flex
      direction={{ default: 'column' }}
      alignItems={{ default: 'alignItemsCenter' }}
      gap={{ default: 'gapSm' }}
      className="post-ga-at-a-glance-kpi"
    >
      <Icon size="xl" status={iconStatus}>
        {icon}
      </Icon>
      {label ? (
        <div
          className={
            labelWrap
              ? 'post-ga-at-a-glance-kpi-heading post-ga-at-a-glance-kpi-heading--wrap'
              : 'post-ga-at-a-glance-kpi-heading'
          }
        >
          <DashboardSectionHeading title={label} help={help} size="md" />
        </div>
      ) : null}
      {description ? <MetricLabel>{description}</MetricLabel> : null}
      {valueElement ?? (value ? <MetricValue>{value}</MetricValue> : null)}
      {caption}
    </Flex>
  );
}
