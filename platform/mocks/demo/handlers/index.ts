import { awxHandlers } from './awx';
import { edaHandlers } from './eda';
import { gatewayHandlers } from './gateway';
import { metricsHandlers } from './metrics';

export const handlers = [...gatewayHandlers, ...metricsHandlers, ...edaHandlers, ...awxHandlers];
