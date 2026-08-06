import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

worker.events.on('unhandledException', ({ error }) => {
  // eslint-disable-next-line no-console
  console.warn('[MSW] Unhandled exception:', error);
});
