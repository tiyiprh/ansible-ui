import { lazy } from 'react';
import { createRoot } from 'react-dom/client';

const Main = lazy(() => import('./PlatformMain'));
document.body.innerHTML = '<div id="app"></div>';

const botNameEl = document.createElement('div');
botNameEl.id = 'bot_name';
botNameEl.hidden = true;
botNameEl.textContent = 'Automation Intelligent Assistant';
document.body.appendChild(botNameEl);

document.body.style.backgroundColor = '#222';

async function enableDemoMocks() {
  if (import.meta.env.VITE_DEMO_MODE !== 'true') {
    return;
  }
  const { worker } = await import('../src/mocks/demo/browser');

  const OriginalWebSocket = window.WebSocket;

  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
      options: { updateViaCache: 'none' },
    },
  });

  window.WebSocket = OriginalWebSocket;

  const basePath = import.meta.env.BASE_URL ?? '/';
  if (
    window.location.pathname === basePath ||
    window.location.pathname === basePath.replace(/\/$/, '')
  ) {
    window.history.replaceState({}, '', `${basePath}decisions/rulebook-activations`);
  }
}

void enableDemoMocks()
  .catch((e: unknown) => {
    // eslint-disable-next-line no-console
    console.error('[demo] MSW failed to start:', e);
  })
  .then(() => {
    const root = createRoot(document.getElementById('app')!);
    root.render(<Main />);
  });
