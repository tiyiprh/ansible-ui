import { edaHandlers } from './eda';
import { gatewayHandlers } from './gateway';

export const handlers = [...gatewayHandlers, ...edaHandlers];
