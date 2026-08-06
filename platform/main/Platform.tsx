import { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { demoDashboardUrl, isDemoLandingPath } from './demoPrototypePaths';

const Main = lazy(() => import('./PlatformMain'));
document.body.innerHTML = '<div id="app"></div>';

const botNameEl = document.createElement('div');
botNameEl.id = 'bot_name';
botNameEl.hidden = true;
botNameEl.textContent = 'Automation Intelligent Assistant';
document.body.appendChild(botNameEl);

document.body.style.backgroundColor = '#222';

async function enableDemoMocks() {
  if (import.meta.env.VITE_DEMO_MODE !== 'true') return;
  const { worker } = await import('../mocks/demo/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  });
}

void enableDemoMocks().then(() => {
  const basePath = (import.meta.env.BASE_URL as string) ?? '/';
  // In demo mode, redirect root and legacy standalone bookmark to the Post GA dashboard tab
  if (import.meta.env.VITE_DEMO_MODE === 'true' && isDemoLandingPath(window.location.pathname, basePath)) {
    window.history.replaceState({}, '', demoDashboardUrl(basePath));
  }
  const root = createRoot(document.getElementById('app')!);
  root.render(<Main />);
});
