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
  if (import.meta.env.VITE_DEMO_MODE !== 'true') return;
  const { worker } = await import('../mocks/demo/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  });
}

void enableDemoMocks().then(() => {
  const basePath = (import.meta.env.BASE_URL as string) ?? '/';
  // In demo mode, redirect from the root to the Post GA dashboard
  if (
    import.meta.env.VITE_DEMO_MODE === 'true' &&
    (window.location.pathname === basePath || window.location.pathname === basePath.replace(/\/$/, ''))
  ) {
    window.history.replaceState({}, '', `${basePath}analytics/automation-dashboard/post-ga/dashboard`);
  }
  const root = createRoot(document.getElementById('app')!);
  root.render(<Main />);
});
